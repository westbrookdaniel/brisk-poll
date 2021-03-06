import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const ipAddress = "192.0.2.1";
  const email = "test@example.com";

  // Cleanup of existing database
  await prisma.user.deleteMany({ where: { email } }).catch(() => {
    // No worries if it doesn't exist yet
  });
  await prisma.vote.deleteMany({ where: { ipAddress } }).catch(() => {
    // No worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("Z42pho7Jetrdv4", 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: "John Smith",
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
      ipAddress,
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
          ipAddress,
        },
      });
    })
  );

  const emptyPoll = await prisma.poll.create({
    data: {
      title: "What is the best Juice?",
    },
  });

  await prisma.option.create({
    data: {
      title: "Orange",
      pollId: emptyPoll.id,
    },
  });

  await prisma.option.create({
    data: {
      title: "Apple",
      pollId: emptyPoll.id,
    },
  });

  console.log(`Database has been seeded. ????`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
