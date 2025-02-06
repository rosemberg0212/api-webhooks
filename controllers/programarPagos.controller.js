const { getDeal, getCompany, obtainAllCounterparties, MoveMoneyACH, updateDealGlobal, empresaCobres } = require('../helpers/index')
const {authenticationMultiples} = require('../middleware/auth_cobre')

const programarPagos = async (req, res) => {
    // const { id } = req.body
    const { id } = req.query
    const deal = await getDeal(id);
    const company_id = deal.COMPANY_ID;
    const razonSocial = deal.UF_CRM_1714764463;
    // const monto = (deal.UF_CRM_1719433473082.replace(/\|COP/g, ""));
    const monto =( Number(deal.OPPORTUNITY)).toFixed(0);
    const company = await getCompany(company_id)
    const NIT = company.UF_CRM_1725986436
    const empresa = empresaCobres(razonSocial)
    const token = await authenticationMultiples(empresa.empresa)
    const counterparties = await obtainAllCounterparties(NIT, token)
    // console.log(token)
    

    if (counterparties) {
        console.log('se encontro:', counterparties)

        const datos = {
            cuenta: empresa.cuenta_cobre,
            counterparty: counterparties.id,
            monto: `${monto}00`,
            bitrixId: deal.ID,
            tokenG : token
        }
        console.log(datos)
        await MoveMoneyACH(datos)
    } else {
        console.log('No se encontro') 
    }
    // console.log(deal)
    res.status(200).end();
}

const obtenerDatosPago = async (req, res) => { 
    const { ...body } = req.body
    console.log(body)
    const datos = {
        id: body.content.external_id,
        status: body.content.status.state,
        amount: body.content.amount,
        fecha_evento: body.created_at,
        referencia: body.content.id
    }

    const datosUpdate = {
        id: datos.id, // ID de la negociación a actualizar
        fields: {
            // STAGE_ID: 'LOSE',
            UF_CRM_1718396179138: Number(datos.amount / 100),
            UF_CRM_1718396297448: datos.fecha_evento,
            UF_CRM_1718397018945: datos.referencia,
            UF_CRM_1719519638392: datos.status,
            UF_CRM_1718394865311: "12600",
            UF_CRM_1718396464904: "12604"
        }
    };
    await updateDealGlobal(datosUpdate)



    const myHeaders = new Headers();
myHeaders.append("", "");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "id": 115006
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:8080/hook/pagos/cobre?id=115006", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
    // console.log(datos)
}

module.exports = { 
    programarPagos,
    obtenerDatosPago
}