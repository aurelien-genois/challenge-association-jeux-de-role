import { prisma } from "../client.js";
import { faker } from "@faker-js/faker";
import { $Enums } from "../generated/prisma/client.js";
import { config } from "../../server.config.js";
import bcrypt from "bcrypt";

export async function seedUsers() {
  // ***** ADMIN USER *****
  if (config.admin.adminEmail && config.admin.adminPassword) {
    const adminPassword = await bcrypt.hash(config.admin.adminPassword, 10);
    await prisma.user.create({
      data: {
        email: config.admin.adminEmail,
        name: "Aurélien",
        password: adminPassword,
        role: "admin" as $Enums.Role,
        is_active: true,
      },
    });
  } else {
    console.warn("Missing admin email or password ! NO admin user created");
  }

  // ***** MEMBER USERS *****
  const fakeUsers = Array.from({ length: 200 }).map(() => ({
    email: faker.internet.email().toLowerCase(),
    name: faker.person.firstName(),
    password: faker.string.alphanumeric(12), // not necessary to hash
    role: "member" as $Enums.Role,
    is_active: faker.datatype.boolean(0.8),
  }));
  // remove duplicated emails
  const seen = new Set();
  const deduplicatedFakeUsers = fakeUsers.filter((u) => {
    if (seen.has(u.email)) return false;
    seen.add(u.email);
    return true;
  });
  // per batch of 100
  for (let i = 0; i < deduplicatedFakeUsers.length; i += 100) {
    await prisma.user.createMany({
      data: deduplicatedFakeUsers.slice(i, i + 100),
      skipDuplicates: true,
    });
  }
}
