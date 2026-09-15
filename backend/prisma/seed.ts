import { PrismaClient, MuscleGroup, ContentStatus, MealType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial exercises and dishes...');

  // Default Exercises
  const defaultExercises = [
    {
      name: 'Press de Banca Plano',
      description: 'Ejercicio multiarticular básico para el desarrollo del pectoral mayor.',
      muscleGroup: MuscleGroup.CHEST,
      difficulty: 3,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Aperturas con Mancuernas',
      description: 'Aislamiento de pectoral para mayor estiramiento muscular.',
      muscleGroup: MuscleGroup.CHEST,
      difficulty: 2,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Dominadas Pronadas',
      description: 'Ejercicio de tirón vertical para desarrollo de dorsal ancho.',
      muscleGroup: MuscleGroup.BACK,
      difficulty: 4,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Remo con Barra',
      description: 'Ejercicio de tirón horizontal enfocado en grosor de espalda.',
      muscleGroup: MuscleGroup.BACK,
      difficulty: 3,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Sentadilla Trasera con Barra',
      description: 'El rey de los ejercicios de pierna para cuadríceps y glúteos.',
      muscleGroup: MuscleGroup.LEGS,
      difficulty: 4,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Prensa de Piernas 45°',
      description: 'Trabajo pesado de cuadríceps sin carga axial en la columna.',
      muscleGroup: MuscleGroup.LEGS,
      difficulty: 2,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Peso Muerto Rumano',
      description: 'Enfoque intenso en isquiotibiales y cadena posterior.',
      muscleGroup: MuscleGroup.LEGS,
      difficulty: 3,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Press Militar de Hombros',
      description: 'Fuerza e hipertrofia para deltoides anterior y medio.',
      muscleGroup: MuscleGroup.SHOULDERS,
      difficulty: 3,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Elevaciones Laterales',
      description: 'Aislamiento de deltoides lateral para amplitud de hombros.',
      muscleGroup: MuscleGroup.SHOULDERS,
      difficulty: 2,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Curl de Biceps con Barra EZ',
      description: 'Aislamiento para bíceps con agarre ergonómico.',
      muscleGroup: MuscleGroup.ARMS,
      difficulty: 2,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Extensión de Tríceps en Polea Alta',
      description: 'Aislamiento de la cabeza lateral y medial del tríceps.',
      muscleGroup: MuscleGroup.ARMS,
      difficulty: 1,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Crunch Abdominal en Polea',
      description: 'Carga progresiva para el recto abdominal.',
      muscleGroup: MuscleGroup.CORE,
      difficulty: 2,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Plancha Frontal con Peso',
      description: 'Estabilidad del core y antirrotación.',
      muscleGroup: MuscleGroup.CORE,
      difficulty: 3,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Sprint en Cinta / HIIT',
      description: 'Entrenamiento interválico de alta intensidad para capacidad cardiovascular.',
      muscleGroup: MuscleGroup.CARDIO,
      difficulty: 4,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
  ];

  for (const ex of defaultExercises) {
    const exists = await prisma.exercise.findFirst({ where: { name: ex.name } });
    if (!exists) {
      await prisma.exercise.create({ data: ex });
    }
  }

  // Default Dishes
  const defaultDishes = [
    {
      name: 'Pechuga de Pollo a la Plancha con Arroz Integral',
      description: 'Plato clásico fit con proteína limpia y carbohidratos de absorción lenta.',
      calories: 450,
      protein: 42,
      carbs: 50,
      fat: 6,
      mealType: MealType.LUNCH,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Tortilla de Claras con Avena y Frutos Rojos',
      description: 'Desayuno alto en proteína y fibra para empezar el día.',
      calories: 380,
      protein: 30,
      carbs: 45,
      fat: 7,
      mealType: MealType.BREAKFAST,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Salmón al Horno con Patata Dulce y Espárragos',
      description: 'Rico en Omega-3, grasas saludables y micronutrientes.',
      calories: 520,
      protein: 38,
      carbs: 40,
      fat: 20,
      mealType: MealType.DINNER,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Batido Proteico de Suero, Plátano y Manteca de Cacahuete',
      description: 'Merienda post-entrenamiento de rápida recuperación.',
      calories: 350,
      protein: 32,
      carbs: 38,
      fat: 10,
      mealType: MealType.SNACK,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Ensalada de Atún, Quinoa y Aguacate',
      description: 'Comida fresca, completa en aminoácidos y grasas insaturadas.',
      calories: 420,
      protein: 35,
      carbs: 35,
      fat: 15,
      mealType: MealType.LUNCH,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Yogur Griego 0% con Nueces y Miel',
      description: 'Snack proteico nocturno de digestión progresiva.',
      calories: 260,
      protein: 20,
      carbs: 22,
      fat: 10,
      mealType: MealType.SNACK,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
    {
      name: 'Tostadas de Pan Cereal con Aguacate y Huevo Escalfado',
      description: 'Desayuno equilibrado en macronutrientes esenciales.',
      calories: 400,
      protein: 18,
      carbs: 36,
      fat: 21,
      mealType: MealType.BREAKFAST,
      isDefault: true,
      status: ContentStatus.APPROVED,
    },
  ];

  for (const dish of defaultDishes) {
    const exists = await prisma.dish.findFirst({ where: { name: dish.name } });
    if (!exists) {
      await prisma.dish.create({ data: dish });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
