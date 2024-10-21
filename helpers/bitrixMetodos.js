
const getDeal = async (id) => {

    try {
        // const { id } = req.params
        // const id = '2580'
        const api_key = process.env.APIKEY_BITRIX;

        const requestOptions = {
            method: "POST",
            // headers: myHeaders,
            redirect: "follow"
        };

        const prospecto = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.get.json?ID=${id}`, requestOptions);
        if (prospecto.ok) {
            const result = await prospecto.json();
            const data = result.result
            return data
        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', prospecto.status);
            const errorMessage = await prospecto.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.log(error)
    }
}

const getContact = async (id) => {

    try {
        const api_key = process.env.APIKEY_BITRIX;

        const requestOptions = {
            method: "POST",
            // headers: myHeaders,
            redirect: "follow"
        };

        const contacto = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.contact.get.json?ID=${id}`, requestOptions);
        if (contacto.ok) {
            const result = await contacto.json();
            return result
        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', contacto.status);
            const errorMessage = await contacto.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.log(error)
    }
}

const getListDeal = async (id) => {

    try {
        let start = 0;
        let allDeals = [];
        let hasMore = true;
        const api_key = process.env.APIKEY_BITRIX;

        const requestOptions = {
            method: "POST",
            // headers: myHeaders,
            redirect: "follow"
        };
        while (hasMore) {

            const response = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.list.json?FILTER[STAGE_ID]=C6:WON&SELECT[]=TITLE&SELECT[]=UF_CRM_6635150DE95EB&SELECT[]=UF_CRM_1715689729&start=${start}`, requestOptions)

            const result = await response.json();
            const data = result.result
            allDeals = allDeals.concat(data);

            // Si hay más resultados, 'next' tendrá un valor. Si no, será null.
            if (result.next) {
                start = result.next
            } else {
                hasMore = false;
            }

        }

        return allDeals;
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    getDeal,
    getContact,
    getListDeal
}