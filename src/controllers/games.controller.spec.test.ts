import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { prisma } from "../../prisma/client.js";
import {
  unauthenticatedRequester,
  adminAuthenticatedRequester,
} from "../../test/helpers/requesters.js";

// Reminder test format: Arrange -> Act -> Assert

describe("[GET] /games", () => {
  beforeEach(async () => {
    await prisma.game.createMany({
      data: [
        {
          title: "Jeu 1",
        },
        {
          title: "Jeu 2",
        },
      ],
    });
  });

  it("[GET] /games: Should return a 401 or 403 error", async () => {
    const response = await unauthenticatedRequester.get("/games");

    assert.ok([401, 403].includes(response.status));
  });

  it("[GET] /games: Should get all games", async () => {
    const response = await adminAuthenticatedRequester.get("/games");
    const data = await response.json();

    assert.strictEqual(data.length, 2);
    assert.strictEqual(response.status, 200);
  });
});

describe("[GET] /games/:id", () => {
  beforeEach(async () => {
    // upsert() force id 0, so "/games/0" exist
    await prisma.game.upsert({
      where: { id: 0 },
      update: { title: "Un super jeu" },
      create: { id: 0, title: "Un super jeu" },
    });
  });

  it("[GET] /games/:id: Should return a 401 or 403 error", async () => {
    const response = await unauthenticatedRequester.get("/games/0");

    assert.ok([401, 403].includes(response.status));
  });

  it("[GET] /games/:id: Should return a 404 error with a message", async () => {
    const response = await adminAuthenticatedRequester.get("/games/3");
    const data = await response.json();

    assert.ok([404].includes(response.status));
    assert.strictEqual(data.error.message, "Game not found");
  });

  it("[GET] /games/:id: Should return the game with its title", async () => {
    const response = await adminAuthenticatedRequester.get("/games/0");
    const data = await response.json();

    assert.strictEqual(data.title, "Un super jeu");
    assert.strictEqual(response.status, 200);
  });
});

describe("[GET] /games/:id/campaigns", () => {
  beforeEach(async () => {
    // upsert() force id 0, so "/games/0" exist
    const insertedGame = await prisma.game.upsert({
      where: { id: 0 },
      update: { title: "Un super jeu" },
      create: { id: 0, title: "Un super jeu" },
    });
    await prisma.campaign.createMany({
      data: [
        {
          game_id: insertedGame.id,
        },
        {
          game_id: insertedGame.id,
        },
      ],
    });
  });

  it("[GET] /games/:id/campaigns: Should return a 401 or 403 error", async () => {
    const response = await unauthenticatedRequester.get("/games/0/campaigns");

    assert.ok([401, 403].includes(response.status));
  });

  it("[GET] /games/:id/campaigns: Should return a 404 error with a message", async () => {
    const response = await adminAuthenticatedRequester.get(
      "/games/3/campaigns"
    );
    const data = await response.json();

    assert.ok([404].includes(response.status));
    assert.strictEqual(data.error.message, "Game not found");
  });

  it("[GET] /games/:id/campaigns: Should return the game campaigns", async () => {
    const response = await adminAuthenticatedRequester.get(
      "/games/0/campaigns"
    );
    const data = await response.json();

    assert.strictEqual(data.length, 2);
    assert.strictEqual(response.status, 200);
  });
});

// "[GET] /games/:id/characteristics"
// "[POST] /games"
// "[PATCH] /games/:id"
// "[DELETE] /games/:id"
