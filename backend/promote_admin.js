const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function promoteAdmin() {
  const updated = await p.user.update({
    where: { email: 'admin@nutriflare.com' },
    data: { role: 'ADMIN' },
    select: { email: true, username: true, role: true },
  });
  console.log('✓ User promoted to ADMIN:', updated);
}

promoteAdmin().finally(() => p.$disconnect());
