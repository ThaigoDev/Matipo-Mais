// Configuração das seções gerenciadas no painel.
// Cada seção descreve os campos do formulário, como montar a tabela e
// quais informações contam para a "completude" do cadastro.
const BusinessRules = require("../Models/BusinessModel");
const HealthBR = require("../Models/HealthModel");
const HousingBR = require("../Models/HousingModel");
const JobsBR = require("../Models/JobsModel");

const contactFields = (prefix, phoneKey) => [
  { name: `${prefix}[whatsApp]`, label: "WhatsApp", type: "phone", group: "contact", placeholder: "(31) 90000-0000" },
  { name: `${prefix}[${phoneKey}]`, label: "Telefone", type: "phone", group: "contact", placeholder: "(31) 0000-0000" },
  { name: `${prefix}[email]`, label: "E-mail", type: "email", group: "contact", placeholder: "contato@exemplo.com", col: "full" },
];

const hoursFields = (openLabel = "Abre às", closeLabel = "Fecha às", daysLabel = "Dias de funcionamento") => [
  { name: "openingTime", label: openLabel, type: "time", group: "hours", required: true },
  { name: "closingTime", label: closeLabel, type: "time", group: "hours", required: true },
  { name: "operatingDays", label: daysLabel, type: "days", group: "hours", col: "full" },
];

const GROUPS = {
  info: { title: "Informações principais", icon: "ph-info" },
  contact: { title: "Contato", icon: "ph-phone" },
  hours: { title: "Funcionamento", icon: "ph-clock" },
  location: { title: "Localização", icon: "ph-map-pin" },
  publish: { title: "Publicação", icon: "ph-megaphone" },
};

