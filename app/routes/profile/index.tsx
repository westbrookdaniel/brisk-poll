import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import Layout from "~/components/Layout";
import Divider from "~/components/common/Divider";
import type { Option, Poll, Vote } from "@prisma/client";
import { Link } from "react-router-dom";
import { shortenString } from "~/utils";
import { getUserPollsById } from "~/models/user.server";

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

interface PollItemProps {
  poll: Poll & { options: (Option & { votes: Vote[] })[] };
}

function PollItem({ poll }: PollItemProps) {
  return (
    <Link
      className="flex items-center justify-between px-5 py-4 border rounded-lg hover:bg-gray-100"
      to={`/polls/${poll.id}/results`}
    >
      <div>
        <h3 className="underline">{shortenString(poll.title, 50).shortened}</h3>
        <p className="text-gray-500">
          Created on {new Date(poll.createdAt).toDateString()}
        </p>
      </div>
      <div className="text-right text-gray-500">
        <p>{poll.options.reduce((a, o) => a + o.votes.length, 0)} votes</p>
      </div>
    </Link>
  );
}
