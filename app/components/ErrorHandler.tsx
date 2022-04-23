import { useCatch } from "@remix-run/react";

interface Props {
  title: string;
  message: string;
  error?: string;
}

export default function ErrorHandler({ title, message, error }: Props) {
  return (
    <main className="flex flex-col flex-grow w-full max-w-6xl p-4 py-16 md:p-8 space-y-2">
      <h1 className="mb-2 text-2xl">{title}</h1>
      <p>{message}</p>
      {error ? (
        <pre className="overflow-x-auto text-red-700">{error}</pre>
      ) : null}
    </main>
  );
}

export function CatchHandler() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <ErrorHandler
        title="Page not found"
        message="We couldn't find what you were looking for."
      />
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
