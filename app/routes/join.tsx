import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { validateEmail } from "~/utils";
import { FormInput } from "~/components/common/form";
import { Button } from "~/components/common/button";
import { link } from "~/components/common/styles";
import Layout from "~/components/Layout";
import Divider from "~/components/common/Divider";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }
  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up | Brisk Poll",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Layout>
      <Form method="post" className="space-y-6">
        <h1 className="text-2xl">Sign Up</h1>
        <Divider />

        <FormInput
          label="Email address"
          type="email"
          autoComplete="email"
          name="email"
          autoFocus
          error={actionData?.errors?.email}
        />

        <FormInput
          label="Password"
          type="password"
          autoComplete="new-password"
          name="password"
          error={actionData?.errors?.password}
        />

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <Button type="submit" className="w-full" colorScheme="blue">
          Create Account
        </Button>

        <div className="flex items-center justify-center">
          <div className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link
              className={link}
              to={{ pathname: "/login", search: searchParams.toString() }}
            >
              Login
            </Link>
          </div>
        </div>
      </Form>
    </Layout>
  );
}
