const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.delete({
      where: { email: 'manullanorebanal@gmail.com' }
    });
    console.log('User deleted');
  } catch (e) {
    console.log('User not found or error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
