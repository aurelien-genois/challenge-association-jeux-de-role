import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { emailValidation, usernameValidation } from "./users.schema.js";
import { gameSchemas } from "./game.schema.js";

// Reminder test format: Arrange -> Act -> Assert

describe("User fields Zod schemas", () => {
  it("Should accept valid email", () => {
    const validEmail = "john@gmail.com";
    const parsedEmail = emailValidation.parse(validEmail);
    assert.equal(parsedEmail, validEmail);
  });
  it("Should reject invalid email", () => {
    const invalidEmail = "john@gmail";
    const errorCall = () => emailValidation.parse(invalidEmail);
    assert.throws(errorCall);
  });
  it("Should accept a valid username  > 3 and < 12", () => {
    const validUsername = "john";
    const parsedUsername = usernameValidation.parse(validUsername);
    assert.equal(parsedUsername, validUsername);
  });
  it("Should reject invalid usernames", () => {
    const invalidUsername1 = "";
    const invalidUsername2 = "a";
    const invalidUsername3 = "aaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaa aaaaaaa";
    const errorCall1 = () => usernameValidation.parse(invalidUsername1);
    const errorCall2 = () => usernameValidation.parse(invalidUsername2);
    const errorCall3 = () => usernameValidation.parse(invalidUsername3);
    assert.throws(errorCall1);
    assert.throws(errorCall2);
    assert.throws(errorCall3);
  });
});

describe("Game Zod schemas", () => {
  it("Should accept a valid title > 3 and < 50", () => {
    const validTitle = "Fallout";
    const { title: parsedTitle } = gameSchemas.createOrUpdate.parse({
      title: validTitle,
    });
    assert.equal(parsedTitle, validTitle);
  });
  it("Should reject invalid titles", () => {
    const invalidTitle1 = "1";
    const invalidTitle2 = "";
    const invalidTitle3 =
      "aaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaa aaaaaaaaaaa";
    const errorCall1 = () =>
      gameSchemas.createOrUpdate.parse({ title: invalidTitle1 });
    const errorCall2 = () =>
      gameSchemas.createOrUpdate.parse({ title: invalidTitle2 });
    const errorCall3 = () =>
      gameSchemas.createOrUpdate.parse({ title: invalidTitle3 });
    assert.throws(errorCall1);
    assert.throws(errorCall2);
    assert.throws(errorCall3);
  });
});
