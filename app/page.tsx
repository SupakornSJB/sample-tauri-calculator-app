"use client"

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col m-auto gap-2">
        <h1 className="text-3xl text-white font-bold">
          Hello And Welcome!
        </h1>
        <h1 className="text-lg text-white mx-auto">
          Click below to use the calculator
        </h1>
        <button className="btn btn-primary" onClick={() => router.push("/calculator")}>
          Go To Calculator
        </button>
      </div>
    </main>
  )
}
