import * as React from "react";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPoll } from "~/models/poll.server";
import {
  Form,
  useActionData,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import ErrorHandler, { CatchHandler } from "~/components/ErrorHandler";
import invariant from "tiny-invariant";
import { FormError, FormRadio } from "~/components/common/form";
import { Button, LinkButton } from "~/components/common/button";
import {
  createVote,
  getSignatureVotes,
  getUserVotes,
} from "~/models/vote.model";
import { getUserId } from "~/session.server";
import PollLink from "~/components/PollLink";
import HiddenSignatureInput from "~/components/HiddenSignatureInput";
import { Modal } from "~/components/common/modal";

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

interface ActionData {
  errors?: {
    option?: string;
    alreadyVoted?: string;
  };
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

  await createVote({ optionId: option, userId, request, signature });

  return redirect(`/polls/${id}/results`);
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

export default function VotingPage() {
  const data = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData | undefined;
  const poll = data.poll!;

  const [shared, setShared] = React.useState(false);

  return (
    <main className="flex flex-col justify-center flex-grow w-full max-w-lg pb-32">
      <Form method="post" className="space-y-16">
        <fieldset className="space-y-8">
          <legend className="text-lg">{poll.title}</legend>
          <div className="space-y-4">
            {poll.options.map((option) => (
              <FormRadio
                key={option.id}
                label={option.title}
                name="option"
                value={option.id}
                error={!!actionData?.errors?.option}
                className="text-4xl font-bold"
              />
            ))}
          </div>
          <FormError name="option" error={actionData?.errors?.option} />
        </fieldset>

        <HiddenSignatureInput />
        {actionData?.errors?.alreadyVoted ? (
          <Modal
            title={actionData?.errors?.alreadyVoted}
            description="Why don't you check out the poll results instead"
            body={<LinkButton to="results">View Poll Results</LinkButton>}
            isOpen
          />
        ) : null}

        <div className="space-y-2">
          <div className="flex w-full space-x-2">
            <Button type="submit" className="flex-grow">
              Confirm Choice
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShared(true);
              }}
            >
              {shared ? "Copied Link" : "Share Poll"}
            </Button>
          </div>
          {shared ? (
            <PollLink
              url={
                typeof window === "undefined"
                  ? "Preparing link to poll"
                  : window.location.href
              }
            />
          ) : null}
        </div>
      </Form>
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
