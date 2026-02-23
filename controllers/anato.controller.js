const { crearContact, crearCompany, crearNegociacion } = require('../helpers/bitrixMetodos');

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

    return res.json({ success: true, contactId, companyId, dealResult });
  } catch (error) {
    console.error('anato.validationAgency error', error);
    return res.status(500).json({ message: 'Error creando agencia en Bitrix', error: error.message || error });
  }
};

module.exports = { validationAgency };
