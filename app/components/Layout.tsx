export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col justify-center flex-grow w-full max-w-xl max-w-6xl p-4 mx-auto space-y-16 md:p-8">
      {children}
    </main>
  );
}
