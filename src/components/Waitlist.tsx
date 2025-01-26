import { BackgroundBeams } from "./ui/background-beams";

export default function Waitlist() {
  return (
    <div className="h-[30rem] w-full rounded-md bg-black relative flex flex-col items-center justify-center antialiased">
  <div className="max-w-4xl mx-auto p-4">
    <h1 className="relative z-10 text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-indigo-800 via-orange-500 to-pink-500 text-center font-sans font-bold">
      Join the waitlist
    </h1>
    <p className="text-neutral-500 max-w-lg mx-auto my-2 text-ml/snug text-center relative z-10">
      Welcome to CodeFleet, Code from Anywhere with CodeFleet
      Unleash your productivity with our Cloud IDE. Effortlessly write, test, and deploy projects in a flexible, collaborative environment designed for developers like you.
    </p>
    <div className="relative w-full mt-4 z-10">
      <input
        type="text"
        placeholder="waitlist@codefleet.com"
        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-200 placeholder-neutral-500 px-4 py-3 transition-all duration-300"
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-button-hover text-white px-4 py-2 rounded-3xl hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition duration-300">
        Join
      </button>
    </div>
  </div>
  <BackgroundBeams className="absolute z-0 top-0 left-0 w-full h-full" />
</div>
  );
}
