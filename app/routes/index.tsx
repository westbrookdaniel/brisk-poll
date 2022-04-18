import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createPoll } from "~/models/poll.server";
import { getUserId } from "~/session.server";
import { useActionData, useTransition, Form } from "@remix-run/react";
import React from "react";
import { Button } from "~/components/common/button";
import { FormInput, FormError } from "~/components/common/form";

export interface ActionData {
  errors?: {
    title?: string;
    option?: string;
  };
}

function isValidOptions(array: any[]): array is string[] {
  return array.every((item) => typeof item === "string" && item.length > 0);
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const options = formData.getAll("option");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }
  if (options.length < 2) {
    return json<ActionData>(
      { errors: { option: "At least two options are required" } },
      { status: 400 }
    );
  }
  if (!isValidOptions(options)) {
    return json<ActionData>(
      { errors: { option: "At least two valid options are required" } },
      { status: 400 }
    );
  }

  const userId = await getUserId(request);

  const poll = await createPoll({ title, userId, options });

  return redirect(`/polls/${poll.id}`);
};

export default function Index() {
  const actionData = useActionData() as ActionData | undefined;
  const transition = useTransition();

  const [optionCount, setOptionCount] = React.useState(2);

  return (
    <main className="flex flex-col justify-center flex-grow w-full max-w-lg pb-32">
      <Form method="post">
        <fieldset
          className="space-y-4"
          disabled={transition.state === "submitting"}
        >
          <FormInput
            aria-label="Poll title"
            placeholder="What is the title of your poll?"
            name="title"
            error={actionData?.errors?.title}
          />

          <fieldset className="flex flex-col space-y-2">
            {new Array(optionCount).fill(null).map((_, i) => (
              <FormInput
                aria-label={`Option ${i + 1}`}
                placeholder={`Label for option ${i + 1}`}
                name="option"
                // Autofocus on newly added options
                autoFocus={optionCount > 0 ? optionCount === i + 1 : false}
                error={!!actionData?.errors?.option}
                key={i}
              />
            ))}
            <FormError name="option" error={actionData?.errors?.option} />
            <Button
              type="button"
              onClick={() => setOptionCount((o) => o + 1)}
              variant="ghost"
              className="self-end"
            >
              + Add Option
            </Button>
          </fieldset>

          <Button type="submit" className="w-full">
            {transition.state === "submitting"
              ? "Creating Poll"
              : "Create Poll"}
          </Button>
        </fieldset>
      </Form>
    </main>
  );
}
