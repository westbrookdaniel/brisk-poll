import { ClipboardCheckIcon, ClipboardIcon } from "@heroicons/react/solid";
import { useBoolean } from "~/utils";
import { IconButton } from "./common/button";

interface Props {
  url: string;
}

export default function PollLink({ url }: Props) {
  const [copied, setCopied] = useBoolean(false);

  return (
    <div className="flex items-center w-full space-x-2">
      <div className="flex flex-grow overflow-x-auto bg-gray-100 rounded-lg whitespace-nowrap">
        <div className="px-4 py-2">
          <p className="text-sm text-gray-500 select-none">
            Link to share poll:
          </p>
          <p>{url}</p>
        </div>
      </div>
      <IconButton
        variant="ghost"
        icon={copied ? ClipboardCheckIcon : ClipboardIcon}
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied.on();
        }}
        aria-label="Copy"
        // Ensures that it doesn't submit any forms
        type="button"
      />
    </div>
  );
}
