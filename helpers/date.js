const dateComparation = (actualDate = "", checkoutDate= "") => {
  const unixActualDate = new Date(actualDate);
  const unixChechoutDate = new Date(checkoutDate);

  if (unixActualDate < unixChechoutDate) {
    return true;
  }
  return false;
};

const getActualDate = () => {
  let fechaActual = new Date();
  let año = fechaActual.getFullYear();
  let mes = fechaActual.getMonth() + 1; // getMonth() devuelve un valor entre 0 (enero) y 11 (diciembre)
  let dia = fechaActual.getDate();

  // Agregar un cero delante de los meses y días si son menores a 10
  mes = mes < 10 ? '0' + mes : mes;
  dia = dia < 10 ? '0' + dia : dia;

  let fechaFormateada = año + '-' + mes + '-' + dia;
  return fechaFormateada;
}

module.exports = {
  dateComparation,
  getActualDate
};
