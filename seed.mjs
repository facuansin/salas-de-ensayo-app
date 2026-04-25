import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if rooms already exist to avoid duplicating
  const count = await prisma.room.count();
  if (count > 0) {
    console.log('Rooms already exist. Skipping seed.');
    return;
  }

  const rooms = [
    {
      id: 'sala-1',
      name: 'Sala 1 (Planta Alta)',
      description: 'Nuestra sala más grande. Ideal para bandas de más de 5 integrantes. Cuenta con batería Pearl Export de 6 cuerpos, amplificadores valvulares Marshall y Fender, cabezal Ampeg para bajo y sistema de monitoreo in-ear.',
      pricePerHour: 8000,
    },
    {
      id: 'sala-2',
      name: 'Sala 2 (Planta Alta)',
      description: 'Diseñada específicamente para ensambles acústicos, jazz y grabaciones de voces. Tratamiento acústico de primera línea, piano de cola y micrófonos condensadores de estudio.',
      pricePerHour: 7500,
    },
    {
      id: 'sala-3',
      name: 'Sala 3',
      description: 'Perfecta para DJs, productores de música electrónica y bandas modernas. Incluye controladores MIDI, sintetizadores análogos, iluminación dinámica LED y monitores de estudio KRK.',
      pricePerHour: 7000,
    }
  ];

  for (const room of rooms) {
    await prisma.room.create({
      data: room
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
