const { bitrix24Api } = require("../../apis");
const { splitName, formatearTelefonoSPQRS } = require("../utilidades");
const { getInfoFilterBitrix } = require("./general");

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

const obtenerContacto = async ({ select, phone, email }) => {
  let start = 0;
  let encontrado = false;
  const formatPhone = formatearTelefonoSPQRS(phone);
  while (start !== undefined && !encontrado) {
    const data = await getInfoFilterBitrix({
      start,
      select,
      url:"/crm.contact.list.json",
    });
    for (const contact of data.result) {
      const tels = contact.PHONE ? contact.PHONE.map((i) => i.VALUE) : [];
      const emails = contact.EMAIL ? contact.EMAIL.map((i) => i.VALUE) : [];

      if (
        formatPhone === tels[0] ||
        formatPhone === tels[1] ||
        emails[0] === email
      ) {
        encontrado === true;
        return contact.ID;
      }
    }
    start = data.next;
  }

  return null;
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
  obtenerContacto,
};
