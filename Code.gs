
/** Code.gs — Google Apps Script: Export Google Sheet to data.json */
const CFG = {
  // 試算表ID（留空=目前此檔）
  SPREADSHEET_ID: '',
  // 鍵值表所在分頁
  RADAR_SHEET: 'Radar',
  // 允許跨域（Apps Script ContentService 無法顯式設頭，前端仍可讀取）
  CORS_ORIGINS: ['*'],
};

function doGet(e) {
  const ss = CFG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(CFG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CFG.RADAR_SHEET);
  if (!sheet) return _json({ error: 'Missing sheet: ' + CFG.RADAR_SHEET });

  const values = sheet.getRange(1,1, sheet.getLastRow(), 2).getValues();
  const flat = {};
  for (const [k,v] of values) {
    if (!k) continue;
    flat[String(k).trim()] = v;
  }
  const out = {
  const out = {
    updatedAt: new Date().toISOString(),
    cash_months: flat['cash_months'] ?? '',
    dti: flat['dti'] ?? '',
    marketHeat: {
      level: flat['marketHeat.level'] ?? 'warn',
      text: flat['marketHeat.text'] ?? '',
      notes: collectArray(flat, 'marketHeat.notes')
    },
    rateEnv: {
      level: flat['rateEnv.level'] ?? 'warn',
      text: flat['rateEnv.text'] ?? '',
      notes: collectArray(flat, 'rateEnv.notes')
    },
    actions: collectArray(flat, 'actions'),
    triggers: collectArray(flat, 'triggers'),
    irrCard: {
      purchasePrice: num(flat['irrCard.purchasePrice'], 9600000),
      renoCost: num(flat['irrCard.renoCost'], 350000),
      holdMonths: num(flat['irrCard.holdMonths'], 10),
      monthlyHoldCost: num(flat['irrCard.monthlyHoldCost'], 12000),
      feeRate: num(flat['irrCard.feeRate'], 0.03),
      targetIRR: num(flat['irrCard.targetIRR'], 0.12),
    },
    // ★ 新增：貸款與收入（供敏感度表使用）
    loan: {
      principal:  num(flat['loan.principal'], 0),
      rateAnnual: num(flat['loan.rateAnnualPct'], 2) / 100, // 轉小數
      termYears:  num(flat['loan.termYears'], 30),
    },
    income: {
      netMonthly: num(flat['income.netMonthly'], 0),
    }
  };

    updatedAt: new Date().toISOString(),
    cash_months: flat['cash_months'] ?? '',
    dti: flat['dti'] ?? '',
    marketHeat: {
      level: flat['marketHeat.level'] ?? 'warn',
      text: flat['marketHeat.text'] ?? '',
      notes: collectArray(flat, 'marketHeat.notes')
    },
    rateEnv: {
      level: flat['rateEnv.level'] ?? 'warn',
      text: flat['rateEnv.text'] ?? '',
      notes: collectArray(flat, 'rateEnv.notes')
    },
    actions: collectArray(flat, 'actions'),
    triggers: collectArray(flat, 'triggers'),
    irrCard: {
      purchasePrice: num(flat['irrCard.purchasePrice'], 9600000),
      renoCost: num(flat['irrCard.renoCost'], 350000),
      holdMonths: num(flat['irrCard.holdMonths'], 10),
      monthlyHoldCost: num(flat['irrCard.monthlyHoldCost'], 12000),
      feeRate: num(flat['irrCard.feeRate'], 0.03),
      targetIRR: num(flat['irrCard.targetIRR'], 0.12),
    }
  };

  return _json(out);
}

function collectArray(obj, prefix){
  const arr = [];
  let i=0, gaps=0;
  while (gaps < 3) {
    const k = `${prefix}[${i}]`;
    if (k in obj && obj[k] !== '' && obj[k] != null) {
      arr.push(obj[k]);
      gaps = 0;
    } else {
      gaps++;
    }
    i++;
  }
  return arr;
}
function num(v, d=0){ const n = Number(v); return isNaN(n) ? d : n; }

function _json(payload){
  return ContentService
    .createTextOutput(JSON.stringify(payload, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}
