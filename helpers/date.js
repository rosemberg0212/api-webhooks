const dateComparation = (date1 = "", date2 = "") => {
  const dateObject1 = new Date(date1);
  const dateObject2 = new Date(date2);

  if (dateObject1 < dateObject2) {
    return true;
  }
  return false;
};

module.exports = {
  dateComparation,
};
