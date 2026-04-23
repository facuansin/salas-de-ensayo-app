import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.booking.deleteMany({})
  await prisma.room.deleteMany({})

  const room = await prisma.room.create({
    data: {
      name: 'Sala 1 (Abajo)',
      description: 'Equipada con Marshall JCM900, Ampeg SVT y batería Tama Rockstar.',
      pricePerHour: 15000,
    },
  })
  
  const room2 = await prisma.room.create({
    data: {
      name: 'Sala 2 (Arriba)',
      description: 'Equipada con Fender Twin Reverb, Vox AC30 y batería Ludwig.',
      pricePerHour: 12000,
    },
  })

  const room3 = await prisma.room.create({
    data: {
      name: 'Sala 3 (Arriba)',
      description: 'Acústica perfecta, Piano Yamaha U3, batería Gretsch y equipo de voces Bose.',
      pricePerHour: 18000,
    },
  })

  console.log({ room, room2, room3 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
