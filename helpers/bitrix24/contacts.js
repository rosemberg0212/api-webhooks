const { bitrix24Api } = require("../../apis");
const { splitName } = require("../utilidades");

const formateContact = (info) => {
  const contactInfo = splitName(info.name);
  const ADDRESS =
    info.column_values.find((i) => i.id === "ubicaci_n8")?.text || null;
  const tel1 = info.column_values.find((i) => i.id === "tel_fono")?.text
    ? "+" + info.column_values.find((i) => i.id === "tel_fono")?.text
    : null;

  const tel2 = info.column_values.find((i) => i.id === "tel_fono_1")?.text
    ? "+" + info.column_values.find((i) => i.id === "tel_fono_1")?.text
    : null;

  const email =
    info.column_values.find((i) => i.id === "correo_electr_nico")?.text || null;

  const contact = {
    fields: {
      NAME: contactInfo.NAME,
      SECOND_NAME: contactInfo.SECOND_NAME,
      LAST_NAME: contactInfo.LAST_NAME,
      ADDRESS,
      PHONE: [
        {
          VALUE_TYPE: "WORK",
          VALUE: tel1,
          TYPE_ID: "PHONE",
        },
        {
          VALUE_TYPE: "WORK",
          VALUE: tel2,
          TYPE_ID: "PHONE",
        },
      ],
      EMAIL: [
        {
          VALUE_TYPE: "OTHER",
          VALUE: email,
          TYPE_ID: "EMAIL",
        },
      ],
    },
  };

  return contact;
};

const createContactBitrix = async (info) => {
  const contactoFormateado = formateContact(info);

  const { data } = await bitrix24Api.post("/crm.contact.add", {
    fields: contactoFormateado.fields,
  });

  return {
    id: data.result,
  };
};

module.exports = {
  formateContact,
  createContactBitrix,
};
