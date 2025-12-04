import { prisma } from "./client";
import { seedGames } from "./seeds/games";
import { seedUsers } from "./seeds/users";

async function main() {
  // Clear tables in dependency order
  await prisma.gameHasCharacteristic.deleteMany();
  await prisma.characteristic.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  await seedGames();

  // ** 2 users
  await seedUsers();

  // ** 3 characters
  // item (createManyAndReturn for inventory item_id min/max)
  // job (createManyAndReturn for character-sheet job_id min/max)
  // skill  (createManyAndReturn for character_has_skill skill_id min/max)
  // character-sheet (select all campaigns/users to get min/max ids | createManyAndReturn for inventory/character_has_characteristic/character_has_skill character_id min/max)
  // character_has_characteristic (select all characteristics to get min/max ids)
  // character_has_skill
  // inventory
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
