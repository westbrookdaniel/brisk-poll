var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  entry: () => entry,
  routes: () => routes
});

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toESM(require("react"));

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_react = require("@remix-run/react");
var import_server = require("react-dom/server");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const markup = (0, import_server.renderToString)(/* @__PURE__ */ React.createElement(import_react.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/root.tsx
var root_exports = {};
__export(root_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var React3 = __toESM(require("react"));
var import_node2 = require("@remix-run/node");
var import_react9 = require("@remix-run/react");

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-TIHRWEUD.css";

// app/session.server.ts
var import_node = require("@remix-run/node");
var import_tiny_invariant = __toESM(require("tiny-invariant"));

// app/models/user.server.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// app/db.server.ts
var import_client = require("@prisma/client");
var prisma;
if (false) {
  prisma = new import_client.PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new import_client.PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
async function createUser(email, password) {
  const hashedPassword = await import_bcryptjs.default.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });
}
async function verifyLogin(email, password) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true
    }
  });
  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }
  const isValid = await import_bcryptjs.default.compare(password, userWithPassword.password.hash);
  if (!isValid) {
    return null;
  }
  const _a = userWithPassword, { password: _password } = _a, userWithoutPassword = __objRest(_a, ["password"]);
  return userWithoutPassword;
}

// app/session.server.ts
(0, import_tiny_invariant.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var sessionStorage = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: false
  }
});
var USER_SESSION_KEY = "userId";
async function getSession(request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}
async function getUser(request) {
  const userId = await getUserId(request);
  if (userId === void 0)
    return null;
  const user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw (0, import_node.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return (0, import_node.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  const session = await getSession(request);
  const searchParams = new URL(request.url).searchParams;
  const redirectTo = searchParams.get("redirectTo") || "/";
  return (0, import_node.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// app/components/Header.tsx
var import_react6 = require("@remix-run/react");
var import_remix_utils = require("remix-utils");

// app/utils.ts
var import_react2 = require("@remix-run/react");
var import_react3 = require("react");
var import_uuid = require("uuid");
function useMatchesData(id) {
  const matchingRoutes = (0, import_react2.useMatches)();
  const route = (0, import_react3.useMemo)(() => matchingRoutes.find((route2) => route2.id === id), [matchingRoutes, id]);
  return route == null ? void 0 : route.data;
}
function isUser(user) {
  return user && typeof user === "object" && typeof user.email === "string";
}
function useOptionalUser() {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return void 0;
  }
  return data.user;
}
function validateEmail(email) {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}
function generateId(seed) {
  return seed ? (0, import_uuid.v5)(seed, import_uuid.v5.URL) : (0, import_uuid.v4)();
}

// app/components/common/button.tsx
var import_react4 = require("@remix-run/react");
var import_react5 = require("@remix-run/react");
var React2 = __toESM(require("react"));

// app/components/common/styles.tsx
var transition = `ease-in-out duration-150`;
var noRing = `ring-0 focus:ring-0`;
var withRing = `ring-0 focus:ring-1 focus:outline-none ring-gray-500 focus:ring-gray-500 focus:ring-offset-2`;
var link = `text-gray-900 underline ${withRing} transition-all ${transition}`;

// app/components/common/button.tsx
var sizeStyles = {
  sm: `px-3 py-2 text-sm`,
  md: `px-4 py-2`,
  lg: `px-6 py-3 text-lg`
};
var blockHovered = `hover:bg-gray-700`;
var blockActive = `active:bg-gray-500`;
var blockFocused = `focus-visible:outline-0 ${withRing}`;
var ghostHovered = `hover:bg-gray-100`;
var ghostActive = `active:bg-gray-200`;
var ghostFocused = `focus-visible:outline-0 ${withRing}`;
var common = `block text-center select-none`;
var variantStyles = {
  block: `${common} bg-gray-900 text-white transition-all ${transition} ${blockActive} ${blockHovered} ${blockFocused}`,
  ghost: `${common} bg-transparent transition-all ${transition} ${ghostActive} ${ghostHovered} ${ghostFocused}`
};
var Button = (_a) => {
  var _b = _a, {
    className = "",
    size = "md",
    variant = "block"
  } = _b, props = __objRest(_b, [
    "className",
    "size",
    "variant"
  ]);
  return /* @__PURE__ */ React2.createElement("button", __spreadValues({
    className: `${variantStyles[variant]} ${sizeStyles[size]} ${className}`
  }, props));
};
var LinkButton = (_a) => {
  var _b = _a, {
    className = "",
    size = "md",
    variant = "block"
  } = _b, props = __objRest(_b, [
    "className",
    "size",
    "variant"
  ]);
  return /* @__PURE__ */ React2.createElement(import_react5.Link, __spreadValues({
    className: `${variantStyles[variant]} ${sizeStyles[size]} ${className}`
  }, props));
};
var ActionButton = (_a) => {
  var _b = _a, {
    className = "",
    size = "md",
    variant = "block",
    action: action6
  } = _b, props = __objRest(_b, [
    "className",
    "size",
    "variant",
    "action"
  ]);
  return /* @__PURE__ */ React2.createElement(import_react4.Form, {
    action: action6,
    method: "post"
  }, /* @__PURE__ */ React2.createElement("button", __spreadValues({
    className: `${variantStyles[variant]} ${sizeStyles[size]} ${className}`,
    type: "submit"
  }, props)));
};
var IconButton = (_a) => {
  var _b = _a, {
    className = "",
    variant = "block",
    icon: Icon
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "icon"
  ]);
  return /* @__PURE__ */ React2.createElement("button", __spreadValues({
    className: `${variantStyles[variant]} p-3 ${className}`
  }, props), /* @__PURE__ */ React2.createElement(Icon, {
    className: "w-4 h-4"
  }));
};

// app/components/Header.tsx
function Header() {
  const user = useOptionalUser();
  const hydrated = (0, import_remix_utils.useHydrated)();
  const redirectSearchParams = hydrated ? new URLSearchParams([["redirectTo", window.location.pathname]]) : "";
  return /* @__PURE__ */ React.createElement("header", {
    className: "flex items-center justify-between w-full"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-1"
  }, /* @__PURE__ */ React.createElement(import_react6.Link, {
    to: "/",
    className: withRing
  }, "Logo")), /* @__PURE__ */ React.createElement(import_react6.Link, {
    to: "/",
    className: withRing
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-xl font-bold"
  }, "Brisk Poll")), /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center justify-end flex-1 space-x-2"
  }, user ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", {
    className: "px-2 text-gray-500"
  }, user.email), /* @__PURE__ */ React.createElement(ActionButton, {
    variant: "ghost",
    action: `/logout?${redirectSearchParams}`
  }, "Logout")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(LinkButton, {
    variant: "ghost",
    to: `/login?${redirectSearchParams}`
  }, "Login"), /* @__PURE__ */ React.createElement(LinkButton, {
    to: `/join?${redirectSearchParams}`
  }, "Sign Up"))));
}

