import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserPollsById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      polls: { include: { options: { include: { votes: true } } } },
    },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser({
  email,
  password,
  name,
}: Pick<User, "email" | "name"> & { password: string }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      name,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function updateUser({
  id,
  email,
  password,
  name,
}: Pick<User, "id"> &
  Partial<Pick<User, "email" | "name"> & { password: string }>) {
  const data: any = {};

  if (email) data.email = email;
  if (name) data.name = name;
  if (password)
    data.password = { create: { hash: await bcrypt.hash(password, 10) } };

  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
