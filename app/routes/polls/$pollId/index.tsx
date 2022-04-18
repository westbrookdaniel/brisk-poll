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
import { Button } from "~/components/common/button";
import { createVote } from "~/models/vote.model";
import { getUserId } from "~/session.server";

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
  };
}

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.pollId;
  invariant(id, "pollId not found");
  const formData = await request.formData();
  const option = formData.get("option");

  if (typeof option !== "string") {
    return json<ActionData>(
      { errors: { option: "An answer is required" } },
      { status: 400 }
    );
  }

  const userId = await getUserId(request);

  await createVote({ optionId: option, userId });

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

export default function PollPage() {
  const data = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData | undefined;
  const poll = data.poll!;
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
        <Button type="submit" className="w-full">
          Confirm Choice
        </Button>
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