import { prisma } from "./client";
import { seedGames } from "./seeds/games";

// ** 1 games
// game
// campaign
// characteristic
// game_has_characteristic
await prisma.gameHasCharacteristic.deleteMany();
await prisma.characteristic.deleteMany();
await prisma.campaign.deleteMany();
await prisma.game.deleteMany();
seedGames()
  .catch((e) => {
    console.error("❌ Seed games error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// ** 2 users
// user
// ** 3 characters
// item (createManyAndReturn for inventory item_id min/max)
// job (createManyAndReturn for character-sheet job_id min/max)
// skill  (createManyAndReturn for character_has_skill skill_id min/max)
// character-sheet (select all campaigns/users to get min/max ids | createManyAndReturn for inventory/character_has_characteristic/character_has_skill character_id min/max)
// character_has_characteristic (select all characteristics to get min/max ids)
// character_has_skill
// inventory
