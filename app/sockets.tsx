import * as React from "react";
import { useSocket } from "~/context";

type ListenEvents = `option ${string}` | "confirmation";
type EmitEvents = "vote";

export function useListen<T>(
  eventName: ListenEvents,
  callback: (data: T) => void
) {
  const socket = useSocket();

  React.useEffect(() => {
    if (!socket) return;
    socket.on(eventName, callback);
    return () => {
      socket.removeListener(eventName);
    };
  }, [callback, eventName, socket]);
}

export function useEmit() {
  const socket = useSocket();

  const emit = React.useCallback(
    <T,>(eventName: EmitEvents, data: T) => {
      if (!socket) return;
      socket.emit(eventName, data);
    },
    [socket]
  );

  return emit;
}
