import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPoll } from "~/models/poll.server";
import { useLoaderData, useParams } from "@remix-run/react";
import ErrorHandler, { CatchHandler } from "~/components/ErrorHandler";
import invariant from "tiny-invariant";

interface LoaderData {
  poll: Awaited<ReturnType<typeof getPoll>>;
}

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.pollId;
  invariant(id, "pollId not found");
  const poll = await getPoll({ id });
  if (!poll) throw new Response("Poll Not Found", { status: 404 });
  return json<LoaderData>({ poll });
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return {
      title: "Poll not found",
    };
  }
  const { poll } = data as LoaderData;
  return {
    title: poll?.title,
  };
};

export default function PollResultsPage() {
  const data = useLoaderData() as LoaderData;
  const poll = data.poll!;

  const totalVotes = poll.options.reduce((total, option) => {
    total += option.votes.length;
    return total;
  }, 0);

  return (
    <main className="flex flex-col justify-center flex-grow w-full max-w-lg pb-32 space-y-8">
      <h1 className="text-lg">{poll.title}</h1>
      <div className="space-y-6">
        {poll.options.map((option) => {
          const votes = option.votes.length;
          return (
            <div key={option.id} className="space-y-1">
              <p className="text-4xl font-bold">{option.title}</p>
              <div className="flex items-center space-x-2">
                <div
                  style={{ width: `${(votes / totalVotes) * 100}%` }}
                  className="h-4 bg-gray-400"
                />
                <span>{votes}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="self-end text-sm text-gray-500">
        Total of {totalVotes} votes were made
      </p>
    </main>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  const { pollId } = useParams();
  return (
    <ErrorHandler
      title="Something went wrong"
      message={`We had trouble loading the poll by the id ${pollId}.`}
      error={error.message}
    />
  );
};

export const CatchBoundary = CatchHandler;
