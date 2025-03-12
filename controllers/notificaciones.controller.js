const { getListDeal, enviarMailInnovacion, fetchTimemanStatus, enviarMensajeBitrix, userContac } = require('../helpers/index')
const cron = require('node-cron');
const { format, diffDays } = require("@formkit/tempo")

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
        const [refYear, refMonth, refDay] = dateNow.split('-');

        // Comparar solo mes y día
        return month === refMonth && day === refDay;
    })
    console.log(happyB)

    const buildEmailMessage = (filteredData) => {
        if (filteredData.length === 0) {
            return "No hay cumpleaños el día de hoy.";
        }

        let message = "Buenos días equipo de Gestion Humana, hoy estan cumpliendo los siguientes colaboradores:\n\n";

        filteredData.forEach((deal, index) => {
            message += `${index + 1}. Nombre: ${deal.TITLE}\n`;
        });

        return message;
    };

    // Construir el cuerpo del correo
    const emailMessage = buildEmailMessage(happyB);
    // console.log(emailMessage)
    await enviarMailInnovacion(emailMessage, 'gestionhumana@gehsuites.com', 'Cumpleaños')


    // res.status(200).end();
}

const notificacionContratosVencidos = async (req, res) => {
    const list = await getListDeal()
    // console.log(list)

    const hoy = new Date();
    let listaEmpleados = [];

    list.forEach(empleado => {
        const fechaVencimiento = new Date(empleado.UF_CRM_1714769594);
        const diferenciaDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));

        if (diferenciaDias === 15 || diferenciaDias === 7 || diferenciaDias === 1 || diferenciaDias === 0) {
            listaEmpleados.push({
                TITLE: empleado.TITLE,
                fecha: fechaVencimiento.toISOString().split('T')[0]
            });
        }
    });

    if (listaEmpleados.length === 0) {
        console.log('No hay empleados proximos a vencer')
        return;
    } // No hay empleados para notificar

    const mensaje = listaEmpleados.map(emp =>
        `- ${emp.TITLE} (Vence el ${emp.fecha})`
    ).join('\n');

    await enviarMailInnovacion(`Los siguientes contratos están próximos a vencer:\n\n${mensaje}`, 'gestionhumana@gehsuites.com', `⚠️ Alerta: Contratos próximos a vencer`)
}

// Programar la ejecución diaria a las 8:00 AM
cron.schedule('00 8 * * *', () => {
    console.log('Ejecutando tarea programada a las 7:00 AM');
    happyBirthday();
}, {
    timezone: "America/Bogota" // Ajustar según la zona horaria
});
cron.schedule('00 8 * * *', () => {
    console.log('Ejecutando tarea programada a las 7:00 AM');
    notificacionContratosVencidos();
}, {
    timezone: "America/Bogota" // Ajustar según la zona horaria
});

const userStatus = async (req, res) => {
    const userIds = [14, 30, 8882, 8874, 6050, 4776, 66, 42, 28];
    const adminId = 38

    // Función para obtener el nombre de usuario basado en el ID
    const obtenerNombreUsuario = (userId) => {
        const usuario = userContac.find(user => user.id === userId);
        return usuario ? usuario.name : `Usuario ID: ${userId}`;
    };

    const usuarios = await fetchTimemanStatus(userIds);

    // Filtra los usuarios en estado "PAUSED"
    const usuariosEnPausa = usuarios.filter(user => user.status === "PAUSED");

    if (usuariosEnPausa.length > 0) {
        // Construye el mensaje con los nombres de los usuarios en pausa
        const mensaje = usuariosEnPausa.map(user => {
            const nombre = obtenerNombreUsuario(user.userId);
            return `${nombre}, En pausa desde: ${format(user.timeStart, { time: "short" })}`;
        }).join("\n");

        // Envía el mensaje al usuario admin especificado
        await enviarMensajeBitrix(adminId, `Usuarios en pausa:\n${mensaje}`);
    } else {
        // console.log("No hay usuarios en estado de pausa.");
    }
    // res.status(200).end();
}

cron.schedule('*/5 * * * *', userStatus);

module.exports = {
    happyBirthday,
    userStatus,
    notificacionContratosVencidos
}