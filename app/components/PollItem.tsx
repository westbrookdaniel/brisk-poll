import * as React from "react";
import type { Poll, Vote, Option } from "@prisma/client";
import { Link } from "@remix-run/react";
import { shortenString } from "~/utils";

interface Props {
  poll: Poll & { options: (Option & { votes: Vote[] })[] };
}

const PollItem = ({ poll }: Props) => {
  const voteCount = poll.options.reduce((a, o) => a + o.votes.length, 0);
  return (
    <Link
      className="flex items-center px-5 py-4 border rounded-lg space-x-4 hover:bg-gray-100"
      to={`/polls/${poll.id}/results`}
    >
      <div className="flex-1">
        <h3 className="underline">{shortenString(poll.title, 90).shortened}</h3>
        <p className="text-gray-500">
          Created on {new Date(poll.createdAt).toDateString()}
        </p>
      </div>
      <div className="hidden text-right text-gray-500 md:block">
        <p>
          {voteCount} {voteCount === 1 ? "vote" : "votes"}
        </p>
      </div>
    </Link>
  );
};

export default React.memo(PollItem);
