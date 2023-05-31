export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="h-screen flex items-center justify-center flex-col gap-12">
        <h1 className="animate-pulse text-3xl">You got here too early! 😅</h1>
        <section className="text-center">
          <p>This app is not ready for use yet.</p>
          <p>You can acess uor development deploy to check how it&apos;s going&nbsp;
            <a
              href="https://development.dev-calendar.devluis.tech"
              className="text-indigo-500 hover:underline"
            >
              here.
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}
