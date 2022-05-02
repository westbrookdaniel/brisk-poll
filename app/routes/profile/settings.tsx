import * as React from "react";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { requireUser } from "~/session.server";
import Layout from "~/components/Layout";
import Divider from "~/components/common/Divider";
import { Button } from "~/components/common/button";
import { FormInput } from "~/components/common/form";
import { useBoolean, validateEmail } from "~/utils";
import { getUserByEmail, updateUser } from "~/models/user.server";
import { Modal } from "~/components/common/modal";
import ErrorHandler, { CatchHandler } from "~/components/ErrorHandler";

interface LoaderData {
  user: Awaited<ReturnType<typeof requireUser>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  return json<LoaderData>({ user });
};

interface ActionData {
  success?: boolean;
  errors: {
    email?: string;
    password?: string;
    name?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("newpassword");
  const name = formData.get("name");
  const id = formData.get("userid");

  if (typeof id !== "string") {
    throw new Error("Failed to find user id");
  }
  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }
  if (typeof name !== "string" || name.length === 0) {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }
  if (
    typeof password !== "string" ||
    (password !== "" && password.length < 8)
  ) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await requireUser(request);
  const existingUser = await getUserByEmail(email);

  if (existingUser && user.id !== existingUser.id) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  await updateUser({ id, email, password, name });

  return json<ActionData>({ success: true, errors: {} });
};

export const meta: MetaFunction = () => {
  return { title: `Settings - Brisk Poll` };
};

export default function ProfilePage() {
  const [isOpen, setIsOpen] = useBoolean(false);
  const data = useLoaderData() as LoaderData;
  const user = data.user!;

  const fetcher = useFetcher<ActionData>();

  React.useEffect(() => {
    if (fetcher.type === "done" && fetcher.data.success) {
      setIsOpen.on();
    }
  }, [fetcher.data?.success, fetcher.type, setIsOpen]);

  return (
    <Layout>
      <fetcher.Form method="post" className="space-y-6">
        <h1 className="text-2xl">Update Profile</h1>
        <Divider />

        <FormInput
          label="Your Name"
          type="text"
          name="name"
          defaultValue={user.name}
          error={fetcher.data?.errors?.name}
        />

        <FormInput
          label="Email address"
          type="email"
          autoComplete="email"
          name="email"
          autoFocus
          defaultValue={user.email}
          error={fetcher.data?.errors?.email}
        />

        <FormInput
          label="New Password"
          helper="Leave this field empty to keep your current password"
          type="password"
          autoComplete="new-password"
          name="newpassword"
          error={fetcher.data?.errors?.password}
        />

        <input type="hidden" name="userid" value={user.id} />

        <Button type="submit" className="w-full" colorScheme="blue">
          Save Changes
        </Button>
      </fetcher.Form>

      <Modal
        title="Profile updated"
        description="Enjoy your updated profile"
        body={
          <Button onClick={setIsOpen.off} colorScheme="blue">
            Close
          </Button>
        }
        isOpen={isOpen}
      />
    </Layout>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorHandler
      title="Something went wrong"
      message="We had trouble updating your profile"
      error={error.message}
    />
  );
};

export const CatchBoundary = CatchHandler;
