import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateAuthenticationTokens } from "./token.js";
import { Role } from "../../prisma/generated/prisma/client.js";
import { buildFakeAdminUser } from "../../test/helpers/requesters.js";

describe("Token generation", () => {
  it("Should reject invalid user data", () => {
    const invalidUser = {
      id: 2,
      email: `user${Math.random()}${Date.now()}@ajdr.com`,
      name: "Fake user",
      password: "123",
      role: null, // invalid, should be from enum Role
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    assert.throws(() => generateAuthenticationTokens(invalidUser));
  });

  it("Should accept user with id 0", () => {
    const validUser = {
      id: 0,
      email: `user${Math.random()}${Date.now()}@ajdr.com`,
      name: "Fake member",
      password: "123",
      role: Role.member, // from enum Role
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    assert.doesNotThrow(() => generateAuthenticationTokens(validUser));
  });

  it("Should reject users with negative id", () => {
    const invalidUser = {
      id: -6,
      email: `user${Math.random()}${Date.now()}@ajdr.com`,
      name: "Fake member",
      password: "123",
      role: Role.member, // from enum Role
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    assert.throws(() => generateAuthenticationTokens(invalidUser));
  });

  it("Should return accessToken & refreshToken for valid users", async () => {
    const validAdminUser = await buildFakeAdminUser();

    const tokens = generateAuthenticationTokens(validAdminUser);

    assert.ok(tokens.accessToken);
    assert.ok(tokens.accessToken.token);
    assert.match(tokens.accessToken.token, /.{2,}/); // string with more than one character
    assert.ok(tokens.refreshToken);
    assert.ok(tokens.refreshToken.token);
    assert.match(tokens.refreshToken.token, /.{2,}/); // string with more than one character
  });
});
