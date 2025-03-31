const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ],
  });
}

main()
  .then(() => console.log('Seeding done'))
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
