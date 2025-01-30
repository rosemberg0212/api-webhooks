const { authentication } = require('../middleware/auth_cobre')
const { v4: uuidv4 } = require('uuid');

const moveMoney = async (total, negociacionId) => {
    try {
        const ahora = Date.now();
        const mañanaTimestamp = ahora + (24 * 60 * 60 * 1000);
        const mañana = new Date(mañanaTimestamp);

        const token = await authentication()
        const myHeaders = new Headers();
        myHeaders.append("idempotency", uuidv4());
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            "source_id": "cp_DVZOfwkXK7",
            "destination_id": "acc_Goi6VJ9mgY",
            "amount": `${total}00`,
            "metadata": {
                "r2p_methods": [
                    "pse",
                    "nequi",
                    "bancolombia"
                ],
                "description_to_payer": "Pago pasadia",
                "redirect_url": "https://www.gehsuites.com/es",
                "description_to_beneficiary_account": "Pago de pasadia",
                "valid_until": mañana
            },
            "external_id": negociacionId,
            "checker_approval": false
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        const response = await fetch("https://api.cobre.co/v1/money_movements", requestOptions)
        if (response.ok) {
            const data = await response.json()
            // console.log(data)
            return data
        } else {
            console.log('Error en la peticion')
        }
    } catch (error) {
        console.log('Ocurrio un error', error)
    }
}

const obtainAllCounterparties = async (targetId, page = 0) => {
    try {
        const token = await authentication()
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        const response = await fetch(`https://api.cobre.co/v1/counterparties?sensitive_data=true&page_number=${page}`, requestOptions)

        const data = await response.json()
        // Buscar la contraparte en la página actual
        const found = data.contents.find(counterparty => counterparty.metadata.counterparty_id_number === targetId);
        if (found) {
            return found; // Retorna la contraparte si se encuentra
        }
        // Si no se encontró y hay más páginas, seguir buscando
        if (!data.is_last_page) {
            return await obtainAllCounterparties(targetId, page + 1);
        }
    } catch (error) {
        console.error('Error al buscar la contraparte:', error);
        return null;
    }


}

const MoveMoneyACH = async (datos) => {
    const token = await authentication()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
        "source_id": datos.cuenta,
        "destination_id": datos.counterparty,
        "amount": datos.monto,
        "metadata": {
            "description": "Test integracion Amanda"
        },
        "external_id": datos.bitrixId,
        "checker_approval": true
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    };

    const response = await fetch("https://api.cobre.co/v1/money_movements", requestOptions)
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.log('Error en la peticion')
    }
}

module.exports = {
    moveMoney,
    obtainAllCounterparties,
    MoveMoneyACH
}