// app/components/ErrorHandler.tsx
var import_react7 = require("@remix-run/react");
function ErrorHandler({ title, message, error }) {
  return /* @__PURE__ */ React.createElement("main", {
    className: "flex flex-col justify-center flex-grow w-full max-w-6xl py-16 space-y-4"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-4xl font-bold"
  }, title), /* @__PURE__ */ React.createElement("p", null, message), error ? /* @__PURE__ */ React.createElement("pre", {
    className: "text-red-700"
  }, error) : null);
}
function CatchHandler() {
  const caught = (0, import_react7.useCatch)();
  if (caught.status === 404) {
    return /* @__PURE__ */ React.createElement(ErrorHandler, {
      title: "Page not found",
      message: "We couldn't find what you were looking for."
    });
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/root.tsx
var import_socket = __toESM(require("socket.io-client"));

// app/context.tsx
var import_react8 = require("react");
var context = (0, import_react8.createContext)(void 0);
function useSocket() {
  return (0, import_react8.useContext)(context);
}
function SocketProvider({ socket, children }) {
  return /* @__PURE__ */ React.createElement(context.Provider, {
    value: socket
  }, children);
}

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/root.tsx
var links = () => {
  return [{ rel: "stylesheet", href: tailwind_default }];
};
var meta = () => ({
  charset: "utf-8",
  title: "Brisk Poll",
  viewport: "width=device-width,initial-scale=1"
});
var loader = async ({ request }) => {
  return (0, import_node2.json)({
    user: await getUser(request)
  });
};
function Document({
  children,
  title
}) {
  return /* @__PURE__ */ React3.createElement("html", {
    lang: "en",
    className: "h-full"
  }, /* @__PURE__ */ React3.createElement("head", null, /* @__PURE__ */ React3.createElement(import_react9.Meta, null), title ? /* @__PURE__ */ React3.createElement("title", null, title) : null, /* @__PURE__ */ React3.createElement(import_react9.Links, null)), /* @__PURE__ */ React3.createElement("body", {
    className: "flex flex-col items-center max-w-6xl min-h-screen p-8 mx-auto m space-y-4"
  }, children, /* @__PURE__ */ React3.createElement(import_react9.ScrollRestoration, null), /* @__PURE__ */ React3.createElement(import_react9.Scripts, null), /* @__PURE__ */ React3.createElement(import_react9.LiveReload, null)));
}
function App() {
  const [socket, setSocket] = React3.useState();
  React3.useEffect(() => {
    const socket2 = (0, import_socket.default)();
    setSocket(socket2);
    return () => {
      socket2.close();
    };
  }, []);
  React3.useEffect(() => {
    if (!socket)
      return;
    socket.on("confirmation", () => console.debug("connected!"));
  }, [socket]);
  return /* @__PURE__ */ React3.createElement(Document, null, /* @__PURE__ */ React3.createElement(Header, null), /* @__PURE__ */ React3.createElement(SocketProvider, {
    socket
  }, /* @__PURE__ */ React3.createElement(import_react9.Outlet, null)));
}
function ErrorBoundary({ error }) {
  return /* @__PURE__ */ React3.createElement(Document, {
    title: "Something went wrong"
  }, /* @__PURE__ */ React3.createElement(ErrorHandler, {
    title: "App Error",
    message: "Looks like something went very wrong.",
    error: error.message
  }));
}

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/polls/$pollId/results.tsx
var results_exports = {};
__export(results_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary2,
  default: () => PollResultsPage,
  loader: () => loader2,
  meta: () => meta2
});
var React5 = __toESM(require("react"));
var import_node3 = require("@remix-run/node");

// app/models/poll.server.ts
function getPoll({ id }) {
  return prisma.poll.findFirst({
    where: { id },
    include: {
      options: {
        include: { votes: true }
      }
    }
  });
}
function createPoll({
  title,
  userId,
  options,
  requireAccount,
  allowMultipleVotes
}) {
  return prisma.poll.create({
    data: {
      title,
      userId,
      options: {
        create: options.map((title2) => ({
          title: title2
        }))
      },
      requireAccount,
      allowMultipleVotes
    }
  });
}

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/polls/$pollId/results.tsx
var import_react10 = require("@remix-run/react");
var import_tiny_invariant2 = __toESM(require("tiny-invariant"));

// app/components/PollLink.tsx
function PollLink({ url }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "px-4 py-2 bg-gray-100"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "text-sm text-gray-500 select-none"
  }, "Link to share poll:"), /* @__PURE__ */ React.createElement("p", null, url));
}

