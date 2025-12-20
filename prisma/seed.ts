import { prisma } from "./client.js";
import { seedGames } from "./seeds/games.js";
import { seedUsers } from "./seeds/users.js";
import { seedCharacterSheets } from "./seeds/characterSheets.js";

async function main() {
  // Clear tables in dependency order (! $executeRawUnsafe only for seedling !)
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "game_has_characteristic", "characteristic", "campaign", "game", "user", "item", "job", "skill", "character_sheet", "character_has_characteristic", "character_has_skill", "inventory" RESTART IDENTITY CASCADE;`
  );

  await seedGames();

  // ** 2 users
  await seedUsers();

  // ** 3 characters
  await seedCharacterSheets();
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
