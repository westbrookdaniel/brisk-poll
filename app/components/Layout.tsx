export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col justify-center flex-grow w-full max-w-lg max-w-6xl p-8 mx-auto space-y-16 ">
      {children}
    </main>
  );
}
