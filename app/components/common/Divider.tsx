export default function Divider({
  className = "",
  ...props
}: React.HTMLProps<HTMLHRElement>) {
  return (
    <hr className={`h-[1px] w-full bg-gray-900 ${className}`} {...props} />
  );
}
