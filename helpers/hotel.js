const hotelId = (hotel) => {
    let hotel_id;

    switch (hotel) {
        case '3162':
            hotel_id = 9
            return hotel_id

        case '3164':
            hotel_id = 6
            return hotel_id

        case '3166':
            hotel_id = 1
            return hotel_id

        case '3168':
            hotel_id = 7
            return hotel_id

        case '5094':
            hotel_id = 5
            return hotel_id

        case '3170':
            hotel_id = 4
            return hotel_id

        case '3178':
            hotel_id = 3
            return hotel_id

        case '3180':
            hotel_id = 10
            return hotel_id

        case '3182':
            hotel_id = 8
            return hotel_id

        case '3184':
            hotel_id = 2
            return hotel_id

        case '12636':
            hotel_id = 48
            return hotel_id

        case '12640':
            hotel_id = 44
            return hotel_id
        default:
            return 'Hotel no valido o no esta registrado en sistema';
    }
}

const userContac = [
    {
        name: 'Rosemberg',
        id: 14
    },
    // {
    //     name: 'Angela',
    //     id: 30
    // },
    {
        name: 'Wendy De Avila',
        id: 8882
    },
    {
        name: 'Sofia Garay',
        id: 8874
    },
    {
        name: 'Elvia Mendivil',
        id: 6050
    },
    {
        name: 'Leidys Johanna',
        id: 4776
    },
    {
        name: 'Maria Orozco',
        id: 66
    },
    {
        name: 'Briannys',
        id: 42
    },
    {
        name: 'Adriana Hernandez',
        id: 28
    },
    {
        name: 'Yaislusmar Moreno',
        id: 84
    },
    {
        name: 'Brenda De la Espriella',
        id: 40
    },
    {
        name: 'Eyleen Margarita',
        id: 102
    },
    {
        name: 'Daniela Bermudez',
        id: 11492
    },
    {
        name: 'Marys Rosales',
        id: 11638
    },
    {
        name: 'Yineth Tamara',
        id: 18068
    },
    {
        name: 'Maureen Mora',
        id: 26998
    },
    {
        name: 'Belcy Pérez',
        id: 38
    },
]

const hotelContacto = (hotel) => {
    switch (hotel) {
        case 'Hotel Aixo':
            return hotel_id = 54874


        case 'Hotel Avexi':
            return hotel_id = 43348


        case 'Hotel Abi':
            return hotel_id = 38650


        case 'Hotel Axis':
            return hotel_id = 55682


        case 'Hotel Azuan':
            return hotel_id = 53568


        case 'Hotel Bocagrande':
            return hotel_id = 55152


        case 'Hotel Boquilla':
            return hotel_id = 6656


        case 'Hotel Madisson':
            return hotel_id = 52804


        case 'Hotel Marina':
            return hotel_id = 43322


        case 'Hotel Rodadero':
            return hotel_id = 55684


        case 'Hotel Sansiraka':
            return hotel_id = 55214


        case 'Hotel Windsor':
            return hotel_id = 48644
            
        case 'Hotel Playa Salguero':
            return hotel_id = 150770

        default:
            return 'Hotel no valido o no esta registrado en sistema';
    }
}

