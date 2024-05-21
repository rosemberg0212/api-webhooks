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

module.exports = {
  splitName,
};
