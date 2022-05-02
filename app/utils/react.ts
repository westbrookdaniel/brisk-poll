import * as React from "react";

interface HandleSetBoolean {
  on: () => void;
  off: () => void;
  toggle: () => void;
  set: React.Dispatch<React.SetStateAction<boolean>>;
}

type UseBooleanReturn = [boolean, HandleSetBoolean];

export function useBoolean(initialValue: boolean): UseBooleanReturn {
  const [bool, setBool] = React.useState(initialValue);

  const on = React.useCallback(() => setBool(true), []);
  const off = React.useCallback(() => setBool(false), []);
  const toggle = React.useCallback(() => setBool((b) => !b), []);

  const handleSetBool = React.useMemo(
    () => ({ on, off, toggle, set: setBool }),
    [off, on, toggle]
  );

  return [bool, handleSetBool];
}
