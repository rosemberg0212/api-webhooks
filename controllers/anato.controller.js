const { OpenAI } = require('openai');
const { crearContact, crearCompany, crearNegociacion, updateDealGlobal } = require('../helpers/bitrixMetodos');
const { sendGmailMessage } = require('../helpers/gmailApi');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Prompt para extraer información de tarjeta de agencia
const getBusinessCardPrompt = () => `
Analiza la imagen de una tarjeta de agencia y extrae los siguientes datos:
- nombre_contacto: nombre de la persona
- apellido_contacto: apellido de la persona
- email: correo electrónico
- telefono: número de teléfono (solo el número)
- notas: cualquier información adicional relevante (servicios, ubicación, etc.)

Responde SIEMPRE en formato JSON válido con la estructura:
{
  "nombre_contacto": "nombre o vacío si no encontraste",
  "apellido_contacto": "apellido o vacío si no encontraste",
  "email": "email o vacío si no encontraste",
  "telefono": "teléfono o vacío si no encontraste",
  "notas": "información adicional o vacío"
}

Si no puedes leer la imagen o no es una tarjeta, devuelve todos los campos vacíos pero mantén la estructura JSON.
`;

const validationAgency = async (req, res) => {
  const { nombre_contacto, apellido_contacto, email, telefono, nombre_agencia, notas } = req.body;

  try {
    // Crear contacto
    const contactId = await crearContact({ nombre: nombre_contacto, apellido: apellido_contacto, email, telefono });

    // Crear compañia
    const companyId = await crearCompany({ nombre: nombre_agencia, email, telefono });

    if (!contactId || !companyId) {
      return res.status(500).json({ message: 'Error creando contacto o compañía en Bitrix' });
    }

    // Crear negociacion (deal)
    const dealPayload = {
      fields: {
        TITLE: nombre_agencia,
        TYPE_ID: 'SALE',
        STAGE_ID: 'C34:NEW',
        CURRENCY_ID: 'COP',
        OPPORTUNITY: 0,
        CONTACT_ID: contactId,
        COMPANY_ID: companyId,
        CATEGORY_ID: '34',
        UF_CRM_1718396768717: notas || '',
        UF_CRM_1720560646984: '13842',
      },
      params: { REGISTER_SONET_EVENT: 'Y' },
    };

    const dealResult = await crearNegociacion(dealPayload);

    // Enviar correo de agradecimiento a la agencia / contacto
    try {
      const asunto = 'Pendientes EPTU encuentro profesional de turismo';
      const nombreContacto = nombre_contacto || '';
      const nombreEmpresa = nombre_agencia || '';
      const cuerpo = `Estimados ${nombreEmpresa},\n\nQuiero agradecerle sinceramente por el valioso tiempo que nos dedicó durante el marco del EPTU encuentro profesional de turismo para conocer más sobre geh Suites y escuchar nuestra presentación. Fue un gran placer conversar con usted y entender un poco más sobre ${nombreEmpresa}.\n\nNos encantaría tener la oportunidad de profundizar en cómo podemos colaborar y resolver cualquier duda que haya quedado pendiente. Para facilitar el proceso, le comparto un enlace donde puede revisar nuestra disponibilidad y agendar una breve reunión virtual en el horario que mejor se adapte a su agenda:\n\n📅 https://calendly.com/reservas-gehsuites/30min\n\nQuedamos a su entera disposición y esperamos poder conversar nuevamente muy pronto.\n\nAtentamente,\nGeh Suites Hoteles`;

      if (email) {
        await sendGmailMessage(email, asunto, cuerpo);
      } else {
        console.log('validationAgency: no hay email para enviar agradecimiento');
      }
    } catch (mailErr) {
      console.error('Error enviando correo de agradecimiento:', mailErr);
    }

    return res.json({ success: true, contactId, companyId, dealResult });
  } catch (error) {
    console.error('anato.validationAgency error', error);
    return res.status(500).json({ message: 'Error creando agencia en Bitrix', error: error.message || error });
  }
};