// app/models/vote.model.ts
var import_remix_utils2 = require("remix-utils");
function createVote({
  optionId,
  userId,
  request,
  signature
}) {
  const ipAddress = (0, import_remix_utils2.getClientIPAddress)(request);
  return prisma.vote.create({
    data: {
      optionId,
      userId,
      ipAddress,
      signature
    }
  });
}
function getUserVotes({
  userId,
  pollId
}) {
  return prisma.vote.findMany({
    include: {
      option: true
    },
    where: {
      userId,
      option: {
        pollId
      }
    }
  });
}
function getSignatureVotes({
  signature,
  pollId
}) {
  return prisma.vote.findMany({
    include: {
      option: true
    },
    where: {
      signature,
      option: {
        pollId
      }
    }
  });
}

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/polls/$pollId/results.tsx
var import_remix_utils3 = require("remix-utils");

// app/sockets.tsx
var React4 = __toESM(require("react"));
function useListen(eventName, callback) {
  const socket = useSocket();
  React4.useEffect(() => {
    if (!socket)
      return;
    socket.on(eventName, callback);
    return () => {
      socket.removeListener(eventName);
    };
  }, [callback, eventName, socket]);
}
function useEmit() {
  const socket = useSocket();
  const emit = React4.useCallback((eventName, data) => {
    if (!socket)
      return;
    socket.emit(eventName, data);
  }, [socket]);
  return emit;
}

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/polls/$pollId/results.tsx
var loader2 = async ({ params, request }) => {
  const id = params.pollId;
  (0, import_tiny_invariant2.default)(id, "pollId not found");
  const poll = await getPoll({ id });
  if (!poll)
    throw new Response("Poll Not Found", { status: 404 });
  const userId = await getUserId(request);
  const userVotes = userId ? await getUserVotes({ userId, pollId: id }) : [];
  return (0, import_node3.json)({ poll, userVotes });
};
var meta2 = ({ data }) => {
  if (!data) {
    return { title: "Poll not found" };
  }
  const { poll } = data;
  return { title: poll == null ? void 0 : poll.title };
};
function PollResultsPage() {
  const hydrated = (0, import_remix_utils3.useHydrated)();
  const data = (0, import_react10.useLoaderData)();
  const poll = data.poll;
  const userVotes = data.userVotes;
  const [newVotes, setNewVotes] = React5.useState(0);
  const totalVotes = poll.options.reduce((total, option) => {
    total += option.votes.length;
    return total;
  }, 0) + newVotes;
  const pathToVote = `/polls/${poll.id}`;
  const linkToVote = `${hydrated ? window.location.origin : ""}${pathToVote}`;
  return /* @__PURE__ */ React5.createElement("main", {
    className: "flex flex-col justify-center flex-grow w-full max-w-lg pb-32 space-y-8"
  }, /* @__PURE__ */ React5.createElement("h1", {
    className: "text-lg"
  }, poll.title), /* @__PURE__ */ React5.createElement("div", {
    className: "space-y-6"
  }, poll.options.map((option) => {
    return /* @__PURE__ */ React5.createElement(OptionVotes, {
      key: option.id,
      totalVotes,
      option,
      onNewVote: () => setNewVotes((v) => v + 1)
    });
  })), /* @__PURE__ */ React5.createElement("div", {
    className: "text-sm text-right text-gray-500"
  }, (userVotes == null ? void 0 : userVotes.length) > 0 ? /* @__PURE__ */ React5.createElement("p", null, "You voted", " ", userVotes.length === 1 ? `for "${userVotes[0].option.title}"` : `${userVotes.length} times`, ".") : null, /* @__PURE__ */ React5.createElement("p", null, "There has been a total of ", totalVotes, " ", totalVotes === 1 ? "vote" : "votes", ".")), poll.allowMultipleVotes ? /* @__PURE__ */ React5.createElement(LinkButton, {
    className: "w-full",
    to: pathToVote
  }, "Vote Again") : null, /* @__PURE__ */ React5.createElement(PollLink, {
    url: linkToVote
  }));
}
function OptionVotes({ option, totalVotes, onNewVote }) {
  const [newVotes, setNewVotes] = React5.useState(0);
  const votes = option.votes.length + newVotes;
  useListen(`option ${option.id}`, (event) => {
    if (event === "vote") {
      setNewVotes((v) => v + 1);
      onNewVote && onNewVote();
    }
  });
  return /* @__PURE__ */ React5.createElement("div", {
    key: option.id,
    className: "space-y-1"
  }, /* @__PURE__ */ React5.createElement("p", {
    className: "text-4xl font-bold"
  }, option.title), votes === 0 ? /* @__PURE__ */ React5.createElement("div", {
    className: "h-4"
  }, /* @__PURE__ */ React5.createElement("span", null, "No votes")) : /* @__PURE__ */ React5.createElement("div", {
    className: "flex items-center space-x-2"
  }, /* @__PURE__ */ React5.createElement("div", {
    style: { width: `${votes / totalVotes * 100}%` },
    className: "h-4 bg-gray-400"
  }), /* @__PURE__ */ React5.createElement("span", null, votes)));
}
var ErrorBoundary2 = ({ error }) => {
  const { pollId } = (0, import_react10.useParams)();
  return /* @__PURE__ */ React5.createElement(ErrorHandler, {
    title: "Something went wrong",
    message: `We had trouble loading the poll by the id ${pollId}.`,
    error: error.message
  });
};
var CatchBoundary = CatchHandler;

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/polls/$pollId/index.tsx
var pollId_exports = {};
__export(pollId_exports, {
  CatchBoundary: () => CatchBoundary2,
  ErrorBoundary: () => ErrorBoundary3,
  action: () => action,
  default: () => VotingPage,
  loader: () => loader3,
  meta: () => meta3
});
var React9 = __toESM(require("react"));
var import_node4 = require("@remix-run/node");
var import_react12 = require("@remix-run/react");
var import_tiny_invariant3 = __toESM(require("tiny-invariant"));

