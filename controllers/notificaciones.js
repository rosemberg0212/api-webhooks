const { enviarWhatsTemplate } = require('../helpers/apiBotmaker')
const { probandoMail, invitacionWindor } = require('../helpers/apiMail')
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const qr = require('qrcode');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const XlsxPopulate = require('xlsx-populate');

const felizCumple = async (req, res) => {
    const challenge = req.body.challenge;
    res.send({ challenge });

    const apikey = process.env.APIKEY_MONDAY;
    const id = req.body.event.pulseId;
    // const id = '4886261173';
    let tableroId = req.body.event.boardId
    // let tableroId = '3426311372'

    const query = `query  { boards  (ids: ${tableroId}) { items_page (query_params: {ids: ${id}}) { items { id name column_values { id value text }}}}}`;
    const response = await fetch("https://api.monday.com/v2", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apikey
        },
        body: JSON.stringify({
            'query': query
        })
    });

    try {
        if (response.ok) {
            const data = await response.json();
            // console.log(JSON.stringify(data, null, 2));
            const name = data.data.boards[0].items_page.items[0].name
            const datos = data.data.boards[0].items_page.items[0].column_values

            const telefono = datos.find((data)=>{
                return data.id == 'tel_fono_1'
            })
            
            console.log(telefono.text)
            console.log(name)
            // console.log(datos)
            const params = { name: name }
            await enviarWhatsTemplate(telefono.text, '573044564734', 'felicitaciones', params)

        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', response.status);
            const errorMessage = await response.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }

    res.status(200).end();
}

const generarQR = async (req, res) => {
    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;
    const id = req.body.event.pulseId;
    // const id = '5968736518';

    // const query = `query { boards(ids: 5968533711) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
    const query = `query  { boards  (ids: 5968533711) { items_page (query_params: {ids: ${id}}) { items { id name column_values { id value text }}}}}`;
    const response = await fetch("https://api.monday.com/v2", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apikey
        },
        body: JSON.stringify({
            'query': query
        })
    });

    try {
        if (response.ok) {
            const data = await response.json();
            // console.log(JSON.stringify(data, null, 2));
            const contacto = data.data.boards[0].items_page.items[0].column_values[0].text
            const nuemroP = data.data.boards[0].items_page.items[0].column_values[4].text
            const pais = data.data.boards[0].items_page.items[0].column_values[3].text
            const agencia = data.data.boards[0].items_page.items[0].name
            console.log(contacto)
            console.log(agencia)
            console.log(nuemroP)
            console.log(pais)

            const datosPersona = `Nombre: ${contacto}, Agencia: ${agencia}, Pais: ${pais}, Numero de acompañantes: ${nuemroP}`;
            try {
                const codigoQR = await qr.toFile('public/codigo_qr.png', JSON.stringify(datosPersona));
                console.log('Código QR generado y guardado con éxito en public/codigo_qr.png');
            } catch (error) {
                console.error('Error al generar y guardar el código QR:', error);
            }

        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', response.status);
            const errorMessage = await response.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }

    await mandarQR(id)
    res.status(200).end();
}

const mandarQR = async (fila) => {
    let idFila = fila.toString();


    // adapted from: https://gist.github.com/tanaikech/40c9284e91d209356395b43022ffc5cc

    // set filename
    // var upfile = 'public/codigo_qr.png';
    var upfile = './salida.xlsx';

    // set auth token and query
    var API_KEY = process.env.APIKEY_MONDAY
    var query = `mutation ($file: File!) { add_file_to_column (file: $file, item_id: ${idFila}, column_id: "archivo8") { id } }`;

    // set URL and boundary
    var url = "https://api.monday.com/v2/file";
    var boundary = "xxxxxxxxxx";
    var data = "";

    fs.readFile(upfile, function (err, content) {

        // simple catch error
        if (err) {
            console.error(err);
        }

        // construct query part
        data += "--" + boundary + "\r\n";
        data += "Content-Disposition: form-data; name=\"query\"; \r\n";
        data += "Content-Type:application/json\r\n\r\n";
        data += "\r\n" + query + "\r\n";

        // construct file part
        data += "--" + boundary + "\r\n";
        data += "Content-Disposition: form-data; name=\"variables[file]\"; filename=\"" + upfile + "\"\r\n";
        data += "Content-Type:application/octet-stream\r\n\r\n";
        var payload = Buffer.concat([
            Buffer.from(data, "utf8"),
            new Buffer.from(content, 'binary'),
            Buffer.from("\r\n--" + boundary + "--\r\n", "utf8"),
        ]);

        // construct request options
        var options = {
            method: 'post',
            headers: {
                "Content-Type": "multipart/form-data; boundary=" + boundary,
                "Authorization": API_KEY
            },
            body: payload,
        };

        // make request
        fetch(url, options)
            .then(res => res.json())
            .then(json => console.log(json));
    });

}

