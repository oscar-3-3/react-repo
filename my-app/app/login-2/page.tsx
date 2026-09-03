"use client";

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="1.5" />
      <path d="M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginStaxPage() {
  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-100 p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="relative hidden min-h-[520px] flex-col justify-center overflow-hidden bg-gradient-to-br from-zinc-800 to-black px-12 md:flex">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 size-56 rounded-full border border-white/10" />
          <h1 className="relative text-3xl font-extrabold tracking-tight text-white">
            STAX FOOD
          </h1>
        </div>

        <div className="flex flex-col justify-center gap-6 px-8 py-12 sm:px-14">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Hello!</h2>
            <p className="mt-1 text-zinc-500">Sign Up to Get Started</p>
          </div>

          <form method="post" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex items-center gap-3 rounded-lg bg-zinc-100 px-4 py-3 focus-within:ring-2 focus-within:ring-zinc-900">
              <span className="sr-only">Full Name</span>
              <span aria-hidden="true" className="text-zinc-400">
                <UserIcon />
              </span>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                autoComplete="name"
                required
                className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-500"
              />
            </label>

            <label className="flex items-center gap-3 rounded-lg bg-zinc-100 px-4 py-3 focus-within:ring-2 focus-within:ring-zinc-900">
              <span className="sr-only">Email Address</span>
              <span aria-hidden="true" className="text-zinc-400">
                <MailIcon />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                autoComplete="email"
                required
                className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-500"
              />
            </label>

            <label className="flex items-center gap-3 rounded-lg bg-zinc-100 px-4 py-3 focus-within:ring-2 focus-within:ring-zinc-900">
              <span className="sr-only">Password</span>
              <span aria-hidden="true" className="text-zinc-400">
                <LockIcon />
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-500"
              />
            </label>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
