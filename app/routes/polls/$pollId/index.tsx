import * as React from "react";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPoll } from "~/models/poll.server";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import ErrorHandler, { CatchHandler } from "~/components/ErrorHandler";
import invariant from "tiny-invariant";
import { FormError, FormRadio } from "~/components/common/form";
import { Button, LinkButton } from "~/components/common/button";
import type { Vote } from "~/models/vote.model";
import {
  createVote,
  getSignatureVotes,
  getUserVotes,
} from "~/models/vote.model";
import { getUserId, requireUserId } from "~/session.server";
import PollLink from "~/components/PollLink";
import HiddenSignatureInput from "~/components/HiddenSignatureInput";
import { Modal } from "~/components/common/modal";
import { useHydrated } from "remix-utils";
import { useEmit } from "~/sockets";
import type { EmittedVote } from "server/onVote";
import Layout from "~/components/Layout";

interface LoaderData {
  poll: Awaited<ReturnType<typeof getPoll>>;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.pollId;
  invariant(id, "pollId not found");

  const poll = await getPoll({ id });
  if (!poll) throw new Response("Poll Not Found", { status: 404 });

  if (poll.requireAccount) {
    await requireUserId(request);
  }

  return json<LoaderData>({ poll });
};

interface ActionData {
  errors?: {
    option?: string;
    alreadyVoted?: string;
  };
  vote?: Vote;
}

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.pollId;
  invariant(id, "pollId not found");
  const formData = await request.formData();
  const option = formData.get("option");
  const signature = formData.get("signature");
  invariant(typeof signature === "string", "Unexpected error occured");

  if (typeof option !== "string") {
    return json<ActionData>(
      { errors: { option: "An answer is required" } },
      { status: 400 }
    );
  }

  const poll = await getPoll({ id });
  invariant(poll, "Poll not found");

  const userId = await getUserId(request);

  if (!poll.allowMultipleVotes) {
    const signatureVotes = signature
      ? await getSignatureVotes({ signature, pollId: id })
      : [];
    const userVotes = userId ? await getUserVotes({ userId, pollId: id }) : [];

    if (signatureVotes.length > 0 || userVotes.length > 0) {
      return json<ActionData>(
        { errors: { alreadyVoted: "You've already voted" } },
        { status: 400 }
      );
    }
  }

  const vote = await createVote({
    optionId: option,
    userId,
    request,
    signature,
  });

  // Let the client know that a vote was created
  // so it can emit to the socket
  return json({ vote }, { status: 201 });
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return { title: "Page not found - Brisk Poll" };
  }
  const { poll } = data as LoaderData;
  return { title: `${poll?.title} - Brisk Poll` };
};

export default function VotingPage() {
  const emit = useEmit();
  const fetcher = useFetcher<ActionData>();
  const hydrated = useHydrated();
  const data = useLoaderData() as LoaderData;
  const poll = data.poll!;
  const navigate = useNavigate();

  const [isShareVisible, setIsShareVisible] = React.useState(false);

  React.useEffect(() => {
    if (fetcher.type !== "done") return;
    const vote = fetcher.data.vote;
    if (!vote) return;
    emit<EmittedVote>("vote", { optionId: vote.optionId });
    navigate("results");
  }, [emit, fetcher.data?.vote, fetcher.type, navigate]);

  return (
    <Layout>
      <fetcher.Form method="post" className="space-y-16">
        <fieldset className="space-y-8">
          <legend>{poll.title}</legend>
          <div className="space-y-4">
            {poll.options.map((option) => (
              <FormRadio
                key={option.id}
                label={option.title}
                name="option"
                value={option.id}
                error={!!fetcher.data?.errors?.option}
                className="text-4xl font-semibold"
              />
            ))}
          </div>
          <FormError name="option" error={fetcher.data?.errors?.option} />
        </fieldset>

        <HiddenSignatureInput />
        {fetcher.data?.errors?.alreadyVoted ? (
          <Modal
            title={fetcher.data?.errors?.alreadyVoted}
            description="Why don't you check out the poll results instead"
            body={
              <LinkButton to="results" colorScheme="blue">
                View Poll Results
              </LinkButton>
            }
            isOpen
          />
        ) : null}

        <div className="space-y-4">
          <Button type="submit" className="w-full" colorScheme="blue">
            Confirm Choice
          </Button>
          <Button
            type="button"
            onClick={() => setIsShareVisible((s) => !s)}
            className="w-full"
            variant="ghost"
          >
            {isShareVisible ? "Hide Link" : "Share Poll"}
          </Button>
          {isShareVisible ? (
            <PollLink
              url={hydrated ? window.location.href : "Preparing link to poll"}
            />
          ) : null}
        </div>
      </fetcher.Form>
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
