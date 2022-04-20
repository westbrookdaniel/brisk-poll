export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col justify-center flex-grow w-full max-w-lg py-8 space-y-16">
      {children}
    </main>
  );
}
