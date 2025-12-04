import { prisma } from "../client";
import { faker } from "@faker-js/faker";

export async function seedGames() {
  // game
  const fakeGames = Array.from({ length: 4 }).map(() => ({
    title: faker.string.sample({ min: 5, max: 50 }),
  }));
  const insertedGames = await prisma.game.createManyAndReturn({
    data: fakeGames,
    skipDuplicates: true,
  });

  // campaign
  const fakeCampaings = Array.from({ length: 10 }).map(() => ({
    game_id: faker.number.int({
      min: insertedGames[0].id,
      max: insertedGames[insertedGames.length - 1].id,
    }),
  }));
  await prisma.campaign.createMany({
    data: fakeCampaings,
  });

  // characteristic
  const fakeCharacteristics = Array.from({ length: 40 }).map(() => ({
    name: faker.word.adjective(),
  }));
  const insertedCharacteristics =
    await prisma.characteristic.createManyAndReturn({
      data: fakeCharacteristics,
      skipDuplicates: true,
    });

  // game_has_characteristic
  const fakeGameHasCharacteristics = Array.from({ length: 100 }).map(
    (_, i) => ({
      game_id: faker.number.int({
        min: insertedGames[0].id,
        max: insertedGames[insertedGames.length - 1].id,
      }),
      // each characteristic id will be inserted (loop from first to last with %)
      characteristic_id:
        insertedCharacteristics[i % insertedCharacteristics.length].id,
    })
  );
  // remove duplicated combinations
  const seen = new Set();
  const deduplicatedFakeGameHasCharacteristics =
    fakeGameHasCharacteristics.filter((e) => {
      const key = `${e.game_id}-${e.characteristic_id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  await prisma.gameHasCharacteristic.createMany({
    data: deduplicatedFakeGameHasCharacteristics,
  });
}
