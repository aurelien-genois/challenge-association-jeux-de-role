import { prisma } from "../client";
import { faker } from "@faker-js/faker";
import { $Enums } from "../generated/prisma/client";

export async function seedCharacterSheets() {
  // ***** ITEMS *****
  const fakeItems = Array.from({ length: 50 }).map(() => ({
    name: faker.commerce.productName(),
  }));
  const insertedItems = await prisma.item.createManyAndReturn({
    data: fakeItems,
    skipDuplicates: true,
  });

  // ***** JOBS *****
  const fakeJobs = Array.from({ length: 20 }).map(() => ({
    name: faker.person.jobType(),
  }));
  const insertedJobs = await prisma.job.createManyAndReturn({
    data: fakeJobs,
    skipDuplicates: true,
  });

  // ***** SKILLS *****
  const fakeSkills = Array.from({ length: 20 }).map(() => ({
    name: faker.word.verb(),
  }));
  const insertedSkills = await prisma.skill.createManyAndReturn({
    data: fakeSkills,
    skipDuplicates: true,
  });

  // ***** CHARACTER SHEETS *****
  const users = await prisma.user.findMany();
  const campaigns = await prisma.campaign.findMany();
  const fakeCharacters = Array.from({ length: 30 }).map((_, i) => ({
    status:
      Math.random() > 0.5
        ? ("draft" as $Enums.Status)
        : ("published" as $Enums.Status),
    name: faker.person.middleName(),
    age: faker.number.int({ min: 10, max: 1000 }),
    physical_desc: faker.lorem.paragraph(),
    bio: faker.person.bio(),
    campaign_id: campaigns[i % campaigns.length].id,
    user_id: users[i % users.length].id,
    job_id: insertedJobs[i % insertedJobs.length].id,
  }));
  const insertedCharacters = await prisma.characterSheet.createManyAndReturn({
    data: fakeCharacters,
    skipDuplicates: true,
  });

  // ***** CHARACTER_HAS_CHARACTERISTICS *****
  const characteristics = await prisma.characteristic.findMany();
  const fakeCharacterHasCharacteristics = Array.from({ length: 60 }).map(
    (_, i) => ({
      character_sheet_id: insertedCharacters[i % insertedCharacters.length].id,
      characteristic_id: characteristics[i % characteristics.length].id,
    })
  );
  // remove duplicated combinations
  const seenCharacterHasCharacteristics = new Set();
  const deduplicatedFakeCharacterHasCharacteristics =
    fakeCharacterHasCharacteristics.filter((e) => {
      const key = `${e.character_sheet_id}-${e.characteristic_id}`;
      if (seenCharacterHasCharacteristics.has(key)) return false;
      seenCharacterHasCharacteristics.add(key);
      return true;
    });
  await prisma.characterHasCharacteristic.createMany({
    data: deduplicatedFakeCharacterHasCharacteristics,
  });

  // ***** CHARACTER_HAS_SKILLS *****
  const fakeCharacterHasSkills = Array.from({ length: 60 }).map((_, i) => ({
    character_sheet_id: insertedCharacters[i % insertedCharacters.length].id,
    skill_id: insertedSkills[i % insertedSkills.length].id,
  }));
  // remove duplicated combinations
  const seenCharacterHasSkills = new Set();
  const deduplicatedFakeCharacterHasSkills = fakeCharacterHasSkills.filter(
    (e) => {
      const key = `${e.character_sheet_id}-${e.skill_id}`;
      if (seenCharacterHasSkills.has(key)) return false;
      seenCharacterHasSkills.add(key);
      return true;
    }
  );
  await prisma.characterHasSkill.createMany({
    data: deduplicatedFakeCharacterHasSkills,
  });

  // ***** INVENTORY *****
  const fakeInventory = Array.from({ length: 60 }).map((_, i) => ({
    character_sheet_id: insertedCharacters[i % insertedCharacters.length].id,
    item_id: insertedItems[i % insertedItems.length].id,
    nb: faker.number.int({ min: 1, max: 99 }),
  }));
  // remove duplicated combinations
  const seenInventory = new Set();
  const deduplicatedFakeInventory = fakeInventory.filter((e) => {
    const key = `${e.character_sheet_id}-${e.item_id}`;
    if (seenInventory.has(key)) return false;
    seenInventory.add(key);
    return true;
  });
  await prisma.inventory.createMany({
    data: deduplicatedFakeInventory,
  });
}
