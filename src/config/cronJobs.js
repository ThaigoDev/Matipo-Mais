const BusinessRules = require("../Models/BusinessModel");
const HealthBR = require("../Models/HealthModel");
const businessBR = new BusinessRules({});
const healthBR = new HealthBR({});

// Aberto se o horário atual estiver entre a abertura e o fechamento
function isOpenNow(openingTime, closingTime, now) {
  if (!openingTime || !closingTime) return null;
  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  const current = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(openingTime);
  const close = toMinutes(closingTime);
  if (Number.isNaN(open) || Number.isNaN(close)) return null;
  // Suporta horários que passam da meia-noite (ex.: 18:00 às 02:00)
  return open <= close ? current >= open && current < close : current >= open || current < close;
}

async function refresh(rules, items, now) {
  for (const item of items) {
    const open = isOpenNow(item.openingTime, item.closingTime, now);
    if (open === null) continue;
    const status = open ? "Aberto" : "Fechado";
    if (item.status !== status) await rules.updateStatus(item._id, status);
  }
}

async function changeStatus() {
  try {
    const now = new Date();
    await refresh(businessBR, await businessBR.read(), now);
    await refresh(healthBR, await healthBR.read(), now);
  } catch (e) {
    console.error("Falha ao atualizar status:", e.message);
  }
}

module.exports = changeStatus;
