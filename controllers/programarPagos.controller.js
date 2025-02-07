const { getDeal, getCompany, obtainAllCounterparties, MoveMoneyACH, updateDealGlobal, empresaCobres, enviarMensajeBitrix, correoProveedores, mensajeAlex } = require('../helpers/index')
const { authenticationMultiples } = require('../middleware/auth_cobre')

const programarPagos = async (req, res) => {
    // const { id } = req.body
    const { id } = req.query
    const deal = await getDeal(id);
    const company_id = deal.COMPANY_ID;
    const razonSocial = deal.UF_CRM_1714764463;
    // const monto = (deal.UF_CRM_1719433473082.replace(/\|COP/g, ""));
    const monto = (Number(deal.OPPORTUNITY)).toFixed(0);
    const company = await getCompany(company_id)
    const NIT = company.UF_CRM_1725986436
    const empresa = empresaCobres(razonSocial)
    const token = await authenticationMultiples(empresa.empresa)
    const counterparties = await obtainAllCounterparties(NIT, token)
    const mail = company.EMAIL[0].VALUE
    console.log(mail)


    if (counterparties) {
        console.log('se encontro:', counterparties)

        const datos = {
            cuenta: empresa.cuenta_cobre,
            counterparty: counterparties.id,
            monto: `${monto}00`,
            bitrixId: deal.ID,
            tokenG: token
        }
        console.log(datos)
        await MoveMoneyACH(datos)
    } else {
        console.log('No se encontro')
        await enviarMensajeBitrix(478, `Mensaje: No se pudo encontrar la contraparte`)
    }
    // console.log(deal)
    res.status(200).end();
}

const obtenerDatosPago = async (req, res) => {
    const { ...body } = req.body
    const deal = await getDeal(body.content.external_id);
    const company_id = deal.COMPANY_ID;
    const company = await getCompany(company_id)
    const mail = company.EMAIL[0].VALUE
    const razonSocial = deal.UF_CRM_1714764463;
    const empresa = empresaCobres(razonSocial)
    const n_factura = deal.UF_CRM_1726088234584;
    console.log(mail)
    const datos = {
        id: body.content.external_id,
        status: body.content.status.state,
        amount: body.content.amount,
        fecha_evento: body.created_at,
        referencia: body.content.id
    }

    let datosUpdate
    if (datos.status == 'completed') {
        datosUpdate = {
            id: datos.id, // ID de la negociación a actualizar
            fields: {
                STAGE_ID: 'C54:WON',
                UF_CRM_1718396179138: Number(datos.amount / 100),
                UF_CRM_1718396297448: datos.fecha_evento,
                UF_CRM_1718397018945: datos.referencia,
                UF_CRM_1719519638392: datos.status,
                UF_CRM_1718394865311: "12600",
                UF_CRM_1718396464904: "12604"
            }
        };
        let emailHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
    <img src='https://www.gehsuites.com/images/geh_suites_logo_1_naranja.png'></img>
      <h2 style="text-align: center; color: #ba721c;">Geh Suites te informa que se acaba de realizar el siguiente pago</h2>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p><strong>ID transacción :</strong> ${body.content.id}</p>
      </div>

      <h3 style="text-align: center; color: #007bff;">VALOR PAGADO: ${convertidorMoneda(Number(body.content.amount) / 100)} COP</h3>

      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p><strong>Fecha / Hora:</strong> ${body.created_at}</p>
        <p><strong>Estado de la transacción:</strong> <span style="color: green;">Aprobada</span></p>
        <p><strong>Razón social que emite:</strong> PEXTO COLOMBIA SAS</p>
        <p><strong>Razón social que realiza el pago:</strong> ${empresa.nombre_completo}</p>
        <p><strong>NIT:</strong> ${empresa.nit}</p>
        <p><strong>Numero de factura:</strong> ${n_factura}</p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="#" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Descargar Recibo
        </a>
      </div>

      <p style="text-align: center; font-size: 12px; color: gray; margin-top: 20px;">
        Si tiene alguna pregunta o queja, contacte a <a href="mailto:contabilidad@gehsuites.com">contabilidad@gehsuites.com</a>
      </p>
      <p style="text-align: center; font-size: 12px; color: gray; margin-top: 20px;"><a href="https://www.gehsuites.com/es">https://www.gehsuites.com/es</a>
      </p>
    </div>
  `;
        const datosAlex = {
            numeroUser: '573114033174',
            numeroBot: '573336025414',
            template: 'pagos_cobre_alejandro',
            monto: datos.amount,
            empresa: body.content.source.alias,
            proveedor: company.TITLE,
            fecha: body.created_at
        }
        await correoProveedores(emailHTML, mail, 'Confirmación de pago Geh Suites')
        await mensajeAlex(datosAlex)

    } else {
        datosUpdate = {
            id: datos.id, // ID de la negociación a actualizar
            fields: {
                UF_CRM_1718396179138: Number(datos.amount / 100),
                UF_CRM_1718396297448: datos.fecha_evento,
                UF_CRM_1718397018945: datos.referencia,
                UF_CRM_1719519638392: datos.status,
                UF_CRM_1718394865311: "12600",
                UF_CRM_1718396464904: "12604"
            }
        };
    }


    await updateDealGlobal(datosUpdate)
    // console.log(datosUpdate)
    res.status(200).end();
}

const convertidorMoneda = (monto) => {
    const format = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    });
    return format.format(monto)
};
module.exports = {
    programarPagos,
    obtenerDatosPago
}