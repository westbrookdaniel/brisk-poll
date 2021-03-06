import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createPoll } from "~/models/poll.server";
import { getUserId } from "~/session.server";
import { useActionData, useTransition, Form } from "@remix-run/react";
import React from "react";
import { Button, IconButton } from "~/components/common/button";
import {
  FormInput,
  FormError,
  FormCheckbox,
  FormTextArea,
} from "~/components/common/form";
import { generateId } from "~/utils";
import { TrashIcon } from "@heroicons/react/solid";
import Layout from "~/components/Layout";

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
  const requireAccount = formData.get("requireAccount");
  const allowMultipleVotes = formData.get("allowMultipleVotes");

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

  const poll = await createPoll({
    title: title.trim(),
    userId,
    options: options.map((option) => option.trim()),
    requireAccount: requireAccount === "on" ? true : false,
    allowMultipleVotes: allowMultipleVotes === "on" ? true : false,
  });

  return redirect(`/polls/${poll.id}`);
};

// We need to provide a seed so this can be hydrated properly
const initOptions = [generateId("foo"), generateId("bar")];

export default function Index() {
  const actionData = useActionData() as ActionData | undefined;
  const transition = useTransition();

  const [options, setOptions] = React.useState<string[]>(initOptions);

  return (
    <Layout>
      <Form method="post">
        <fieldset
          className="space-y-6"
          disabled={transition.state === "submitting"}
        >
          <FormTextArea
            aria-label="Poll title"
            placeholder="What is the title of your poll?"
            name="title"
            error={actionData?.errors?.title}
            autoExpand
            // Autofocus here first
            autoFocus
          />

          <fieldset className="flex flex-col pb-4 space-y-2">
            {options.map((id, i) => (
              <div key={id} className="flex items-center space-x-2">
                <FormTextArea
                  containerProps={{ className: "flex-grow" }}
                  aria-label={`Option ${id}`}
                  placeholder={`Label for option ${i + 1}`}
                  name="option"
                  id={`option-${id}`}
                  autoExpand
                  // and then autofocus on newly added options
                  autoFocus={
                    options.length > 0 ? options.length === i + 1 : false
                  }
                  error={!!actionData?.errors?.option}
                />
                <IconButton
                  type="button"
                  variant="ghost"
                  icon={TrashIcon}
                  aria-label="Remove"
                  onClick={() =>
                    setOptions((opts) => opts.filter((o) => o !== id))
                  }
                />
              </div>
            ))}
            <FormError name="option" error={actionData?.errors?.option} />
            <Button
              type="button"
              onClick={() => setOptions((opts) => [...opts, generateId()])}
              variant="ghost"
              className="self-start"
            >
              + Add Option
            </Button>
          </fieldset>

          <Button type="submit" className="w-full" colorScheme="blue">
            {transition.state === "submitting"
              ? "Creating Poll"
              : "Create Poll"}
          </Button>

          <div className="space-y-4 lg:space-y-2">
            <FormCheckbox
              name="requireAccount"
              label="Require account to vote"
            />
            <FormCheckbox
              name="allowMultipleVotes"
              label="Allow multiple votes"
            />
          </div>
        </fieldset>
      </Form>
    </Layout>
  );
}