const requisicones = async (req, res) => {
    const challenge = req.body.challenge;
    res.send({ challenge });

    const apikey = process.env.APIKEY_MONDAY;
    const id = req.body.event.pulseId;
    // const id = '6173065434'
    let tableroId = req.body.event.boardId
    // let tableroId = 6172883646

    const query = `query  { boards  (ids: ${tableroId}) { items_page (query_params: {ids: ${id}}) { items { id name column_values { id value text }}}}}`;
    const response = await fetch("https://api.monday.com/v2", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apikey
        },
        body: JSON.stringify({
            'query': query
        })
    });

    try {
        if (response.ok) {
            const data = await response.json();
            // console.log(JSON.stringify(data, null, 2));
            let itemsOrder = JSON.parse(localStorage.getItem('itemsOrder')) || [];
            const dataMonday = data.data.boards[0].items_page.items[0].column_values

            const hotel = data.data.boards[0].items_page.items[0].column_values[1].text
            const proveedor = data.data.boards[0].items_page.items[0].column_values[2].text
            console.log(hotel)
            console.log(proveedor)
            const productos = dataMonday.filter(obj => obj.id !== 'subelementos' && obj.id !== 'bot_n0' && obj.id !== 'bot_n5' && obj.id !== 'bot_n' && obj.id !== 'selecci_n_m_ltiple6' && obj.id !== 'pulse_log' && obj.id !== 'duration' && obj.id !== 'archivo' && obj.id !== 'fecha1' && obj.id !== 'estado53' && obj.id !== 'bot_n9')

            const dataProd = [{
                departamento: productos.find(item => item.id === 'estado')?.text || '',
                hotel: productos.find(item => item.id === 'estado2')?.text || '',
                proveedor: productos.find(item => item.id === 'men__desplegable')?.text || '',
                producto: productos.find(item => item.id === 'men__desplegable_1')?.text || '',
                unidad_medida: productos.find(item => item.id === 'men__desplegable6')?.text || '',
                cantidad: productos.find(item => item.id === 'n_meros')?.text || '',
                comentario: productos.find(item => item.id === 'texto_largo')?.text || ''
            }]

            console.log(dataProd)
            const { items } = req.body;

            itemsOrder.push(...dataProd);
            // Guardar los ítems actualizados en localStorage
            localStorage.setItem('itemsOrder', JSON.stringify(itemsOrder));

            // console.log(itemsOrder)
            await generarExcle(itemsOrder, hotel, proveedor)

            // vaciar()
        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', response.status);
            const errorMessage = await response.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }

    res.status(200).end();
}

const vaciar = () => {
    let itemsOrder = []
    localStorage.setItem('itemsOrder', JSON.stringify(itemsOrder));
}

const generarExcle = async (items, hotel, proveedor) => {

    const workbook = await XlsxPopulate.fromBlankAsync();

    // crear un valor en una celda
    // workbook.sheet(0).cell('A1').value('Nombre');
    // workbook.toFileAsync('./salida.xlsx')

    // // leer una celda
    // const value = workbook.sheet('Sheet1').cell('A2').value();

    // // leer toda la hoja
    // const value2 = workbook.sheet('Sheet1').usedRange().value()

    // // leer un rango
    // const value3 = workbook.sheet('Sheet1').range('A1:B2').value()

    const sheet = workbook.sheet(0);

    let num = 0
    const day = new Date()
    console.log(day.toLocaleDateString())
    // crear valores como arreglos

    sheet.cell('A1').value('ORDEN DE COMPRA').style({ horizontalAlignment: 'center', bold: true });
    sheet.range('A1:D1').merged(true)
    sheet.cell('A2').value([['No', num++, 'FECHA', day.toLocaleDateString()]])
    sheet.range('A3:D3').merged(true)
    sheet.cell('A4').value([['EMPRESA', 'ECONO HOTEL GROUP SAS', 'PROVEEDOR', `${proveedor}`]])
    sheet.cell('A5').value([['NIT', '901116843', 'CONTACTO', 'test']])
    sheet.cell('A6').value([['HOTEL', `${hotel}`]])
    sheet.range('B6:D6').merged(true)
    sheet.cell('A7').value([['DIRECCION', 'BARRIO MARBELLA CARRERA 2 No 47 10']])
    sheet.range('B7:D7').merged(true)
    sheet.cell('A8').value('Solicitamos su colaboracion con el despacho de los siguientes articulos ').style({ horizontalAlignment: 'center' });
    sheet.range('A8:D9').merged(true)
    sheet.cell('A10').value([['Item', 'Producto', 'Cantidad', 'Medida']]);

    items.map((item, index) => {
        const rowIndex = index + 11;
        sheet.row(rowIndex).cell('A').value(num++)
        sheet.row(rowIndex).cell('B').value(item.producto)
        sheet.row(rowIndex).cell('C').value(item.cantidad)
        sheet.row(rowIndex).cell('D').value(item.unidad_medida)
    })

    // Estilo de bordes
    const borderStyle = { style: "thin", color: "000000" }; // Borde delgado negro
    const range = sheet.range(`A1:D${10 + items.length}`);
    range.style({ border: true });
    range.forEach(cell => {
        cell.style({ bottomBorder: borderStyle, rightBorder: borderStyle });
    });
    const infoRowIndex = 11 + items.length + 1;
    sheet.row(infoRowIndex).cell('A').value('REALIZADO POR')
    sheet.row(infoRowIndex).cell('B').value('Geraldines Agudelo Alvarez')

    sheet.row(infoRowIndex + 1).cell('A').value('OBSERVACIONES')
    sheet.row(infoRowIndex + 1).cell('B').value('NA')

    const rangeData = sheet.range(`A${infoRowIndex}:D${infoRowIndex}`);
    const rangeBelow = sheet.range(`A${infoRowIndex + 1}:D${infoRowIndex + 1}`); // Puedes ajustar cuántas filas debajo quieres aplicar el estilo
    rangeData.style({ border: true });
    rangeData.forEach(cell => {
        cell.style({ bottomBorder: borderStyle, rightBorder: borderStyle });
    });
    rangeBelow.forEach(cell => {
        cell.style({ rightBorder: borderStyle });
    });

    // workbook.sheet(0).cell('A2').value('Titulo').style({horizontalAlignment: 'center'});
    // workbook.sheet(0).range('A2:B2').merged(true);


    workbook.toFileAsync('./salida.xlsx')
}

const enviarExcel = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const id = req.body.event.pulseId;

    await mandarQR(id)
    await vaciar()
}

module.exports = {
    felizCumple,
    generarQR,
    requisicones,
    enviarExcel
}