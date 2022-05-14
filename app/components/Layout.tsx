export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col justify-center flex-grow w-full max-w-xl mx-auto space-y-16">
      <div className="w-full p-4 min-h-lg md:min-h-xl md:p-8">{children}</div>
    </main>
  );
}