const extractAgencyFromImage = async (req, res) => {
  try {
    const { imagen_url, deal_title } = req.body;

    if (!imagen_url) {
      return res.status(400).json({ message: 'imagen_url es requerido' });
    }
    if (!deal_title || !deal_title.trim()) {
      return res.status(400).json({ message: 'deal_title es requerido para el título de la negociación' });
    }

    // Llamar a OpenAI con la imagen
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: getBusinessCardPrompt()
            },
            {
              type: "image_url",
              image_url: {
                "url": imagen_url,
              },
            },
          ],
        },
      ],
    });

    const textResponse = response.choices[0].message.content;
    
    // Extraer JSON de la respuesta
    const jsonMatch = textResponse.match(/{[^]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ message: 'No se pudo extraer datos de la imagen' });
    }

    const extractedData = JSON.parse(jsonMatch[0]);

    // Si todos los campos están vacíos, devolver advertencia
    const hasData = Object.values(extractedData).some(val => val && val.trim());
    if (!hasData) {
      return res.json({ 
        success: false, 
        message: 'No se encontraron datos en la imagen',
        extracted: extractedData 
      });
    }

    // Si hay datos, proceder a crear contacto y compañía; la negociación usará deal_title del body
    try {
      const { nombre_contacto, apellido_contacto, email, telefono, notas } = extractedData;

      // Crear contacto
      const contactId = await crearContact({ 
        nombre: nombre_contacto || '', 
        apellido: apellido_contacto || '', 
        email: email || '', 
        telefono: telefono || '' 
      });

      // Crear compañia
      const companyId = await crearCompany({ 
        nombre: deal_title, 
        email: email || '', 
        telefono: telefono || '' 
      });

      if (!companyId) {
        return res.status(500).json({ 
          message: 'Error creando compañía en Bitrix',
          extracted: extractedData 
        });
      }

      // Crear negociacion (deal)
      const dealPayload = {
        fields: {
          TITLE: deal_title,
          TYPE_ID: 'SALE',
          STAGE_ID: 'C34:NEW',
          CURRENCY_ID: 'COP',
          OPPORTUNITY: 0,
          CONTACT_ID: contactId || 0,
          COMPANY_ID: companyId,
          CATEGORY_ID: '34',
          UF_CRM_1718396768717: notas || '',
          UF_CRM_1720560646984: '13940',
        },
        params: { REGISTER_SONET_EVENT: 'Y' },
      };

      const dealResult = await crearNegociacion(dealPayload);
      // Enviar correo de agradecimiento si existe email
      try {
        const asunto = 'Pendientes EPTU encuentro profesional de turismo';
        const nombreContacto = nombre_contacto || '';
        const nombreEmpresa = deal_title || '';
        const cuerpo = `Estimados ${nombreEmpresa},\n\nQuiero agradecerle sinceramente por el valioso tiempo que nos dedicó durante el marco del EPTU encuentro profesional de turismo para conocer más sobre geh Suites y escuchar nuestra presentación. Fue un gran placer conversar con usted y entender un poco más sobre ${nombreEmpresa}.\n\nNos encantaría tener la oportunidad de profundizar en cómo podemos colaborar y resolver cualquier duda que haya quedado pendiente. Para facilitar el proceso, le comparto un enlace donde puede revisar nuestra disponibilidad y agendar una breve reunión virtual en el horario que mejor se adapte a su agenda:\n\n📅 https://calendly.com/reservas-gehsuites/30min\n\nQuedamos a su entera disposición y esperamos poder conversar nuevamente muy pronto.\n\nAtentamente,\nGeh Suites Hoteles`;

        if (email) {
          await sendGmailMessage(email, asunto, cuerpo);
        } else {
          console.log('extractAgencyFromImage: no hay email para enviar agradecimiento');
        }
      } catch (mailErr) {
        console.error('Error enviando correo de agradecimiento desde imagen:', mailErr);
      }

      return res.json({ 
        success: true, 
        message: 'Agencia registrada desde imagen',
        extracted: extractedData,
        contactId: contactId || null,
        companyId, 
        dealResult 
      });
    } catch (error) {
      console.error('Error en registro de agencia:', error);
      return res.json({ 
        success: false,
        message: 'Datos extraídos pero hubo error al registrar en Bitrix',
        error: error.message,
        extracted: extractedData 
      });
    }

  } catch (error) {
    console.error('anato.extractAgencyFromImage error', error);
    return res.status(500).json({ 
      message: 'Error procesando imagen', 
      error: error.message || error 
    });
  }
};

const updateAgency = async (req, res) => {
  try {
    const { deal_id, notas } = req.body;

    if (!deal_id) {
      return res.status(400).json({ 
        message: 'deal_id es requerido',
        example: {
          deal_id: '123',
          notas: 'Nuevas notas para la negociación'
        }
      });
    }

    try {
      const dealPayload = {
        id: deal_id,
        fields: {
          UF_CRM_1718396768717: notas || '',
        },
      };

      await updateDealGlobal(dealPayload);

      return res.json({ 
        success: true, 
        message: 'Notas de negociación actualizadas correctamente',
        deal_id,
        notas: notas || ''
      });
    } catch (error) {
      console.error(`Error actualizando notas de negociación:`, error);
      return res.status(500).json({ 
        message: 'Error actualizando notas en Bitrix', 
        error: error.message || error 
      });
    }
  } catch (error) {
    console.error('anato.updateAgency error', error);
    return res.status(500).json({ 
      message: 'Error procesando actualización', 
      error: error.message || error 
    });
  }
};

module.exports = { validationAgency, extractAgencyFromImage, updateAgency };
