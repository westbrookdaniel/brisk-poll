import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { validateEmail } from "~/utils";
import { FormCheckbox, FormInput } from "~/components/common/form";
import { Button } from "~/components/common/button";
import { link } from "~/components/common/styles";
import Layout from "~/components/Layout";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");

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

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData() as ActionData | undefined;

  return (
    <Layout>
      <Form method="post" className="space-y-6">
        <h1 className="mb-12 text-2xl">Welcome Back</h1>

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
          autoComplete="current-password"
          name="password"
          error={actionData?.errors?.password}
        />

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <Button type="submit" className="w-full" colorScheme="blue">
          Login
        </Button>

        <div className="flex items-center justify-between">
          <FormCheckbox label="Remember me" name="remember" />

          <span className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link
              className={link}
              to={{ pathname: "/join", search: searchParams.toString() }}
            >
              Sign up
            </Link>
          </span>
        </div>
      </Form>
    </Layout>
  );
}