// app/components/common/form.tsx
var React7 = __toESM(require("react"));

// app/components/common/input.tsx
var React6 = __toESM(require("react"));
var manualBlockInvalid = `focus:border-red-700 border-red-700`;
var blockInvalid = `focus:invalid:border-red-700 invalid:border-red-700`;
var blockFocused2 = `focus:border-gray-500 focus:bg-white focus:outline-none focus:outline-0`;
var block = `block bg-gray-100 transition-color ${transition} ${blockInvalid} ${blockFocused2}`;
var Input = (_a) => {
  var _b = _a, {
    className = "",
    "aria-invalid": invalid
  } = _b, props = __objRest(_b, [
    "className",
    "aria-invalid"
  ]);
  return /* @__PURE__ */ React6.createElement("input", __spreadValues({
    className: `${block} ${noRing} ${invalid ? manualBlockInvalid : "border-transparent"} form-input ${className}`,
    "aria-invalid": invalid
  }, props));
};
var Checkbox = (_a) => {
  var _b = _a, {
    className = "",
    "aria-invalid": invalid
  } = _b, props = __objRest(_b, [
    "className",
    "aria-invalid"
  ]);
  return /* @__PURE__ */ React6.createElement("input", __spreadProps(__spreadValues({
    className: `${block} ${withRing} ${invalid ? manualBlockInvalid : "border-transparent"} form-checkbox text-gray-900 accent-gray-900 ${className}`,
    "aria-invalid": invalid
  }, props), {
    type: "checkbox"
  }));
};
var Radio = (_a) => {
  var _b = _a, {
    className = "",
    "aria-invalid": invalid
  } = _b, props = __objRest(_b, [
    "className",
    "aria-invalid"
  ]);
  return /* @__PURE__ */ React6.createElement("input", __spreadProps(__spreadValues({
    className: `${block} ${withRing} ${invalid ? manualBlockInvalid : "border-transparent"} form-radio text-gray-900 accent-gray-900 ${className}`
  }, props), {
    type: "radio"
  }));
};

// app/components/common/form.tsx
var FormLabel = ({
  label,
  name,
  className = ""
}) => {
  return label ? /* @__PURE__ */ React7.createElement("label", {
    htmlFor: name,
    className: `text-gray-900 ${className}`
  }, label) : null;
};
var FormHelper = ({
  helper,
  className = ""
}) => {
  return helper ? /* @__PURE__ */ React7.createElement("p", {
    className: `text-sm text-gray-700 ${className}`
  }, helper) : null;
};
var FormError = ({
  error,
  name,
  className = ""
}) => {
  return typeof error === "string" ? /* @__PURE__ */ React7.createElement("p", {
    id: `${name}-error`,
    className: `text-sm text-red-700 ${className}`
  }, error) : null;
};
var FormElements = ({
  children,
  helper,
  error,
  label,
  name,
  containerProps
}) => {
  return /* @__PURE__ */ React7.createElement("div", __spreadValues({}, containerProps), label || helper ? /* @__PURE__ */ React7.createElement("div", {
    className: "mb-2"
  }, /* @__PURE__ */ React7.createElement(FormLabel, {
    label,
    name
  }), /* @__PURE__ */ React7.createElement(FormHelper, {
    helper
  })) : null, children, /* @__PURE__ */ React7.createElement(FormError, {
    className: "mt-2",
    error,
    name
  }));
};
var FormInput = (_a) => {
  var _b = _a, { label, helper, error, containerProps, name } = _b, props = __objRest(_b, ["label", "helper", "error", "containerProps", "name"]);
  return /* @__PURE__ */ React7.createElement(FormElements, {
    containerProps,
    helper,
    error,
    label,
    name
  }, /* @__PURE__ */ React7.createElement("p", null, /* @__PURE__ */ React7.createElement(Input, __spreadValues({
    id: name,
    name,
    "aria-invalid": error ? true : void 0,
    "aria-describedby": `${name}-error`,
    className: "w-full"
  }, props))));
};
var FormCheckbox = (_a) => {
  var _b = _a, { label, helper, error, name, className } = _b, props = __objRest(_b, ["label", "helper", "error", "name", "className"]);
  return /* @__PURE__ */ React7.createElement("div", {
    className: "space-x-2"
  }, /* @__PURE__ */ React7.createElement("div", {
    className: "flex items-center space-x-2"
  }, /* @__PURE__ */ React7.createElement(Checkbox, __spreadValues({
    id: name,
    name,
    "aria-invalid": error ? true : void 0,
    "aria-describedby": `${name}-error`
  }, props)), label || helper ? /* @__PURE__ */ React7.createElement(FormLabel, {
    className: `${className ? className : "text-sm"} select-none`,
    label,
    name
  }) : null), /* @__PURE__ */ React7.createElement(FormError, {
    className: "mt-2",
    error,
    name
  }));
};
var FormRadio = (_a) => {
  var _b = _a, { label, helper, error, name, value: v, className } = _b, props = __objRest(_b, ["label", "helper", "error", "name", "value", "className"]);
  const value = v;
  return /* @__PURE__ */ React7.createElement("div", {
    className: "space-x-2"
  }, /* @__PURE__ */ React7.createElement("div", {
    className: "flex items-center space-x-2"
  }, /* @__PURE__ */ React7.createElement(Radio, __spreadValues({
    id: value,
    name,
    "aria-invalid": error ? true : void 0,
    "aria-describedby": `${name}-error`,
    value
  }, props)), label || helper ? /* @__PURE__ */ React7.createElement(FormLabel, {
    className: `${className ? className : "text-sm"} select-none`,
    label,
    name: value
  }) : null), /* @__PURE__ */ React7.createElement(FormError, {
    className: "mt-2",
    error,
    name: value
  }));
};

