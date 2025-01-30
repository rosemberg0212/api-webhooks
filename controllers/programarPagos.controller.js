const {getDeal, getCompany, obtainAllCounterparties, MoveMoneyACH} = require('../helpers/index')

const programarPagos = async (req, res) =>{
    const {id} = req.body
    const deal = await getDeal(id);
    const company_id = deal.COMPANY_ID;
    const razonSocial = deal.UF_CRM_1714764463;
    const monto = (deal.UF_CRM_1719433473082.replace(/\|COP/g, ""));
    const company = await getCompany(company_id)
    const NIT = company.UF_CRM_1725986436
    const counterparties = await obtainAllCounterparties(NIT)
    if (counterparties) {
        console.log('se encontro:', counterparties)

        const datos = {
            cuenta: 'acc_P0PimbQSPO',
            counterparty: counterparties.id,
            monto: `${monto}00`,
            bitrixId: deal.ID
        }
        await MoveMoneyACH(datos)
        // console.log(datos)
    } else {
        console.log('No se encontro')
    }
    // console.log(deal)
    res.status(200).end();
}

module.exports = {
    programarPagos
}