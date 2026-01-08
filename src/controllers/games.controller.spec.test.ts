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

  it("Should return a 401 or 403 error", async () => {
    const response = await unauthenticatedRequester.get("/games");

    assert.ok([401, 403].includes(response.status));
  });

  it("Should get all categories", async () => {
    const response = await adminAuthenticatedRequester.get("/games");
    const data = await response.json();

    assert.strictEqual(data.length, 2);
    assert.strictEqual(response.status, 200);
  });
});