// app/components/HiddenSignatureInput.tsx
var import_remix_utils4 = require("remix-utils");
function pad(str, size) {
  return (new Array(size + 1).join("0") + str).slice(-size);
}
function browserSignature() {
  const windowObj = window || global;
  function windowObjCount() {
    const keys = [];
    for (let i in windowObj) {
      keys.push(i);
    }
    return keys.length.toString(36);
  }
  const navi = navigator.userAgent.length.toString(36);
  const padString = pad(navi + windowObjCount(), 4);
  const width = windowObj.screen.width.toString(36);
  const height = windowObj.screen.height.toString(36);
  const availWidth = windowObj.screen.availWidth.toString(36);
  const availHeight = windowObj.screen.availHeight.toString(36);
  const colorDepth = windowObj.screen.colorDepth.toString(36);
  const pixelDepth = windowObj.screen.pixelDepth.toString(36);
  return atob(padString + width + height + availWidth + availHeight + colorDepth + pixelDepth);
}
function HiddenSignatureInput() {
  return /* @__PURE__ */ React.createElement(import_remix_utils4.ClientOnly, null, () => /* @__PURE__ */ React.createElement("input", {
    type: "hidden",
    name: "signature",
    value: browserSignature()
  }));
}

// app/components/common/modal.tsx
var React8 = __toESM(require("react"));
var import_react11 = require("@headlessui/react");
function Modal({
  title,
  description,
  children,
  body,
  isOpen: externalIsOpen
}) {
  const [isOpen, setIsOpen] = React8.useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, typeof children === "function" ? children(openModal, closeModal) : children, /* @__PURE__ */ React8.createElement(import_react11.Transition, {
    appear: true,
    show: externalIsOpen || isOpen,
    as: React8.Fragment
  }, /* @__PURE__ */ React8.createElement(import_react11.Dialog, {
    as: "div",
    className: "fixed inset-0 z-10 overflow-y-auto",
    onClose: closeModal
  }, /* @__PURE__ */ React8.createElement("div", {
    className: "flex items-center justify-center min-h-screen px-4 "
  }, /* @__PURE__ */ React8.createElement(import_react11.Transition.Child, {
    as: React8.Fragment,
    enter: "ease-out duration-300",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0"
  }, /* @__PURE__ */ React8.createElement(import_react11.Dialog.Overlay, {
    className: "fixed inset-0 bg-gray-900/75"
  })), /* @__PURE__ */ React8.createElement(import_react11.Transition.Child, {
    as: React8.Fragment,
    enter: "ease-out duration-300",
    enterFrom: "opacity-0 scale-95",
    enterTo: "opacity-100 scale-100",
    leave: "ease-in duration-200",
    leaveFrom: "opacity-100 scale-100",
    leaveTo: "opacity-0 scale-95"
  }, /* @__PURE__ */ React8.createElement("div", {
    className: "flex flex-col items-start w-full max-w-md p-6 my-8 overflow-hidden text-left bg-white shadow-xl transform space-y-4 transition-all"
  }, /* @__PURE__ */ React8.createElement("div", {
    className: "space-y-1"
  }, /* @__PURE__ */ React8.createElement(import_react11.Dialog.Title, {
    as: "h3",
    className: "text-xl font-bold text-gray-900 leading-6"
  }, title), /* @__PURE__ */ React8.createElement(import_react11.Dialog.Description, {
    className: "text-gray-500 text-md leading-6"
  }, description)), body))))));
}

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/polls/$pollId/index.tsx
var import_remix_utils5 = require("remix-utils");
var loader3 = async ({ params, request }) => {
  const id = params.pollId;
  (0, import_tiny_invariant3.default)(id, "pollId not found");
  const poll = await getPoll({ id });
  if (!poll)
    throw new Response("Poll Not Found", { status: 404 });
  if (poll.requireAccount) {
    await requireUserId(request);
  }
  return (0, import_node4.json)({ poll });
};
var action = async ({ request, params }) => {
  const id = params.pollId;
  (0, import_tiny_invariant3.default)(id, "pollId not found");
  const formData = await request.formData();
  const option = formData.get("option");
  const signature = formData.get("signature");
  (0, import_tiny_invariant3.default)(typeof signature === "string", "Unexpected error occured");
  if (typeof option !== "string") {
    return (0, import_node4.json)({ errors: { option: "An answer is required" } }, { status: 400 });
  }
  const poll = await getPoll({ id });
  (0, import_tiny_invariant3.default)(poll, "Poll not found");
  const userId = await getUserId(request);
  if (!poll.allowMultipleVotes) {
    const signatureVotes = signature ? await getSignatureVotes({ signature, pollId: id }) : [];
    const userVotes = userId ? await getUserVotes({ userId, pollId: id }) : [];
    if (signatureVotes.length > 0 || userVotes.length > 0) {
      return (0, import_node4.json)({ errors: { alreadyVoted: "You've already voted" } }, { status: 400 });
    }
  }
  const vote = await createVote({
    optionId: option,
    userId,
    request,
    signature
  });
  return (0, import_node4.json)({ vote }, { status: 201 });
};
var meta3 = ({ data }) => {
  if (!data) {
    return { title: "Poll not found" };
  }
  const { poll } = data;
  return { title: poll == null ? void 0 : poll.title };
};
function VotingPage() {
  var _a, _b, _c, _d, _e, _f, _g;
  const emit = useEmit();
  const fetcher = (0, import_react12.useFetcher)();
  const hydrated = (0, import_remix_utils5.useHydrated)();
  const data = (0, import_react12.useLoaderData)();
  const poll = data.poll;
  const navigate = (0, import_react12.useNavigate)();
  const [shared, setShared] = React9.useState(false);
  React9.useEffect(() => {
    if (fetcher.type !== "done")
      return;
    const vote = fetcher.data.vote;
    if (!vote)
      return;
    emit("vote", { optionId: vote.optionId });
    navigate("results");
  }, [emit, (_a = fetcher.data) == null ? void 0 : _a.vote, fetcher.type, navigate]);
  return /* @__PURE__ */ React9.createElement("main", {
    className: "flex flex-col justify-center flex-grow w-full max-w-lg pb-32"
  }, /* @__PURE__ */ React9.createElement(fetcher.Form, {
    method: "post",
    className: "space-y-16"
  }, /* @__PURE__ */ React9.createElement("fieldset", {
    className: "space-y-8"
  }, /* @__PURE__ */ React9.createElement("legend", {
    className: "text-lg"
  }, poll.title), /* @__PURE__ */ React9.createElement("div", {
    className: "space-y-4"
  }, poll.options.map((option) => {
    var _a2, _b2;
    return /* @__PURE__ */ React9.createElement(FormRadio, {
      key: option.id,
      label: option.title,
      name: "option",
      value: option.id,
      error: !!((_b2 = (_a2 = fetcher.data) == null ? void 0 : _a2.errors) == null ? void 0 : _b2.option),
      className: "text-4xl font-bold"
    });
  })), /* @__PURE__ */ React9.createElement(FormError, {
    name: "option",
    error: (_c = (_b = fetcher.data) == null ? void 0 : _b.errors) == null ? void 0 : _c.option
  })), /* @__PURE__ */ React9.createElement(HiddenSignatureInput, null), ((_e = (_d = fetcher.data) == null ? void 0 : _d.errors) == null ? void 0 : _e.alreadyVoted) ? /* @__PURE__ */ React9.createElement(Modal, {
    title: (_g = (_f = fetcher.data) == null ? void 0 : _f.errors) == null ? void 0 : _g.alreadyVoted,
    description: "Why don't you check out the poll results instead",
    body: /* @__PURE__ */ React9.createElement(LinkButton, {
      to: "results"
    }, "View Poll Results"),
    isOpen: true
  }) : null, /* @__PURE__ */ React9.createElement("div", {
    className: "space-y-2"
  }, /* @__PURE__ */ React9.createElement("div", {
    className: "flex w-full space-x-2"
  }, /* @__PURE__ */ React9.createElement(Button, {
    type: "submit",
    className: "flex-grow"
  }, "Confirm Choice"), /* @__PURE__ */ React9.createElement(Button, {
    variant: "ghost",
    type: "button",
    onClick: () => {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
    }
  }, shared ? "Copied Link" : "Share Poll")), shared ? /* @__PURE__ */ React9.createElement(PollLink, {
    url: hydrated ? window.location.href : "Preparing link to poll"
  }) : null)));
}
var ErrorBoundary3 = ({ error }) => {
  const { pollId } = (0, import_react12.useParams)();
  return /* @__PURE__ */ React9.createElement(ErrorHandler, {
    title: "Something went wrong",
    message: `We had trouble loading the poll by the id ${pollId}.`,
    error: error.message
  });
};
var CatchBoundary2 = CatchHandler;

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader4
});
var loader4 = async ({ request }) => {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    const url = new URL("/", `http://${host}`);
    await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]);
    return new Response("OK");
  } catch (error) {
    console.log("healthcheck \u274C", { error });
    return new Response("ERROR", { status: 500 });
  }
};

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action2,
  loader: () => loader5
});
var import_node5 = require("@remix-run/node");
var action2 = async ({ request }) => {
  return logout(request);
};
var loader5 = async ({ request }) => {
  return (0, import_node5.redirect)("/");
};

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  action: () => action3,
  default: () => Index
});
var import_node6 = require("@remix-run/node");
var import_node7 = require("@remix-run/node");
var import_react13 = require("@remix-run/react");
var import_react14 = __toESM(require("react"));
var import_solid = require("@heroicons/react/solid");
function isValidOptions(array) {
  return array.every((item) => typeof item === "string" && item.length > 0);
}
var action3 = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const options = formData.getAll("option");
  const requireAccount = formData.get("requireAccount");
  const allowMultipleVotes = formData.get("allowMultipleVotes");
  if (typeof title !== "string" || title.length === 0) {
    return (0, import_node7.json)({ errors: { title: "Title is required" } }, { status: 400 });
  }
  if (options.length < 2) {
    return (0, import_node7.json)({ errors: { option: "At least two options are required" } }, { status: 400 });
  }
  if (!isValidOptions(options)) {
    return (0, import_node7.json)({ errors: { option: "At least two valid options are required" } }, { status: 400 });
  }
  const userId = await getUserId(request);
  const poll = await createPoll({
    title,
    userId,
    options,
    requireAccount: requireAccount === "on" ? true : false,
    allowMultipleVotes: allowMultipleVotes === "on" ? true : false
  });
  return (0, import_node6.redirect)(`/polls/${poll.id}`);
};
var initOptions = [generateId("foo"), generateId("bar")];
function Index() {
  var _a, _b;
  const actionData = (0, import_react13.useActionData)();
  const transition2 = (0, import_react13.useTransition)();
  const [options, setOptions] = import_react14.default.useState(initOptions);
  return /* @__PURE__ */ import_react14.default.createElement("main", {
    className: "flex flex-col justify-center flex-grow w-full max-w-lg pb-32"
  }, /* @__PURE__ */ import_react14.default.createElement(import_react13.Form, {
    method: "post"
  }, /* @__PURE__ */ import_react14.default.createElement("fieldset", {
    className: "space-y-6",
    disabled: transition2.state === "submitting"
  }, /* @__PURE__ */ import_react14.default.createElement(FormInput, {
    "aria-label": "Poll title",
    placeholder: "What is the title of your poll?",
    name: "title",
    error: (_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.title
  }), /* @__PURE__ */ import_react14.default.createElement("fieldset", {
    className: "flex flex-col pb-4 space-y-2"
  }, options.map((id, i) => {
    var _a2;
    return /* @__PURE__ */ import_react14.default.createElement("div", {
      key: id,
      className: "flex items-center space-x-2"
    }, /* @__PURE__ */ import_react14.default.createElement(FormInput, {
      containerProps: { className: "flex-grow" },
      "aria-label": `Option ${id}`,
      placeholder: `Label for option ${i + 1}`,
      name: "option",
      autoFocus: options.length > 0 ? options.length === i + 1 : false,
      error: !!((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.option)
    }), /* @__PURE__ */ import_react14.default.createElement(IconButton, {
      type: "button",
      variant: "ghost",
      icon: import_solid.TrashIcon,
      className: "text-gray-500",
      onClick: () => setOptions((opts) => opts.filter((o) => o !== id))
    }));
  }), /* @__PURE__ */ import_react14.default.createElement(FormError, {
    name: "option",
    error: (_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.option
  }), /* @__PURE__ */ import_react14.default.createElement(Button, {
    type: "button",
    onClick: () => setOptions((opts) => [...opts, generateId()]),
    variant: "ghost",
    className: "self-start"
  }, "+ Add Option")), /* @__PURE__ */ import_react14.default.createElement(Button, {
    type: "submit",
    className: "w-full"
  }, transition2.state === "submitting" ? "Creating Poll" : "Create Poll"), /* @__PURE__ */ import_react14.default.createElement("div", {
    className: "space-y-2"
  }, /* @__PURE__ */ import_react14.default.createElement(FormCheckbox, {
    name: "requireAccount",
    label: "Require account to vote"
  }), /* @__PURE__ */ import_react14.default.createElement(FormCheckbox, {
    name: "allowMultipleVotes",
    label: "Allow multiple votes"
  })))));
}

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action4,
  default: () => LoginPage,
  loader: () => loader6,
  meta: () => meta4
});
var import_node8 = require("@remix-run/node");
var import_react15 = require("@remix-run/react");
var loader6 = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId)
    return (0, import_node8.redirect)("/");
  return (0, import_node8.json)({});
};
var action4 = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");
  if (!validateEmail(email)) {
    return (0, import_node8.json)({ errors: { email: "Email is invalid" } }, { status: 400 });
  }
  if (typeof password !== "string") {
    return (0, import_node8.json)({ errors: { password: "Password is required" } }, { status: 400 });
  }
  if (password.length < 8) {
    return (0, import_node8.json)({ errors: { password: "Password is too short" } }, { status: 400 });
  }
  const user = await verifyLogin(email, password);
  if (!user) {
    return (0, import_node8.json)({ errors: { email: "Invalid email or password" } }, { status: 400 });
  }
  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/"
  });
};
var meta4 = () => {
  return {
    title: "Login"
  };
};
function LoginPage() {
  var _a, _b;
  const [searchParams] = (0, import_react15.useSearchParams)();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = (0, import_react15.useActionData)();
  return /* @__PURE__ */ React.createElement("main", {
    className: "flex flex-col justify-center flex-grow w-full max-w-md pb-32 space-y-16"
  }, /* @__PURE__ */ React.createElement(import_react15.Form, {
    method: "post",
    className: "space-y-6"
  }, /* @__PURE__ */ React.createElement(FormInput, {
    label: "Email address",
    type: "email",
    autoComplete: "email",
    name: "email",
    autoFocus: true,
    error: (_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email
  }), /* @__PURE__ */ React.createElement(FormInput, {
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    name: "password",
    error: (_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.password
  }), /* @__PURE__ */ React.createElement("input", {
    type: "hidden",
    name: "redirectTo",
    value: redirectTo
  }), /* @__PURE__ */ React.createElement(Button, {
    type: "submit",
    className: "w-full"
  }, "Login"), /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center justify-between"
  }, /* @__PURE__ */ React.createElement(FormCheckbox, {
    label: "Remember me",
    name: "remember"
  }), /* @__PURE__ */ React.createElement("span", {
    className: "text-sm text-center text-gray-500"
  }, "Don't have an account?", " ", /* @__PURE__ */ React.createElement(import_react15.Link, {
    className: link,
    to: { pathname: "/join", search: searchParams.toString() }
  }, "Sign up")))));
}

