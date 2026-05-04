import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    db: {  // <-- Tambahkan block 'db' disini
      provider: "postgresql",
      url: env("DATABASE_URL"),  // <-- Gunakan env() helper, bukan process.env langsung
    },
  },
});