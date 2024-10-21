const { getListDeal, enviarImail } = require('../helpers/index')
const cron = require('node-cron');

const happyBirthday = async (req, res) => {

    const list = await getListDeal()
    // console.log(list)
    const dateNow = ((new Date()).toISOString()).replace(/T.*/, '')
    // console.log(dateNow)
    const data = list;

    const happyB = data.filter(dato => {
        // Extraer mes y día de la fecha del dato
        const date = (dato.UF_CRM_6635150DE95EB).replace(/T.*/, '');
        const [year, month, day] = date.split('-');

        // Extraer mes y día de la fecha de referencia
        const [refYear, refMonth, refDay] = '1997-10-22'.split('-');

        // Comparar solo mes y día
        return month === refMonth && day === refDay;
    })
    console.log(happyB)

    const buildEmailMessage = (filteredData) => {
        if (filteredData.length === 0) {
            return "No hay cumpleaños el día de hoy.";
        }

        let message = "Buenos días equipo de Gestion Humana, Mañana estan cumpliendo los siguientes colaboradores:\n\n";

        filteredData.forEach((deal, index) => {
            message += `${index + 1}. Nombre: ${deal.TITLE}\n`;
        });

        return message;
    };

    // Construir el cuerpo del correo
    const emailMessage = buildEmailMessage(happyB);
    console.log(emailMessage)
    await enviarImail(emailMessage, 'gestionhumana@gehsuites.com', 'Cumpleaños')
    

    // res.status(200).end();
}

// Programar la ejecución diaria a las 8:00 AM
cron.schedule('00 7 * * *', () => {
    console.log('Ejecutando tarea programada a las 7:00 AM');
    happyBirthday();
}, {
    timezone: "America/Bogota" // Ajustar según la zona horaria
});

module.exports = {
    happyBirthday
}