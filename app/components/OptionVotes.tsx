import * as React from "react";
import type { Vote, Option } from "@prisma/client";
import { useListen } from "~/sockets";

interface Props {
  option: Option & { votes: Vote[] };
  totalVotes: number;
  onNewVote?: () => void;
}

export default function OptionVotes({ option, totalVotes, onNewVote }: Props) {
  const [newVotes, setNewVotes] = React.useState(0);
  const votes = option.votes.length + newVotes;

  useListen(`option ${option.id}`, (event) => {
    if (event === "vote") {
      setNewVotes((v) => v + 1);
      onNewVote && onNewVote();
    }
  });

  return (
    <div key={option.id} className="space-y-1">
      <p className="text-4xl font-semibold text-blue-600">{option.title}</p>
      {votes === 0 ? (
        <div className="h-4">
          <span>No votes</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div
            style={{ width: `${(votes / totalVotes) * 100}%` }}
            className="h-4 bg-blue-200 rounded-full"
          />
          <span className="text-blue-600" data-testid={option.title}>
            {votes}
          </span>
        </div>
      )}
    </div>
  );
}
