const { bitrix24Api } = require("../../apis");

const getHoteles = (hotel) => {
  switch (hotel) {
    case "H. Madisson":
      return "3050";
    case "H. Windsor House":
      return "3052";
    case "H. Avexi":
      return "3054";
    case "H. Marina":
      return "3056";
    case "H. Bocagrande":
      return "3058";
    case "H. Aixo":
      return "3060";
    case "H. Azuan":
      return "3062";
    case "H. Boquilla":
      return "3064";
    case "H. 1525":
      return "3066";
    case "H. Abi Inn":
      return "3068";
    case "H. Rodadero Inn":
      return "3070";
    case "Kokonito":
      return "3072";
    default:
      return null;
  }
};

const getPrioridad = (prioridad) => {
  switch (prioridad) {
    case "Baja":
      return "3044";
    case "Mediano":
      return "3046";
    case "Alta":
      return "3048";
    default:
      return null;
  }
};

const getTipo = (tipo) => {
  switch (tipo) {
    case "Solicitud":
      return "3036";
    case "Peticion":
      return "3038";
    case "Queja":
      return "3040";
    case "Reclamo":
      return "3042";
    default:
      return null;
  }
};

const getCategoria = (categoria) => {
  switch (categoria) {
    case "Certificado de cesantias":
      return "3074";
    case "Cajas de compensación":
      return "3076";
    case "Permisos":
      return "3078";
    case "Certificados laborales":
      return "3080";
    case "Desprendibles de pago":
      return "3082";
    case "Afiliaciones/Cambios de EPS":
      return "3084";
    case "Reportar incapacidad":
      return "3086";
    case "Cambio de datos":
      return "3088";
    case "Otra":
      return "3090";
    default:
      return null;
  }
};

const formatSpqr = ({ spqr, contactID }) => {
  const prioridad =
    spqr.column_values.find((i) => i.id === "status5")?.text || null;

  const tipo = spqr.column_values.find((i) => i.id === "status")?.text || null;

  const hotel =
    spqr.column_values.find((i) => i.id === "estado_1")?.text || null;

  const categoria =
    spqr.column_values.find((i) => i.id === "selecci_n__nica")?.text || null;

  const descripcion =
    spqr.column_values.find((i) => i.id === "nota")?.text || null;

  const phone = spqr.column_values.find((i) => i.id === "phone")?.text || null;

  const email =
    spqr.column_values.find((i) => i.id === "correo_electr_nico")?.text || null;

  const spqrFormated = {
    fields: {
      TITLE: `${categoria} - ${tipo} - ${spqr.name}`,
      STAGE_ID: "C8:NEW",
      CONTACT_ID: contactID,
      CATEGORY_ID: "8",
      UF_CRM_1716318939421: getPrioridad(prioridad),
      UF_CRM_1716318685037: getTipo(tipo),
      UF_CRM_1716319151460: getHoteles(hotel),
      UF_CRM_1716319520138: getCategoria(categoria),
      UF_CRM_1716319615280: descripcion,
      UF_CRM_1716324277712: !contactID ? phone : null,
      UF_CRM_1716324291346: !contactID ? email : null,
    },
  };
  console.log(JSON.stringify(spqrFormated));

  return spqrFormated;
};

const createSpqrBitrix = async (spqr, contactID) => {
  const spqrFormateada = formatSpqr({ spqr, contactID });

  await bitrix24Api
    .post("/crm.deal.add", {
      fields: spqrFormateada.fields,
    })
    .catch(() => {
      throw new Error("Problema al guardar");
    });

  return "ok";
};

module.exports = {
  createSpqrBitrix,
};
