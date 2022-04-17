import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@example.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("letmein", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const poll = await prisma.poll.create({
    data: {
      title: "Do you like my first poll?",
      userId: user.id,
    },
  });

  await prisma.poll.create({
    data: {
      title: "Empty poll",
    },
  });

  const optionYes = await prisma.option.create({
    data: {
      title: "Yes",
      pollId: poll.id,
    },
  });

  const optionNo = await prisma.option.create({
    data: {
      title: "No",
      pollId: poll.id,
    },
  });

  const optionMaybe = await prisma.option.create({
    data: {
      title: "Maybe",
      pollId: poll.id,
    },
  });

  await prisma.vote.create({
    data: {
      optionId: optionYes.id,
      userId: user.id,
    },
  });

  await Promise.all(
    new Array(100).fill(null).map(() => {
      const ran = Math.random();
      let optionId = "";
      if (ran < 0.5) {
        optionId = optionYes.id;
      } else if (ran > 0.7) {
        optionId = optionNo.id;
      } else {
        optionId = optionMaybe.id;
      }
      return prisma.vote.create({
        data: {
          optionId,
        },
      });
    })
  );

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
