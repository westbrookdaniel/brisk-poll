import { Link } from "@remix-run/react";
import CreatePollForm from "~/components/CreatePollForm";
import { useOptionalUser } from "~/utils";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createPoll } from "~/models/poll.server";
import { getUserId } from "~/session.server";
import { LinkButton } from "~/components/common/button";

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
  const user = useOptionalUser();

  return (
    <div className="flex flex-col items-center max-w-6xl min-h-screen p-8 mx-auto m space-y-4">
      <header className="flex items-center justify-between w-full">
        <p className="flex-1">Logo</p>
        <h1 className="text-xl font-bold">Brisk Poll</h1>
        <div className="flex items-center justify-end flex-1 space-x-2">
          {user ? (
            <>
              <p>Hello {user.email}</p>
              <Link to="/logout">Logout</Link>
            </>
          ) : (
            <>
              <LinkButton variant="ghost" to="/login">
                Login
              </LinkButton>
              <LinkButton to="/join">Sign Up</LinkButton>
            </>
          )}
        </div>
      </header>
      <main className="flex flex-col justify-center flex-grow w-full max-w-lg pb-32">
        <CreatePollForm />
      </main>
    </div>
  );
}
