import type { Vote } from "@prisma/client";

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