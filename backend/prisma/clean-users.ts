import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Iniciando limpieza de usuarios...');

  // 1. Desvincular ejercicios y platos creados por usuarios antes de borrar
  // para que los ejercicios/platos no causen conflicto de clave foránea
  await prisma.exercise.updateMany({
    where: { submittedById: { not: null } },
    data: { submittedById: null },
  });

  await prisma.dish.updateMany({
    where: { submittedById: { not: null } },
    data: { submittedById: null },
  });

  // 2. Eliminar todos los usuarios (las relaciones cascade limpiarán rutinas,
  // planes, logs de progreso, metas, valoraciones y tokens automáticamente)
  const deleted = await prisma.user.deleteMany({});

  console.log(`✅ Se han eliminado correctamente ${deleted.count} usuario(s).`);
}

main()
  .catch((e) => {
    console.error('❌ Error al eliminar usuarios:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
