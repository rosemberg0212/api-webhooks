const getDeal = async (id) => {

    const api_key = process.env.APIKEY_BITRIX;

    const requestOptions = {
        method: "POST",
        // headers: myHeaders,
        redirect: "follow"
    };

    
        const prospecto = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.get.json?ID=${id}`, requestOptions);
        const result = await prospecto.json();
        const data = result.result
        console.log(data);
}