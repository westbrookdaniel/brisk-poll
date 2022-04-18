interface Props {
  url: string;
}

export default function PollLink({ url }: Props) {
  return (
    <div className="px-4 py-2 bg-gray-100">
      <p className="text-sm text-gray-500 select-none">Link to share poll:</p>
      <p>{url}</p>
    </div>
  );
}
