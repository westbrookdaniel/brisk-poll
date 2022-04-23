interface Props {
  url: string;
}

export default function PollLink({ url }: Props) {
  return (
    <div className="flex overflow-x-auto bg-gray-100 rounded-lg whitespace-nowrap">
      <div className="px-4 py-2">
        <p className="text-sm text-gray-500 select-none">Link to share poll:</p>
        <p>{url}</p>
      </div>
    </div>
  );
}
