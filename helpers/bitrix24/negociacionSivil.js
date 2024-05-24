const { bitrix24Api } = require("../../apis");
const { splitName } = require("../utilidades");

const getGenero = (genero) => {
  switch (genero.toLowerCase().trim()) {
    case "masculino":
      return 846;

    case "femenino":
      return 848;

    default:
      return 850;
  }
};

const getEducationLevel = (education) => {
  switch (education.toLowerCase().trim()) {
    case "tecnologo":
      return 878;

    case "tecnico":
      return 876;

    case "bachiller":
      return 874;

    case "profesional":
      return 880;

    case "especialista":
      return 882;

    case "magister":
      return 884;

    case "doctorado":
      return 886;
  }
};

const getGrupoSanguineo = (grupo) => {
  switch (grupo.toLowerCase().trim()) {
    case "a positivo":
      return "206";
    case "a negativo":
      return "208";
    case "b positivo":
      return "204";
    case "b negativo":
      return "202";
    case "ab positivo":
      return "212";
    case "ab negativo":
      return "210";
    case "o positivo":
      return "200";
    case "o negativo":
      return "198";
    default:
      return null;
  }
};

const getComunidades = (comunidad) => {
  switch (comunidad.toLowerCase().trim()) {
    case "afrocolombiano":
      return 864;

    case "afrodescendiente":
      return 2064;

    case "mestizo":
      return 3026;

    case "indigena":
      return 862;

    case "negritudes":
      return 2062;

    case "desplazado":
      return 2070;

    default:
      return 870;
  }
};

const getCargo = (cargo) => {
  switch (cargo) {
    case "administrador":
      return 1872;

    case "ama de llaves":
      return 1866;

    case "albañil":
      return 1916;

    case "almacenista y porteria":
      return 1912;

    case "analista contable":
      return 1886;

    case "areas comunes":
      return 1902;

    case "asesor de eventos":
    case "asistente de eventos":
      return 1900;

    case "asistente de gerencia":
      return 1942;

    case "asistente administrativa":
      return 1952;

    case "asistente contable":
      return 1886;

    case "auditor":
      return 1852;

    case "auxiliar administrativo":
      return 2230;

    case "auxiliar contable":
      return 1886;

    case "auxiliar de cocina":
      return 1846;

    case "auxiliar de habitacion":
      return 1950;

    case "auxiliar de sistema":
      return 1898;

    case "bartender":
      return 1928;

    case "botones":
      return 1844;

    case "call center":
    case "reservas":
      return 1848;

    case "camarera":
      return 1868;

    case "carpintero":
      return 1908;

    case "chef":
      return 1926;

    case "compras":
      return 1878;

    case "conductor":
      return 1890;

    case "contabilidad":
      return 1886;

    case "coordinador de calidad":
      return 1876;

    case "coordinador de call center":
      return 2228;

    case "coordinador de eventos":
      return 2234;

    case "coordinador de recursos humanos":
      return 1854;

    case "coordinador de reservas":
      return 1850;

    case "coordinador sst":
    case "sst":
      return 1858;

    case "electricista":
    case "técnico electricista":
      return 1894;

    case "jefe de mantenimineto":
      return 1864;

    case "jefe de operaciones":
      return 1862;

    case "jefe de recepcion":
    case "recepcionista":
      return 1840;

    case "jefe de seguridad":
      return 1848;

    case "lavanderia":
      return 1954;

    case "mantenimiento":
      return 1882;

    case "mesero":
      return 1870;

    case "oficios varios":
      return 1892;

    case "operación":
      return 1946;

    case "panaderia":
      return 1922;

    case "pintor":
      return 1914;

    case "plomero":
      return 1910;

    case "practicante":
      return 1884;

    case "practicante de botones":
      return 2034;

    case "practicante de camarería":
    case "practicante de mesera":
      return 2026;

    case "practicante de cocina":
      return 2032;

    case "practicante de contabilidad":
      return 3028;

    case "practicante de panadería":
      return 2028;

    case "practicante de recepción":
      return 2030;

    case "practicante de reservas":
      return 4118;

    case "programador de software":
      return 1880;

    case "revenue":
    case "revenue management":
      return 1944;

    case "sistemas":
    case "tecnólogo en sistemas":
      return 1896;

    case "steward":
      return 1904;

    case "supervisor de habitaciones":
      return 1932;

    case "tecnico en refrigeracion":
      return 1906;

    case "vigilante":
      return 1888;
    default:
      return 2036;
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

  const negociacion = {
    fields: {
      TITLE,
      STAGE_ID: "C16:NEW",
      CATEGORY_ID: "16",
      CONTACT_ID: contactId,
      UF_CRM_663116D710A85: !genero ? null : getGenero(genero), //? Genero
      UF_CRM_1714427061: !nivelEdu ? null : getEducationLevel(nivelEdu), //? Nivel educativo
      UF_CRM_663119664CA2D: numeriID,
      UF_CRM_663119664CA2D: !grupoSanguineo
        ? null
        : getGrupoSanguineo(grupoSanguineo), //? Grupo sanguineo,
      UF_CRM_66508E0883967: personalDesc, //? Descripcion personal
      UF_CRM_663116D74F802: !comunidad ? null : getComunidades(comunidad), //? Comunidades,
      UF_CRM_6635150DE95EB: !fechaNacimiento
        ? null
        : fechaNacimiento.concat("T03:00:00+03:00"),
      UF_CRM_6635150E0294C: lugarExpedicionCC,
      UF_CRM_1715689729: !cargos
        ? [2988]
        : cargos.split(", ").map((cargo) => {
            return getCargo(cargo.trim().toLowerCase());
          }), //? Cargo,
    },
  };

  return negociacion;
};

const createnegociacionBitrix = async (info, contactId) => {
  const negociacionFormateado = formatePropectos(info, contactId);

  await bitrix24Api.post("/crm.deal.add", {
    fields: negociacionFormateado.fields,
  });

  return;
};

module.exports = {
  formatePropectos,
  createnegociacionBitrix,
};
