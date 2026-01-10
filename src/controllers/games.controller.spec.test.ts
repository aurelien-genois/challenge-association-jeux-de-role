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

  it("[GET] /games/:id: Should return a 401 or 403 error if unauthenticated", async () => {
    const response = await unauthenticatedRequester.get("/games/0");

    assert.ok([401, 403].includes(response.status));
  });

  it("[GET] /games/:id: Should return a 404 error if game not found", async () => {
    const response = await adminAuthenticatedRequester.get("/games/3");
    const data = await response.json();

    assert.strictEqual(response.status, 404);
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

  it("[GET] /games/:id/campaigns: Should return a 401 or 403 error if unauthenticated", async () => {
    const response = await unauthenticatedRequester.get("/games/0/campaigns");

    assert.ok([401, 403].includes(response.status));
  });

  it("[GET] /games/:id/campaigns: Should return a 404 error if game not found", async () => {
    const response = await adminAuthenticatedRequester.get(
      "/games/3/campaigns"
    );
    const data = await response.json();

    assert.strictEqual(response.status, 404);
    assert.strictEqual(data.error.message, "Game not found");
  });

  it("[GET] /games/:id/campaigns: Should return the game's campaigns", async () => {
    const response = await adminAuthenticatedRequester.get(
      "/games/0/campaigns"
    );
    const data = await response.json();

    assert.strictEqual(data.length, 2);
    assert.strictEqual(response.status, 200);
  });
});

describe("[GET] /games/:id/characteristics", () => {
  beforeEach(async () => {
    // upsert() force id 0, so "/games/0" exist
    const insertedGame = await prisma.game.upsert({
      where: { id: 0 },
      update: { title: "Un super jeu" },
      create: { id: 0, title: "Un super jeu" },
    });
    let insertedCharacteristics =
      await prisma.characteristic.createManyAndReturn({
        data: [
          {
            name: "Cool",
          },
          {
            name: "Epic",
          },
        ],
      });
    insertedCharacteristics = Object.values(insertedCharacteristics); // reindex
    await prisma.gameHasCharacteristic.createManyAndReturn({
      data: [
        {
          game_id: insertedGame.id,
          characteristic_id: insertedCharacteristics[0].id,
        },
        {
          game_id: insertedGame.id,
          characteristic_id: insertedCharacteristics[1].id,
        },
      ],
    });
  });

  it("[GET] /games/:id/characteristics: Should return a 401 or 403 error if unauthenticated", async () => {
    const response = await unauthenticatedRequester.get(
      "/games/0/characteristics"
    );

    assert.ok([401, 403].includes(response.status));
  });

  it("[GET] /games/:id/characteristics: Should return a 404 error if game not found", async () => {
    const response = await adminAuthenticatedRequester.get(
      "/games/3/characteristics"
    );
    const data = await response.json();

    assert.strictEqual(response.status, 404);
    assert.strictEqual(data.error.message, "Game not found");
  });

  it("[GET] /games/:id/characteristics: Should return the game's characteristics", async () => {
    const response = await adminAuthenticatedRequester.get(
      "/games/0/characteristics"
    );
    const data = await response.json();

    console.log(data);

    assert.strictEqual(data.length, 2);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(data[0].characteristic.name, "Cool");
  });
});

describe("[POST] /games", () => {
  it("[POST] /games: Should return a 401 or 403 error if unauthenticated", async () => {
    const responsePost = await unauthenticatedRequester.post("/games", {
      body: JSON.stringify({
        title: "Un nouveau jeu !",
      }),
    });

    assert.ok([401, 403].includes(responsePost.status));
  });

  it("[POST] /games: Should return a 409 error if a game already exists with same title", async () => {
    await adminAuthenticatedRequester.post("/games", {
      body: JSON.stringify({
        title: "Un nouveau jeu !",
      }),
    });
    const duplicateGameResponse = await adminAuthenticatedRequester.post(
      "/games",
      {
        body: JSON.stringify({
          title: "Un nouveau jeu !",
        }),
      }
    );

    assert.strictEqual(duplicateGameResponse.status, 409);
  });

  it("[POST] /games: Should create a new game", async () => {
    const responsePost = await adminAuthenticatedRequester.post("/games", {
      body: JSON.stringify({
        title: "Un nouveau jeu !",
      }),
    });
    const dataPost = await responsePost.json();
    const response = await adminAuthenticatedRequester.get(
      `/games/${dataPost.id}`
    );
    const data = await response.json();

    assert.strictEqual(responsePost.status, 201);
    assert.strictEqual(data.title, "Un nouveau jeu !");
  });
});

describe("[PATCH] /games/:id", () => {
  beforeEach(async () => {
    await prisma.game.upsert({
      where: { id: 0 },
      update: { title: "Un super jeu" },
      create: { id: 0, title: "Un super jeu" },
    });
  });

  it("[PATCH] /games/:id: Should return a 401 or 403 error if unauthenticated", async () => {
    const responsePatch = await unauthenticatedRequester.patch("/games/0", {
      body: JSON.stringify({
        title: "Un nouveau nom !",
      }),
    });

    assert.ok([401, 403].includes(responsePatch.status));
  });

  it("[PATCH] /games/:id: Should return a 400 error if invalid game ID", async () => {
    const responsePatch = await adminAuthenticatedRequester.patch(
      "/games/test",
      {
        body: JSON.stringify({
          title: "Un nouveau nom !",
        }),
      }
    );

    assert.strictEqual(responsePatch.status, 400);
  });

  it("[PATCH] /games/:id: Should return a 404 error if game not found", async () => {
    const responsePatch = await adminAuthenticatedRequester.patch("/games/3", {
      body: JSON.stringify({
        title: "Un nouveau nom !",
      }),
    });

    assert.strictEqual(responsePatch.status, 404);
  });

  it("[PATCH] /games/:id: Should update the game title", async () => {
    const responsePatch = await adminAuthenticatedRequester.patch("/games/0", {
      body: JSON.stringify({
        title: "Un nouveau nom !",
      }),
    });
    const response = await adminAuthenticatedRequester.get("/games/0");
    const data = await response.json();

    assert.strictEqual(responsePatch.status, 200);
    assert.notEqual(data.title, "Un super jeu");
    assert.strictEqual(data.title, "Un nouveau nom !");
  });
});

describe("[DELETE] /games/:id", () => {
  beforeEach(async () => {
    await prisma.game.upsert({
      where: { id: 0 },
      update: { title: "Un jeu nul" },
      create: { id: 0, title: "Un jeu nul" },
    });
  });

  it("[[DELETE] /games/:id: Should return a 401 or 403 error if unauthenticated", async () => {
    const responseDelete = await unauthenticatedRequester.delete("/games/0");

    assert.ok([401, 403].includes(responseDelete.status));
  });

  it("[[DELETE] /games/:id: Should return a 400 error if invalid game ID", async () => {
    const responseDelete = await adminAuthenticatedRequester.delete(
      "/games/test"
    );

    assert.strictEqual(responseDelete.status, 400);
  });

  it("[[DELETE] /games/:id: Should return a 404 error if game not found", async () => {
    const responseDelete = await adminAuthenticatedRequester.delete("/games/3");

    assert.strictEqual(responseDelete.status, 404);
  });

  it("[[DELETE] /games/:id: Should delete the game", async () => {
    const responseDelete = await adminAuthenticatedRequester.delete("/games/0");
    const response = await adminAuthenticatedRequester.get("/games/0");
    const data = await response.json();

    assert.strictEqual(responseDelete.status, 204);
    assert.strictEqual(response.status, 404);
    assert.strictEqual(data.error.message, "Game not found");
  });
});
