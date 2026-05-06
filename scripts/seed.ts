const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('adminpassword', 10);

  // Original Admin (preserve existing logic)
  const originalAdmin = await prisma.user.upsert({
    where: { email: 'admin@monster.com' },
    update: {
      password: adminPassword,
      role: 'admin',
      is_approved: true,
    },
    create: {
      email: 'admin@monster.com',
      name: 'Admin Monster',
      password: adminPassword,
      role: 'admin',
      is_approved: true,
    },
  });

  // Test Admin (for E2E tests)
  const testAdmin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password,
      role: 'admin',
      is_approved: true,
    },
    create: {
      email: 'admin@example.com',
      name: 'Test Admin',
      password,
      role: 'admin',
      is_approved: true,
    },
  });

  // Test User (for E2E tests)
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      password,
      role: 'user',
      is_approved: true,
    },
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password,
      role: 'user',
      is_approved: true,
    },
  });

  // Seed Kamus for E2E tests
  const seedKamus = await prisma.kamus.upsert({
    where: { id: 'seed-kamus-1' },
    update: {},
    create: {
      id: 'seed-kamus-1',
      name: 'Seed Kamus',
      template: 'default',
    },
  });

  // Seed Standar for E2E tests
  const seedStandar = await prisma.standar.upsert({
    where: { id: 'seed-standar-1' },
    update: {},
    create: {
      id: 'seed-standar-1',
      name: 'Seed Standar',
      content: 'default',
    },
  });

  // Seed Scenario for E2E tests
  const seedScenario = await prisma.scenario.upsert({
    where: { id: 'seed-scenario-1' },
    update: {},
    create: {
      id: 'seed-scenario-1',
      name: 'Seed Scenario',
      content: 'default',
    },
  });

  // Seed Project for E2E tests
  const seedProject = await prisma.project.upsert({
    where: { id: 'seed-project-1' },
    update: {},
    create: {
      id: 'seed-project-1',
      name: 'Seed Project',
      description: 'A seed project for E2E testing',
      status: 'draft',
    },
  });

  console.log({ originalAdmin, testAdmin, testUser, seedKamus, seedStandar, seedScenario, seedProject });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