const sections = {
  business: {
    key: "business",
    title: "Comércios",
    singular: "comércio",
    icon: "ph-storefront",
    color: "#ff8a1f",
    model: BusinessRules,
    base: "/admin/business",
    publicUrl: (id) => `/businessView/${id}`,
    listUrl: "/business/index",
    photoField: "businessPhoto",
    nameField: "businessName",
    locationField: "businessLocation",
    descriptionField: "businessDescription",
    mapField: "businessMapHTML",
    contactKey: "businessContact",
    phoneKey: "tel",
    statusOptions: ["Aberto", "Fechado"],
    statusHint: "O status muda sozinho conforme o horário de funcionamento.",
    fields: [
      { name: "businessName", label: "Nome do comércio", type: "text", group: "info", required: true, col: "full", placeholder: "Ex.: Padaria Pão Dourado" },
      { name: "categoryName", label: "Categoria", type: "category", group: "info", required: true },
      { name: "businessDescription", label: "Descrição", type: "textarea", group: "info", required: true, col: "full", placeholder: "Conte o que o comércio oferece, diferenciais, formas de pagamento…" },
      ...contactFields("businessContact", "tel"),
      ...hoursFields(),
      { name: "businessLocation", label: "Endereço", type: "text", group: "location", required: true, col: "full", placeholder: "Rua, número - Bairro" },
      { name: "businessMapHTML", label: "Mapa", type: "map", group: "location", col: "full", addressFrom: "businessLocation" },
      { name: "status", label: "Status", type: "status", group: "publish" },
    ],
  },

  health: {
    key: "health",
    title: "Saúde",
    singular: "estabelecimento de saúde",
    icon: "ph-first-aid-kit",
    color: "#e2364f",
    model: HealthBR,
    base: "/admin/health",
    publicUrl: (id) => `/healthView/${id}`,
    listUrl: "/health/index",
    photoField: "healthPhoto",
    nameField: "healthName",
    locationField: "healthLocation",
    descriptionField: "healthDescription",
    mapField: "healthHTMLMap",
    contactKey: "healthContactInfos",
    phoneKey: "phone",
    statusOptions: ["Aberto", "Fechado"],
    statusHint: "O status muda sozinho conforme o horário de funcionamento.",
    fields: [
      { name: "healthName", label: "Nome do estabelecimento", type: "text", group: "info", required: true, col: "full", placeholder: "Ex.: Farmácia Central" },
      { name: "categoryName", label: "Categoria", type: "category", group: "info", required: true },
      { name: "healthDescription", label: "Descrição", type: "textarea", group: "info", col: "full", placeholder: "Especialidades, serviços, convênios aceitos…" },
      ...contactFields("healthContactInfos", "phone"),
      ...hoursFields(),
      { name: "daysOnDuty", label: "Dias de plantão", type: "days", group: "hours", col: "full", help: "Aparece em destaque na página de Saúde nos dias marcados." },
      { name: "healthLocation", label: "Endereço", type: "text", group: "location", required: true, col: "full", placeholder: "Rua, número - Bairro" },
      { name: "healthHTMLMap", label: "Mapa", type: "map", group: "location", col: "full", addressFrom: "healthLocation" },
      { name: "status", label: "Status", type: "status", group: "publish" },
    ],
  },

  housing: {
    key: "housing",
    title: "Moradia",
    singular: "imóvel",
    icon: "ph-house-line",
    color: "#0ea5a0",
    model: HousingBR,
    base: "/admin/housing",
    publicUrl: (id) => `/housingView/${id}`,
    listUrl: "/housing/index",
    photoField: "housingPhoto",
    nameField: "housingName",
    locationField: "housingLocation",
    descriptionField: "housingDescription",
    mapField: "housingHTMLMap",
    contactKey: "housingContactInfos",
    phoneKey: "phone",
    statusOptions: ["Disponível", "Indisponível"],
    fields: [
      { name: "housingName", label: "Título do anúncio", type: "text", group: "info", required: true, col: "full", placeholder: "Ex.: Apartamento 2 quartos no Centro" },
      { name: "categoryName", label: "Categoria", type: "category", group: "info", required: true },
      { name: "roomsQTD", label: "Quartos", type: "number", group: "info", min: 0 },
      { name: "bathroomsQTD", label: "Banheiros", type: "number", group: "info", min: 0 },
      { name: "housingDescription", label: "Descrição", type: "textarea", group: "info", col: "full", placeholder: "Valor do aluguel, mobília, garagem, condições…" },
      ...contactFields("housingContactInfos", "phone"),
      { name: "housingLocation", label: "Endereço", type: "text", group: "location", required: true, col: "full", placeholder: "Rua, número - Bairro" },
      { name: "housingHTMLMap", label: "Mapa", type: "map", group: "location", col: "full", addressFrom: "housingLocation" },
      { name: "status", label: "Disponibilidade", type: "status", group: "publish" },
    ],
  },

  jobs: {
    key: "jobs",
    title: "Empregos",
    singular: "vaga",
    icon: "ph-briefcase",
    color: "#7c4dff",
    model: JobsBR,
    base: "/admin/jobs",
    publicUrl: (id) => `/jobsView/${id}`,
    listUrl: "/jobs/index",
    photoField: "jobPhoto",
    nameField: "jobName",
    locationField: "jobLocation",
    descriptionField: "jobDescription",
    mapField: "jobMapHTML",
    contactKey: "jobContact",
    phoneKey: "phone",
    subtitleField: "businessName",
    statusOptions: ["Aberta", "Encerrada"],
    fields: [
      { name: "jobName", label: "Cargo", type: "text", group: "info", required: true, col: "full", placeholder: "Ex.: Auxiliar administrativo" },
      { name: "businessName", label: "Empresa", type: "text", group: "info", placeholder: "Nome da empresa contratante" },
      { name: "categoryName", label: "Categoria", type: "category", group: "info", required: true },
      { name: "jobDescription", label: "Descrição da vaga", type: "textarea", group: "info", required: true, col: "full", placeholder: "Requisitos, salário, benefícios, como se candidatar…" },
      ...contactFields("jobContact", "phone"),
      ...hoursFields("Início do expediente", "Fim do expediente", "Dias de trabalho"),
      { name: "jobLocation", label: "Endereço", type: "text", group: "location", required: true, col: "full", placeholder: "Rua, número - Bairro" },
      { name: "jobMapHTML", label: "Mapa", type: "map", group: "location", col: "full", addressFrom: "jobLocation" },
      { name: "status", label: "Situação da vaga", type: "status", group: "publish" },
    ],
  },
};

// Lê um valor do registro a partir do nome do campo ("a[b]" -> registro.a.b)
function valueOf(record, name) {
  return name
    .replace(/\]/g, "")
    .split("[")
    .reduce((obj, key) => (obj == null ? undefined : obj[key]), record);
}

// Itens que indicam um cadastro completo e útil para o cidadão
function completeness(section, record) {
  const contact = record[section.contactKey] || {};
  const checks = [
    ["Foto", Boolean(record[section.photoField])],
    ["Descrição", Boolean((record[section.descriptionField] || "").trim())],
    ["Contato", Boolean(contact.whatsApp || contact[section.phoneKey] || contact.email)],
    ["Mapa", Boolean((record[section.mapField] || "").trim())],
  ];
  if (section.fields.some((f) => f.name === "openingTime")) {
    checks.push(["Horário", Boolean(record.openingTime && record.closingTime)]);
  }
  const missing = checks.filter(([, ok]) => !ok).map(([label]) => label);
  return { pct: Math.round(((checks.length - missing.length) / checks.length) * 100), missing };
}

module.exports = { sections, GROUPS, valueOf, completeness };
