import app from "./app";
import prisma from "./config/db";

const PORT = process.env.PORT ?? 3000;

async function main() {
  await prisma.$connect();
  console.log("PostgreSQL connected");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
