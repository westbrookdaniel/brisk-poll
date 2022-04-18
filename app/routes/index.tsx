import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { isStrings, useOptionalUser } from "~/utils";
import { createPoll } from "~/models/poll.server";
import { getUserId } from "~/session.server";
import { FormError, FormInput } from "~/utils/form";

type ActionData = {
  errors?: {
    title?: string;
    option?: string;
  };
};

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
  if (!isStrings(options)) {
    return json<ActionData>(
      { errors: { option: "Options are not valid" } },
      { status: 400 }
    );
  }

  const userId = await getUserId(request);

  return createPoll({ title, userId, options });
};

export default function Index() {
  const user = useOptionalUser();
  const actionData = useActionData() as ActionData | undefined;
  const transition = useTransition();

  return (
    <main className="max-w-xl p-8 mx-auto space-y-4">
      <h1 className="text-xl font-bold">Brisk Poll</h1>
      {user ? (
        <div className="flex flex-col space-y-2">
          <p>Hello {user.email}</p>
          <Link to="/logout">Logout</Link>
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link to="/login">Login</Link>
          <Link to="/join">Sign Up</Link>
        </div>
      )}

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
          <fieldset>
            <FormInput
              aria-label="Option 1"
              placeholder="Option 1"
              name="option"
            />
            <FormInput
              aria-label="Option 2"
              placeholder="Option 2"
              name="option"
            />
            <FormError
              className="mt-2"
              name="option"
              error={actionData?.errors?.option}
            />
          </fieldset>
          <p>
            <button type="submit">
              {transition.state === "submitting"
                ? "Creating Poll"
                : "Create Poll"}
            </button>
          </p>
        </fieldset>
      </Form>
    </main>
  );
}
