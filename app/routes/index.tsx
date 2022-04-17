import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { isStrings, useOptionalUser } from "~/utils";
import { createPoll } from "~/models/poll.server";
import { getUserId } from "~/session.server";

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

  if (typeof title !== "string") {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (options.length < 2) {
    return json<ActionData>(
      { errors: { title: "At least two options are required" } },
      { status: 400 }
    );
  }

  if (!isStrings(options)) {
    return json<ActionData>(
      { errors: { title: "Options are not valid" } },
      { status: 400 }
    );
  }

  const userId = await getUserId(request);

  return createPoll({ title, userId, options });
};

export default function Index() {
  const user = useOptionalUser();
  const actionData = useActionData() as ActionData;
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
        <fieldset disabled={transition.state === "submitting"}>
          <p>
            <input
              aria-label="Poll title"
              placeholder="What is your poll about?"
              name="title"
              type="text"
            />
          </p>
          {actionData?.errors?.title ? (
            <p className="text-red-700">{actionData.errors.title}</p>
          ) : null}

          <p>
            <input aria-label="Option 1" placeholder="Option 1" name="option" />
          </p>
          <p>
            <input aria-label="Option 2" placeholder="Option 2" name="option" />
          </p>
          {actionData?.errors?.option?.[2] ? (
            <p className="text-red-700">{actionData.errors.option}</p>
          ) : null}

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
