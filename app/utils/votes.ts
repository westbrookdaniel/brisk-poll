import type { Option, Poll, Vote } from "@prisma/client";

export function getTotalVotes(
  poll: Poll & { options: (Option & { votes: Vote[] })[] }
) {
  return poll.options.reduce((a, o) => a + o.votes.length, 0);
}