const empresaRecibo = (empresa) => {
    let prom = ''
    switch (empresa) {
        case 'Aguas de Cartagena':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa aguas de Cartagena, necesito que analices y me extraigas la siguiente información en formato json: 

                empresa": "nombre de la empresa".
                "tipo_servicio": "tipo de servicio".
                "numero_contrato": "numero de contrato o NIC o POLIZA".
                "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
                "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
                valor_consumo: el valor total que se encuentra en la seccion de ACUEDUCTO Y ALCANTARILLADO, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0
                valor_servicios: el valor total que se encuentra en la seccion de ASEO, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0
                valor_total_a_pagar: el valor total a pagar, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0`
            return prom;

        case 'Afinia':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa Afinia, necesito que analices y me extraigas la siguiente información en formato json:
                empresa": "nombre de la empresa".
                "tipo_servicio": "tipo de servicio".
                "numero_contrato": "numero de contrato o NIC o POLIZA".
                "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
                "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
                valor_consumo: el valor total que se encuentra en la primera seccion de Energia, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0
                valor_servicios: el valor total que se encuentra en la seccion de alumbrado publico, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0
                valor_total_a_pagar: el valor total a pagar, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0`
            return prom;

        case 'Vatia':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa Vatia, necesito que analices y me extraigas la siguiente información en formato json:
                empresa": "nombre de la empresa".
                "tipo_servicio": "tipo de servicio".
                "numero_contrato": "es el campo llamado Id interno".
                "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
                "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
                valor_consumo: el valor total que se encuentra en la seccion Detalles cobros de energia en el item de Energia + contribución, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0
                valor_servicios: el valor total que se encuentra en la seccion Detalles otros cobros en el item de Alumbrado Pub Vlr, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0
                valor_total_a_pagar: el valor total a pagar, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0`
            return prom;

        case 'Surtigas':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa Surtigas, necesito que analices y me extraigas la siguiente información en formato json:
                empresa": "nombre de la empresa".
                "tipo_servicio": "tipo de servicio".
                "numero_contrato": "numero de contrato o NIC o POLIZA".
                "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
                "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
                valor_consumo: el valor total a pagar, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0
                valor_servicios: colocalo en 0
                valor_total_a_pagar: el valor total a pagar, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0`
            return prom;

        case 'Aire':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa Aire, necesito que analices y me extraigas la siguiente información en formato json:
                empresa": "nombre de la empresa".
                "tipo_servicio": "tipo de servicio".
                "numero_contrato": "numero de contrato o NIC o POLIZA".
                "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
                "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
                valor_consumo: es el valor que se encuentra en la seccion de Energía que suma los item de Energía Mes + Estado de cuenta, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0.
                valor_servicios: es el valor a pagar que resulta de la suma de las secciones Otros Servicios + Impuestos y Tasas, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0.
                valor_total_a_pagar: el valor total a pagar, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0`
            return prom;

        case 'Gases del caribe':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa Gases del caribe, necesito que analices y me extraigas la siguiente información en formato json:
                empresa": "nombre de la empresa".
                "tipo_servicio": "tipo de servicio".
                "numero_contrato": "numero de contrato o NIC o POLIZA".
                "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
                "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
                valor_consumo: el valor total a pagar, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0
                valor_servicios: colocalo en 0
                valor_total_a_pagar: el valor total a pagar, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0`
            return prom;

        case 'ESSMAR ESP':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa ESSMAR ESP, necesito que analices y me extraigas la siguiente información en formato json:
            empresa": "nombre de la empresa".
            "tipo_servicio": "tipo de servicio".
            "numero_contrato": "numero de contrato o NIC o POLIZA".
            "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
            "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
            valor_consumo: es el valor total que se encuentra en el item de Acueducto (coloca solo los numeros, y no tengas en cuenta lo que esta despues de un punto porque son decimales, solo toma encuenta lo que esta antes y despues de una coma)
            valor_servicios: es el valor total que se encuentra en el item de Alcantarillado, (coloca solo los numeros, y no tengas en cuenta lo que esta despues de un punto porque son decimales, solo toma encuenta lo que esta antes y despues de una coma), 
            valor_total_a_pagar: el valor total a pagar, (coloca solo los numeros, y no tengas en cuenta lo que esta despues de un punto porque son decimales, solo toma encuenta lo que esta antes y despues de una coma),`
            return prom;

        case 'CONECTATE - ISP':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa CONECTATE - ISP, necesito que analices y me extraigas la siguiente información en formato json:
            empresa": "nombre de la empresa".
            "tipo_servicio": "tipo de servicio".
            "numero_contrato": "numero de contrato o NIC o POLIZA".
            "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
            "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
            valor_consumo: el valor total a pagar
            valor_servicios: 0
            valor_total_a_pagar: el valor total a pagar`
            return prom;

        case 'Claro':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa Claro, necesito que analices y me extraigas la siguiente información en formato json:
            empresa": "nombre de la empresa".
            "tipo_servicio": "tipo de servicio".
            "numero_contrato": "numero de contrato o NIC o POLIZA".
            "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
            "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
            valor_consumo: el valor total a pagar
            iva: valor total del iva
            valor_servicios: 0
            valor_total_a_pagar: el valor total a pagar`
            return prom;

        case 'IFX':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa ifx networks, necesito que analices y me extraigas la siguiente información en formato json:
            empresa": "nombre de la empresa".
            "tipo_servicio": "tipo de servicio".
            "numero_contrato": "numero de contrato o NIC o POLIZA".
            "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
            "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
            valor_consumo: el valor total a pagar
            iva: valor total del iva
            valor_servicios: 0
            valor_total_a_pagar: el valor total a pagar`
            return prom;

        case 'Tigo':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa Tigo, necesito que analices y me extraigas la siguiente información en formato json:
            empresa": "nombre de la empresa".
            "tipo_servicio": "tipo de servicio".
            "numero_contrato": "numero de contrato o NIC o POLIZA".
            "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
            "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
            valor_consumo: el valor total a pagar
            iva: valor total del iva
            valor_servicios: 0
            valor_total_a_pagar: el valor total a pagar`
            return prom;

        case 'Vanti':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa Vanti, necesito que analices y me extraigas la siguiente información en formato json:
            "empresa": "nombre de la empresa".
            "tipo_servicio": "tipo de servicio".
            "numero_contrato": "numero de contrato o NIC o POLIZA".
            "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
            "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
            valor_consumo: el valor total a pagar
            iva: valor total del iva
            valor_servicios: 0
            valor_total_a_pagar: el valor total a pagar`
            return prom;

        case 'Enel':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa enel, necesito que analices y me extraigas la siguiente información en formato json:
            "empresa": "nombre de la empresa".
            "tipo_servicio": "tipo de servicio".
            "numero_contrato": "numero de cliente o numero de cuenta".
            "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
            "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
            valor_consumo: es el total energia
            iva: valor total del iva
            valor_servicios: es el total aseo
            valor_total_a_pagar: el valor total a pagar`
            return prom;

        case 'Acueducto':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa Acueducto, necesito que analices y me extraigas la siguiente información en formato json:
            "empresa": "nombre de la empresa".
            "tipo_servicio": "tipo de servicio".
            "numero_contrato": "numero de cliente o numero de cuenta".
            "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
            "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
            valor_consumo: NO TOMES EL VALOR TOTAL, PORQUE ESTE NO ES, el valor del consumo se encuentra en la seccion llamada Resumen de su cuenta, en el item Subtotal Acueducto, el valor se encuentra en la sexta o  ultima columna llamada Valor a pagar, no tomes los valores de ninguna de las otras columnas solo de la ultima (coloca solo los numeros, no pongas los puntos o comas).
            iva: valor total del iva o 0 si no hay
            valor_servicios: NO TOMES EL VALOR TOTAL, PORQUE ESTE NO ES, el valor del servicio se encuentra en la seccion llamada Resumen de su cuenta, en el item Subtotal Alcantarillado, el valor se encuentra en en la sexta o ultima columna llamada Valor a pagar, no tomes los valores de ninguna de las otras columnas solo de la ultima (coloca solo los numeros, no pongas los puntos o comas).
            valor_total_a_pagar: el valor total a pagar`
            return prom;

        case 'Movistar':
            prom = `Te voy a mandar una imagen sobre un recibo público de la empresa movistar, necesito que analices y me extraigas la siguiente información en formato json:
                "empresa": "nombre de la empresa".
                "tipo_servicio": "tipo de servicio".
                "numero_contrato": "numero para pagos".
                "fecha_limite_pago": puede ser también fecha de corte o ultimo día de pago sin recargo o fecha de pago oportuno o fecha de vencimiento, en formato año/mes/dia (el año no puede ser menor al año en el que estamos actualmente).
                "periodo_consumo": "año/mes/dia (si no hay dia colocar el primer dia del mes que se esta cobrando, el año no puede ser menor al año en el que estamos actualmente)".
                valor_consumo: el valor total a pagar, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0
                valor_servicios: colocalo en 0
                valor_total_a_pagar: el valor total a pagar, (coloca solo los numeros, no pongas los puntos o comas), si no hay colocar 0`
            return prom;

        default:
            return 'Empresa no valida o no esta registrado en sistema';
    }

}

