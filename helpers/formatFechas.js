const { format, diffDays } = require("@formkit/tempo")

const separarDias = (checkin, checkout) => {
    const nombreMes = format(checkin, "MMMM", "es")
    const diaCkin = format(checkin, "D", "es")
    const diaCkout = format(checkout, "D", "es")
    return { nombreMes, diaCkin, diaCkout }
}

const calcularNoches = (checkin, checkout) => {
    const noches = diffDays(checkout, checkin)

    return {noches}
}

module.exports = {
    separarDias,
    calcularNoches
}