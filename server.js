require("dotenv").config(); // variáveis de ambiente do arquivo .env (precisa vir antes de tudo)
const express = require("express");
const path = require("path");
const nodeCron = require("node-cron");
const flash = require("connect-flash");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const db = require("./src/config/db");
const GlobalMiddleware = require("./src/Middlewares/middlewares");
const cronJobs = require("./src/config/cronJobs");
const router = require("./routes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); //definindo onde nossos arquivos do front-end vão ficar
app.set("view engine", "ejs"); //definindo qual motor vai ser usado para renderizar o html na tela.
app.set("views", path.resolve(__dirname, "src", "Views")); //  definido onde esse HTML vai estar
app.locals.fmt = require("./src/config/viewHelpers"); // formatação de datas usada nas views

const sessionOptions = session({
  secret: process.env.SESSION_SECRET || "Sessions",
  store: new PgSession({ pool: db.pool, tableName: "sessions", createTableIfMissing: true }), // sessões salvas no Postgres
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 7,
    httpOnly: true,
  },
});
app.use(sessionOptions);
app.use(flash());
app.use(GlobalMiddleware);
app.use(router);

// Erros: upload inválido volta com aviso; o resto mostra uma página amigável
app.use((err, req, res, next) => {
  if (err && err.name === "MulterError" && req.session) {
    req.flash("erros", err.code === "LIMIT_FILE_SIZE" ? "A imagem é muito grande (máximo 5 MB)." : "Envie uma imagem PNG, JPG ou WEBP.");
    return res.redirect(req.get("Referrer") || "/admin/dashboard");
  }
  console.error(err);
  res.status(500).render("ErrorPage");
});

async function start() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL não definida. Copie .env.example para .env e rode: docker compose up -d");
    process.exit(1);
  }

  // Conecta no PostgreSQL e cria as tabelas, se necessário
  try {
    await db.migrate();
    console.log("Conectado ao PostgreSQL!");
  } catch (e) {
    console.error("Não foi possível conectar ao PostgreSQL. O container está rodando? (docker compose up -d)");
    console.error(e.message);
    process.exit(1);
  }

  // Atualiza o status (Aberto/Fechado) de comércios e saúde a cada minuto
  cronJobs();
  nodeCron.schedule("* * * * *", cronJobs);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Acesse : http://localhost:${port}/`);
  });
}

start();
