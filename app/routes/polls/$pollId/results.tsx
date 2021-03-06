import * as React from "react";
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
import PollLink from "~/components/PollLink";
import { getUserVotes } from "~/models/vote.model";
import { getUserId } from "~/session.server";
import { LinkButton } from "~/components/common/button";
import { useHydrated } from "remix-utils";
import Layout from "~/components/Layout";
import OptionVotes from "~/components/OptionVotes";
import { getTotalVotes } from "~/utils";

interface LoaderData {
  poll: Awaited<ReturnType<typeof getPoll>>;
  userVotes: Awaited<ReturnType<typeof getUserVotes>>;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.pollId;
  invariant(id, "pollId not found");
  const poll = await getPoll({ id });
  if (!poll) throw new Response("Poll Not Found", { status: 404 });

  const userId = await getUserId(request);
  const userVotes = userId ? await getUserVotes({ userId, pollId: id }) : [];

  return json<LoaderData>({ poll, userVotes });
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return { title: "Page not found - Brisk Poll" };
  }
  const { poll } = data as LoaderData;
  return { title: `${poll?.title} - Brisk Poll` };
};

export default function PollResultsPage() {
  const hydrated = useHydrated();
  const data = useLoaderData() as LoaderData;
  const poll = data.poll!;
  const userVotes = data.userVotes;

  const [newVotes, setNewVotes] = React.useState(0);
  const totalVotes = getTotalVotes(poll) + newVotes;

  const pathToVote = `/polls/${poll.id}`;
  const linkToVote = `${hydrated ? window.location.origin : ""}${pathToVote}`;

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="font-normal text-md">{poll.title}</h1>
        <div className="space-y-6">
          {poll.options.map((option) => {
            return (
              <OptionVotes
                key={option.id}
                totalVotes={totalVotes}
                option={option}
                onNewVote={() => setNewVotes((v) => v + 1)}
              />
            );
          })}
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-sm text-right text-gray-500">
          {userVotes?.length > 0 ? (
            <p>
              You voted{" "}
              {userVotes.length === 1
                ? `for "${userVotes[0].option.title}"`
                : `${userVotes.length} times`}
              .
            </p>
          ) : null}
          <p>
            There has been a total of {totalVotes}{" "}
            {totalVotes === 1 ? "vote" : "votes"}.
          </p>
        </div>

        {poll.allowMultipleVotes ? (
          <LinkButton colorScheme="blue" className="w-full" to={pathToVote}>
            Vote Again
          </LinkButton>
        ) : null}

        <PollLink url={linkToVote} />
      </div>
    </Layout>
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