const empresaCobres = (empresa) => {
    console.log('empresa que llego', empresa)
    switch (empresa) {
        case '1170':
            return {
                empresa: 'econo',
                cuenta_cobre: 'acc_0yXKaILtbB',
                nombre_completo: 'ECONO HOTEL GROUP SAS',
                nit: '901116843'
            }
        case '1172':
            return {
                empresa: 'sociedad',
                cuenta_cobre: 'acc_qIytEIBTjn',
                nombre_completo: 'SOCIEDAD HOTELERA FAM SAS',
                nit: '901718424'
            }
        case '1174':
            return {
                empresa: 'caribe',
                cuenta_cobre: 'acc_udYnswZDl7',
                nombre_completo: 'CARIBE HOTELES & SUITES SAS',
                nit: '900801256'
            }
        case '1176':
            return {
                empresa: 'dt',
                cuenta_cobre: 'acc_crYecLtqJq',
                nombre_completo: 'DT HOTELES & INN SAS',
                nit: '900725984'
            }
        case '1182':
            return {
                empresa: 'smart',
                cuenta_cobre: 'acc_Ix8U3ywSWN',
                nombre_completo: 'SMART STAY SAS',
                nit: '901691840'
            }
        default:
            return 'Empresa no validad'
    }
}

const roomcloudIdTobookingId = (id) =>{
    switch (id) {
        case '13645':
            return {
                name: 'azuan',
                id: 1
            }
        case '13633':
            return {
                name: 'aixo',
                id: 4
            }
        case '13644':
            return {
                name: 'avexi',
                id: 6
            }
        case '13643':
            return {
                name: 'marina',
                id: 9
            }
        case '14364':
            return {
                name: 'bocagrande',
                id: 7
            }
        case '17644':
            return {
                name: 'abi',
                id: 5
            }
        case '18004':
            return {
                name: 'windsor house',
                id: 10
            }
        case '16255':
            return {
                name: 'madisson inn',
                id: 3
            }
        case '17491':
            return {
                name: 'rodadero inn',
                id: 8
            }
        case '19629':
            return {
                name: 'axis inn',
                id: 48
            }
        case '15740':
            return {
                name: 'sansiraka',
                id: 44
            }
    
        default:
            return 'Id no valido';
    }
}

module.exports = {
    hotelId,
    userContac,
    hotelContacto,
    empresaRecibo,
    empresaCobres,
    roomcloudIdTobookingId
}