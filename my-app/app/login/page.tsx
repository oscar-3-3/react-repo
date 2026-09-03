import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "500", "600"],
});

export default function LoginPage() {
  return (
    <div
      className={`${montserrat.className} relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#2148c0]`}
    >
      <Image
        src="/login/bg.svg"
        alt=""
        fill
        priority
        aria-hidden="true"
        className="pointer-events-none object-cover"
      />

      <div className="relative z-10 flex w-full max-w-[300px] flex-col items-center gap-8 px-6">
        <Image
          src="/login/cart.svg"
          alt="App logo"
          width={101}
          height={83}
          priority
        />

        <form className="flex w-full flex-col gap-[15px]">
          <label className="relative block">
            <span className="sr-only">Username</span>
            <Image
              src="/login/user.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              name="username"
              placeholder="USERNAME"
              autoComplete="username"
              className="h-[45px] w-full rounded border border-white bg-transparent pl-10 pr-3 text-sm font-light uppercase tracking-wide text-white outline-none placeholder:text-white/90"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Password</span>
            <Image
              src="/login/lock.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              autoComplete="current-password"
              className="h-[45px] w-full rounded border border-white bg-transparent pl-10 pr-3 text-sm font-light uppercase tracking-wide text-white outline-none placeholder:text-white/90"
            />
          </label>

          <button
            type="submit"
            className="h-[45px] w-full rounded bg-white text-base font-semibold uppercase text-[#2148c0] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.3)] transition-opacity hover:opacity-90"
          >
            Login
          </button>
        </form>

        <a href="#" className="text-base font-medium text-white hover:underline">
          Forgot password?
        </a>
      </div>
    </div>
  );
}
