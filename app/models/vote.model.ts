import type { Option, Vote } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Vote } from "@prisma/client";

export function createVote({
  optionId,
  userId,
}: Pick<Vote, "optionId"> & { userId?: string }) {
  return prisma.vote.create({
    data: {
      optionId,
      userId,
    },
  });
}

export function getUserVote({
  userId,
  pollId,
}: Pick<Option, "pollId"> & { userId?: string }) {
  return prisma.vote.findMany({
    include: {
      option: {
        select: {
          pollId: true,
        },
      },
    },
    where: {
      userId,
      option: {
        pollId,
      },
    },
  });
}
