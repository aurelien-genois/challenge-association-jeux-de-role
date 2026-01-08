import { after, before, beforeEach } from "node:test";
import path from "node:path";
import { $ } from "zx";
import { Server } from "node:http";
import app from "../../src/app.js";
import { prisma } from "../../prisma/client.js";
import debug from "debug";

const logger = debug("app:test");

logger("=================================================");

let server: Server;

before(async () => {
  logger("Build Docker DB container");
  const composeFileAbsolutePath = path.resolve(
    import.meta.dirname,
    "docker-compose.test.yml"
  );
  await $`docker compose -f ${composeFileAbsolutePath} -p ajdr-test-db up -d`;
  await $`sleep 1`;

  logger("Create DB tables");
  const prismaSchemaAbsolutePath = path.resolve(
    import.meta.dirname,
    "../../prisma/schema.prisma"
  );
  await $`npx prisma db push --schema=${prismaSchemaAbsolutePath}`;

  logger("Open server");
  server = app.listen(process.env.PORT);
});

async function truncateTables() {
  await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
    r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
      EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" RESTART IDENTITY CASCADE';
      END LOOP;
      END $$;
      `);
}
beforeEach(async () => {
  logger("Before each: truncate tables");
  await truncateTables();
});

after(async () => {
  logger("After: close server");
  server.close();
  logger("After: disconnect DB");
  await prisma.$disconnect();
  logger("After: stop Docker DB container");
  await $`docker compose -p ajdr-test-db down`;
});
