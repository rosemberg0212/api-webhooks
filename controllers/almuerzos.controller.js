const { google } = require("googleapis");

// Cache simple para optimizar consultas
const cache = {};

// Configuración
const LIMITE_MENSUAL = parseInt(process.env.LIMITE_MENSUAL || "10", 10);
const CACHE_TTL_MS = (parseInt(process.env.CACHE_TTL || "60", 10)) * 1000;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const SPANISH_MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Configuración de autenticación con Google Sheets
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

async function getSheetsClient() {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

// Utilidades
function monthTitleFromYYYYMM(yyyymm) {
  const [y, m] = yyyymm.split("-");
  const mm = parseInt(m, 10);
  if (!y || !mm) return null;
  return `${SPANISH_MONTHS[mm - 1]} ${y}`;
}

function currentMonthTitle() {
  const d = new Date();
  return `${SPANISH_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function normalizeCedula(s) {
  return ("" + (s || "")).replace(/\D/g, ""); // deja solo dígitos
}

function findHeaderIndex(headers, candidates) {
  const h = headers.map(x => (x || "").toString().trim().toLowerCase());
  for (const cand of candidates) {
    const ci = h.findIndex(x => x === cand.toLowerCase());
    if (ci !== -1) return ci;
  }
  // fallback: buscar por inclusión de palabra clave
  for (const key of candidates) {
    const ci = h.findIndex(x => x.includes(key.toLowerCase()));
    if (ci !== -1) return ci;
  }
  return -1;
}

async function resolveSheetTitle(desiredTitle) {
  const sheets = await getSheetsClient();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const titles = meta.data.sheets.map(s => s.properties.title);
  
  // 1) exact match
  if (titles.includes(desiredTitle)) return desiredTitle;
  
  // 2) case-insensitive
  const caseMatch = titles.find(t => t.toLowerCase() === desiredTitle.toLowerCase());
  if (caseMatch) return caseMatch;
  
  // 3) intentar encontrar por inclusión
  const partial = titles.find(t => t.toLowerCase().includes(desiredTitle.toLowerCase()));
  if (partial) return partial;
  
  return null;
}

async function getRowsByTitle(title) {
  const key = `rows:${title}`;
  if (cache[key] && (Date.now() - cache[key].ts < CACHE_TTL_MS)) {
    return cache[key].rows;
  }
  
  const sheets = await getSheetsClient();
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${title}`,
  });
  
  const rows = resp.data.values || [];
  cache[key] = { rows, ts: Date.now() };
  return rows;
}

// Controladores
const consultarAlmuerzos = async (req, res) => {
  try {
    // Validar que SPREADSHEET_ID esté configurado
    if (!SPREADSHEET_ID) {
      return res.status(500).json({ 
        mensaje: "SPREADSHEET_ID no configurado en variables de entorno" 
      });
    }

    const cedRaw = req.params.cedula;
    const ced = normalizeCedula(cedRaw);
    const monthParam = req.query.month; // opcional YYYY-MM
    
    if (!ced) {
      return res.status(400).json({ mensaje: "Cédula requerida" });
    }

    const desired = monthParam ? monthTitleFromYYYYMM(monthParam) : currentMonthTitle();
    
    if (!desired) {
      return res.status(400).json({ mensaje: "Parámetro month inválido" });
    }

    const sheetTitle = await resolveSheetTitle(desired);
    if (!sheetTitle) {
      return res.status(404).json({ 
        mensaje: `No existe pestaña para "${desired}"` 
      });
    }

    const rows = await getRowsByTitle(sheetTitle);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ mensaje: "Hoja vacía" });
    }

    const header = rows[0].map(c => (c || "").toString().trim());
    
    // Buscar índices de las columnas importantes
    const idxCed = findHeaderIndex(header, [
      "documento identidad", "documento", "cedula", "codigo", "identificacion", "id"
    ]);
    const idxConteo = findHeaderIndex(header, [
      "conteo", "usados", "contador", "cantidad", "tickets usados"
    ]);
    const idxNombre = findHeaderIndex(header, [
      "nombre completo", "nombres", "nombre"
    ]);

    if (idxCed === -1) {
      return res.status(500).json({ 
        mensaje: "No se encontró columna de documento en la hoja",
        encabezados: header
      });
    }

    // Buscar fila del empleado
    let found = null;
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const cellCed = normalizeCedula(r[idxCed] || "");
      if (cellCed === ced) {
        found = { row: r, rowIndex: i + 1 };
        break;
      }
    }

    if (!found) {
      return res.status(404).json({ 
        mensaje: "Colaborador no encontrado en la hoja del mes", 
        mes: sheetTitle 
      });
    }

    const conteoRaw = (found.row[idxConteo] || "").toString().replace(/\D/g, "");
    const conteo = conteoRaw ? parseInt(conteoRaw, 10) : 0;
    const nombre = found.row[idxNombre] || "";
    const restantes = Math.max(LIMITE_MENSUAL - conteo, 0);

    res.json({
      success: true,
      cedula: ced,
      nombre,
      usados: conteo,
      restantes,
      limite: LIMITE_MENSUAL,
      mes: sheetTitle
    });

  } catch (err) {
    console.error("Error en consultarAlmuerzos:", err);
    res.status(500).json({ 
      mensaje: "Error interno en el servidor",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Función para validar si un título corresponde a un mes
function isValidMonthTitle(title) {
  // Buscar patrones como "Enero 2024", "Febrero 2025", etc.
  const monthPattern = new RegExp(`^(${SPANISH_MONTHS.join('|')})\\s+\\d{4}$`, 'i');
  return monthPattern.test(title.trim());
}

// Endpoint para listar meses disponibles
const listarMesesDisponibles = async (req, res) => {
  try {
    if (!SPREADSHEET_ID) {
      return res.status(500).json({ 
        mensaje: "SPREADSHEET_ID no configurado en variables de entorno" 
      });
    }

    const sheets = await getSheetsClient();
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const allTitles = meta.data.sheets.map(s => s.properties.title);
    
    // Filtrar solo títulos que corresponden a meses
    const monthTitles = allTitles.filter(title => isValidMonthTitle(title));

    res.json({
      success: true,
      meses: monthTitles,
      mesActual: currentMonthTitle(),
      totalHojas: allTitles.length,
      hojasMes: monthTitles.length
    });

  } catch (err) {
    console.error("Error en listarMesesDisponibles:", err);
    res.status(500).json({ 
      mensaje: "Error interno en el servidor",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  consultarAlmuerzos,
  listarMesesDisponibles
};