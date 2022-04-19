import type { Poll } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Poll } from "@prisma/client";

export function getPoll({ id }: Pick<Poll, "id">) {
  return prisma.poll.findFirst({
    where: { id },
    include: {
      options: {
        include: { votes: true },
      },
    },
  });
}

export function createPoll({
  title,
  userId,
  options,
  requireAccount,
  allowMultipleVotes,
}: Pick<Poll, "title" | "requireAccount" | "allowMultipleVotes"> & {
  options: string[];
  userId?: string;
}) {
  return prisma.poll.create({
    data: {
      title,
      userId,
      options: {
        create: options.map((title) => ({
          title,
        })),
      },
      requireAccount,
      allowMultipleVotes,
    },
  });
}

export function deletePoll({ id }: Pick<Poll, "id">) {
  return prisma.poll.deleteMany({
    where: { id },
  });
}
