const { bitrix24Api } = require("../../apis");
const { splitName } = require("../utilidades");

const getGenero = (genero) => {
  switch (genero.toLowerCase().trim()) {
    case "masculino":
      return 684;

    case "femenino":
      return 686;

    default:
      return 688;
  }
};

const getEducationLevel = (education) => {
  switch (education.toLowerCase().trim()) {
    case "tecnologo":
      return 696;

    case "tecnico":
      return 694;

    case "bachiller":
      return 692;

    case "profesional":
      return 698;

    case "especialista":
      return 700;

    case "magister":
      return 702;

    case "doctorado":
      return 704;
  }
};

const getGrupoSanguineo = (grupo) => {
  switch (grupo.toLowerCase().trim()) {
    case "a positivo":
      return "748";
    case "a negativo":
      return "750";
    case "b positivo":
      return "752";
    case "b negativo":
      return "754";
    case "ab positivo":
      return "756";
    case "ab negativo":
      return "758";
    case "o positivo":
      return "760";
    case "o negativo":
      return "762";
    default:
      return null;
  }
};

const getComunidades = (comunidad) => {
  switch (comunidad.toLowerCase().trim()) {
    case "afrocolombiano":
      return 766;

    case "afrodescendiente":
      return 2044;

    case "mestizo":
      return 3024;

    case "indigena":
      return 3024;

    case "indigena":
      return 2050;

    case "indigena":
      return 2050;

    default:
      return 772;
  }
};

const getCargo = (cargo) => {
  switch (cargo) {
    case "administrador":
      return 2886;

    case "ama de llaves":
      return 2880;

    case "albañil":
      return 2930;

    case "almacenista y porteria":
      return 2926;

    case "analista contable":
      return 2950;

    case "areas comunes":
      return 2916;

    case "asesor de eventos":
    case "asistente de eventos":
      return 2984;

    case "asistente de gerencia":
      return 2956;

    case "asistente administrativa":
      return 2966;

    case "asistente contable":
      return 2952;

    case "auditor":
      return 2866;

    case "auxiliar administrativo":
      return 2982;

    case "auxiliar contable":
      return 2900;

    case "auxiliar de cocina":
      return 2860;

    case "auxiliar de habitacion":
      return 2964;

    case "auxiliar de sistema":
      return 2912;

    case "bartender":
      return 2942;

    case "botones":
      return 2858;

    case "call center":
      return 2864;

    case "camarera":
      return 2882;

    case "carpintero":
      return 2922;

    case "chef":
      return 2940;

    case "compras":
      return 2938;

    case "conductor":
      return 2904;

    case "contabilidad":
      return 2944;

    case "coordinador de calidad":
      return 2870;

    case "coordinador de call center":
      return 2980;

    case "coordinador de eventos":
      return 2986;

    case "coordinador de recursos humanos":
      return 2868;

    case "coordinador de reservas":
      return 2874;

    case "coordinador sst":
    case "sst":
      return 2872;

    case "electricista":
    case "técnico electricista":
      return 2908;

    case "jefe de mantenimineto":
      return 2878;

    case "jefe de operaciones":
      return 2876;

    case "jefe de recepcion":
    case "recepcionista":
      return 2854;

    case "jefe de seguridad":
      return 2962;

    case "lavanderia":
      return 2968;

    case "mantenimiento":
      return 2896;

    case "mesero":
      return 2884;

    case "oficios varios":
      return 2906;

    case "operación":
      return 2960;

    case "panaderia":
      return 2936;

    case "pintor":
      return 2928;

    case "plomero":
      return 2924;

    case "practicante":
      return 2898;

    case "practicante de botones":
      return 2978;

    case "practicante de camarería":
    case "practicante de mesera":
      return 2970;

    case "practicante de cocina":
      return 2976;

    case "practicante de contabilidad":
      return 3030;

    case "practicante de panadería":
      return 2972;

    case "practicante de recepción":
      return 2974;

    case "practicante de reservas":
    case "reservas":
      return 2862;

    case "programador de software":
      return 2894;

    case "revenue":
    case "revenue management":
      return 2958;

    case "sistemas":
    case "tecnólogo en sistemas":
      return 2910;

    case "steward":
      return 2918;

    case "supervisor de habitaciones":
      return 2946;

    case "tecnico en refrigeracion":
      return 2920;

    case "vigilante":
      return 2902;
    default:
      return 2988;
  }
};

const formatePropectos = (info, contactId) => {
  const TITLE = info.name;
  const genero =
    info.column_values.find((i) => i.id === "estado_1")?.text || null;

  const nivelEdu =
    info.column_values.find((i) => i.id === "estado_3")?.text || null;
  const numeriID =
    info.column_values.find((i) => i.id === "texto")?.text || null;
  const grupoSanguineo =
    info.column_values.find((i) => i.id === "estado_2")?.text || null;
  const personalDesc =
    info.column_values.find((i) => i.id === "texto_largo")?.text || null;
  const comunidad =
    info.column_values.find((i) => i.id === "color__1")?.text || null;

  const fechaNacimiento =
    info.column_values.find((i) => i.id === "fecha_1")?.text || null;

  const lugarExpedicionCC =
    info.column_values.find((i) => i.id === "texto2")?.text || null;

  const cargos =
    info.column_values.find(({ id }) => id === "selecci_n_m_ltiple6")?.text ||
    null;

  const prospecto = {
    fields: {
      TITLE,
      CONTACT_ID: contactId,
      UF_CRM_1714426925: !genero ? null : getGenero(genero), //? Genero
      UF_CRM_1714427061: !nivelEdu ? null : getEducationLevel(nivelEdu), //? Nivel educativo
      UF_CRM_1714481829: numeriID,
      UF_CRM_1714482439: !grupoSanguineo
        ? null
        : getGrupoSanguineo(grupoSanguineo), //? Grupo sanguineo,
      UF_CRM_1714482647: personalDesc,
      UF_CRM_1714482978: !comunidad ? null : getComunidades(comunidad), //? Comunidades,
      UF_CRM_1714754406: !fechaNacimiento
        ? null
        : fechaNacimiento.concat("T03:00:00+03:00"),
      UF_CRM_1714754449: lugarExpedicionCC,
      UF_CRM_664B8F1F112CC: !cargos
        ? [2988]
        : cargos.split(", ").map((cargo) => {
            return getCargo(cargo.trim().toLowerCase());
          }), //? Cargo,
    },
  };

  return prospecto;
};

const createProspectoBitrix = async (info, contactId) => {
  const prospectoFormateado = formatePropectos(info, contactId);

  await bitrix24Api.post("/crm.lead.add", {
    fields: prospectoFormateado.fields,
  });

  return;
};

module.exports = {
  formatePropectos,
  createProspectoBitrix,
};
