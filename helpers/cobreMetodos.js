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

module.exports = {
    moveMoney
}