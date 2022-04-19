import type { Option, Vote } from "@prisma/client";
import { getClientIPAddress } from "remix-utils";

import { prisma } from "~/db.server";

export type { Vote } from "@prisma/client";

export function createVote({
  optionId,
  userId,
  request,
  signature,
}: Pick<Vote, "optionId"> & {
  userId?: string;
  request: Request;
  /** The identifier for the client using browserSignature */
  signature: string | null;
}) {
  const ipAddress = getClientIPAddress(request);
  return prisma.vote.create({
    data: {
      optionId,
      userId,
      ipAddress,
      signature,
    },
  });
}

export function getUserVotes({
  userId,
  pollId,
}: Pick<Option, "pollId"> & { userId?: string }) {
  return prisma.vote.findMany({
    include: {
      option: true,
    },
    where: {
      userId,
      option: {
        pollId,
      },
    },
  });
}

export function getSignatureVotes({
  signature,
  pollId,
}: Pick<Option, "pollId"> & Pick<Vote, "signature">) {
  return prisma.vote.findMany({
    include: {
      option: true,
    },
    where: {
      signature,
      option: {
        pollId,
      },
    },
  });
}
