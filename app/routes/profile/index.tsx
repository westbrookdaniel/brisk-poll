import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import Layout from "~/components/Layout";
import Divider from "~/components/common/Divider";
import { getUserPollsById } from "~/models/user.server";
import PollItem from "~/components/PollItem";

interface LoaderData {
  user: Awaited<ReturnType<typeof getUserPollsById>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const id = await requireUserId(request);
  const user = await getUserPollsById(id);
  if (!user) throw new Response("Failed to get user");
  return json<LoaderData>({ user });
};

export const meta: MetaFunction = () => {
  return { title: `My Polls - Brisk Poll` };
};

export default function ProfilePage() {
  const data = useLoaderData() as LoaderData;
  const user = data.user!;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl">My Polls</h1>
        <Divider />
        <div className="space-y-4">
          {user.polls.map((poll) => (
            <PollItem key={poll.id} poll={poll} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