// route:/Users/DanielWestbrook/Sites/brisk-poll/app/routes/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action5,
  default: () => Join,
  loader: () => loader7,
  meta: () => meta5
});
var import_node9 = require("@remix-run/node");
var import_react16 = require("@remix-run/react");
var React11 = __toESM(require("react"));
var loader7 = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId)
    return (0, import_node9.redirect)("/");
  return (0, import_node9.json)({});
};
var action5 = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  if (!validateEmail(email)) {
    return (0, import_node9.json)({ errors: { email: "Email is invalid" } }, { status: 400 });
  }
  if (typeof password !== "string") {
    return (0, import_node9.json)({ errors: { password: "Password is required" } }, { status: 400 });
  }
  if (password.length < 8) {
    return (0, import_node9.json)({ errors: { password: "Password is too short" } }, { status: 400 });
  }
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return (0, import_node9.json)({ errors: { email: "A user already exists with this email" } }, { status: 400 });
  }
  const user = await createUser(email, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/"
  });
};
var meta5 = () => {
  return {
    title: "Sign Up"
  };
};
function Join() {
  var _a, _b;
  const [searchParams] = (0, import_react16.useSearchParams)();
  const redirectTo = searchParams.get("redirectTo") ?? void 0;
  const actionData = (0, import_react16.useActionData)();
  const emailRef = React11.useRef(null);
  const passwordRef = React11.useRef(null);
  React11.useEffect(() => {
    var _a2, _b2, _c, _d;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.email) {
      (_b2 = emailRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.password) {
      (_d = passwordRef.current) == null ? void 0 : _d.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React11.createElement("main", {
    className: "flex flex-col justify-center flex-grow w-full max-w-md pb-32"
  }, /* @__PURE__ */ React11.createElement(import_react16.Form, {
    method: "post",
    className: "space-y-6"
  }, /* @__PURE__ */ React11.createElement(FormInput, {
    label: "Email address",
    type: "email",
    autoComplete: "email",
    name: "email",
    autoFocus: true,
    error: (_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email
  }), /* @__PURE__ */ React11.createElement(FormInput, {
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    name: "password",
    error: (_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.password
  }), /* @__PURE__ */ React11.createElement("input", {
    type: "hidden",
    name: "redirectTo",
    value: redirectTo
  }), /* @__PURE__ */ React11.createElement(Button, {
    type: "submit",
    className: "w-full"
  }, "Create Account"), /* @__PURE__ */ React11.createElement("div", {
    className: "flex items-center justify-center"
  }, /* @__PURE__ */ React11.createElement("div", {
    className: "text-sm text-center text-gray-500"
  }, "Already have an account?", " ", /* @__PURE__ */ React11.createElement(import_react16.Link, {
    className: link,
    to: { pathname: "/login", search: searchParams.toString() }
  }, "Login")))));
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { "version": "b29c7960", "entry": { "module": "/build/entry.client-KSTEYACA.js", "imports": ["/build/_shared/chunk-FKVNPCUN.js", "/build/_shared/chunk-54RWOSBF.js", "/build/_shared/chunk-FN7GJDOI.js"] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "module": "/build/root-QQ6JTEBF.js", "imports": ["/build/_shared/chunk-N6PRYNC7.js", "/build/_shared/chunk-4LTELVPZ.js", "/build/_shared/chunk-XS736JBB.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": true }, "routes/healthcheck": { "id": "routes/healthcheck", "parentId": "root", "path": "healthcheck", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/healthcheck-ISYLMUCQ.js", "imports": void 0, "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/index": { "id": "routes/index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "module": "/build/routes/index-4QX5H26R.js", "imports": ["/build/_shared/chunk-KE566MEM.js", "/build/_shared/chunk-6J3XNV5P.js", "/build/_shared/chunk-WGBR62OH.js"], "hasAction": true, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/join": { "id": "routes/join", "parentId": "root", "path": "join", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/join-4C5ZSIGB.js", "imports": ["/build/_shared/chunk-UO7E4SR4.js", "/build/_shared/chunk-6J3XNV5P.js", "/build/_shared/chunk-WGBR62OH.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/login-ITV5FO3P.js", "imports": ["/build/_shared/chunk-UO7E4SR4.js", "/build/_shared/chunk-6J3XNV5P.js", "/build/_shared/chunk-WGBR62OH.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/logout": { "id": "routes/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/logout-BIDIRFBP.js", "imports": void 0, "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/polls/$pollId/index": { "id": "routes/polls/$pollId/index", "parentId": "root", "path": "polls/:pollId", "index": true, "caseSensitive": void 0, "module": "/build/routes/polls/$pollId/index-44Q267U5.js", "imports": ["/build/_shared/chunk-32QG7ZND.js", "/build/_shared/chunk-KE566MEM.js", "/build/_shared/chunk-6J3XNV5P.js", "/build/_shared/chunk-WGBR62OH.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": true, "hasErrorBoundary": true }, "routes/polls/$pollId/results": { "id": "routes/polls/$pollId/results", "parentId": "root", "path": "polls/:pollId/results", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/polls/$pollId/results-NYUAPM5X.js", "imports": ["/build/_shared/chunk-32QG7ZND.js", "/build/_shared/chunk-KE566MEM.js", "/build/_shared/chunk-WGBR62OH.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": true, "hasErrorBoundary": true } }, "url": "/build/manifest-B29C7960.js" };

// server-entry-module:@remix-run/dev/server-build
var entry = { module: entry_server_exports };
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/polls/$pollId/results": {
    id: "routes/polls/$pollId/results",
    parentId: "root",
    path: "polls/:pollId/results",
    index: void 0,
    caseSensitive: void 0,
    module: results_exports
  },
  "routes/polls/$pollId/index": {
    id: "routes/polls/$pollId/index",
    parentId: "root",
    path: "polls/:pollId",
    index: true,
    caseSensitive: void 0,
    module: pollId_exports
  },
  "routes/healthcheck": {
    id: "routes/healthcheck",
    parentId: "root",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/join": {
    id: "routes/join",
    parentId: "root",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  }
};
module.exports = __toCommonJS(stdin_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  entry,
  routes
});
//# sourceMappingURL=index.js.map
