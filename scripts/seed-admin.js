// Cria (ou atualiza) a conta de administrador definida no .env
// Uso: npm run seed:admin
require("dotenv").config();
const db = require("../src/config/db");
const LoginAndSignUpBR = require("../src/Models/LoginAndSignUpModel");

async function main() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env");
    process.exit(1);
  }

  await db.migrate();
  const account = new LoginAndSignUpBR({ name: ADMIN_NAME || "Admin", email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  await account.create();
  console.log(`Administrador pronto: ${account.account.email}`);
  await db.pool.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
