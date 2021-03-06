import * as React from "react";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import fontsStylesheetUrl from "./styles/fonts.css";
import { getUser } from "./session.server";
import Header from "./components/Header";
import ErrorHandler, { CatchHandler } from "./components/ErrorHandler";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { SocketProvider } from "./context";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: fontsStylesheetUrl },
    { rel: "icon", href: "/favicon.ico", type: "image/png" },
    { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    { rel: "manifest", href: "/manifest.json" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Brisk Poll - Do Polls Quickly",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        {title ? <title>{title}</title> : null}
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Brisk Poll helps you create polls quickly. Ask a question, share the link, and get your responses in real time. Free forever."
        />
        <Links />
      </head>
      <body className="flex flex-col items-center min-h-screenish space-y-4">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const [socket, setSocket] = React.useState<Socket>();

  React.useEffect(() => {
    const socket = io();
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  // We can't use useListen here because we aren't inside the SocketProvider
  React.useEffect(() => {
    if (!socket) return;
    socket.on("confirmation", () => console.debug("connected!"));
  }, [socket]);

  return (
    <Document>
      <Header />
      <SocketProvider socket={socket}>
        <Outlet />
      </SocketProvider>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Something went wrong - Brisk Poll">
      <ErrorHandler
        title="App Error"
        message="Looks like something went very wrong."
        error={error.message}
      />
    </Document>
  );
}

export function CatchBoundary() {
  return (
    <Document title="Something went wrong - Brisk Poll">
      <Header />
      <CatchHandler />
    </Document>
  );
}
