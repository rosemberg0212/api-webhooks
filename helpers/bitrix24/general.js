const { bitrix24Api } = require("../../apis");

const getInfoFilterBitrix = async ({ start, url, select }) => {
  const { data } = await bitrix24Api
    .post(url, {
      order: { ID: "ASC" },
      select,
      start,
    })
    .catch(() => {
      throw new Error("Bitrix error get info");
    });
  return data;
};

module.exports = {
  getInfoFilterBitrix,
};
