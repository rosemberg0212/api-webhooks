const splitName = (str = "") => {
  const completeName = str.split(" ");
  if (completeName.length === 4) {
    return {
      NAME: completeName[0],
      SECOND_NAME: completeName[1],
      LAST_NAME: `${completeName[2]} ${completeName[3]}`,
    };
  } else if (completeName.length === 3) {
    return {
      NAME: completeName[0],
      SECOND_NAME: null,
      LAST_NAME: `${completeName[1]} ${completeName[2]}`,
    };
  } else if (completeName.length === 2) {
    return {
      NAME: completeName[0],
      SECOND_NAME: null,
      LAST_NAME: completeName[1],
    };
  }
  return {
    NAME: str,
    SECOND_NAME: null,
    LAST_NAME: null,
  };
};

const formatearTelefonoSPQRS = (phone = "") => {
  if (phone.length === 10) {
    return "+57" + phone;
  }
  if (phone.length === 12) {
    return "+" + phone;
  }
  if (phone.length < 10 || phone.length > 13) {
    return null;
  }
  return phone;
};
module.exports = {
  splitName,
  formatearTelefonoSPQRS,
};
