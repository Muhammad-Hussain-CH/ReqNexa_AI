import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full p-8">
        <h1 className="text-3xl font-bold">ReqNexa AI</h1>
        <p className="mt-2 text-gray-600">Intelligent requirement-gathering for software projects.</p>
        <div className="mt-6 flex items-center gap-3">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setCount((c) => c + 1)}
          >
            Clicks: {count}
          </button>
          <span className="text-sm text-gray-500">Tailwind + React + Vite</span>
        </div>
      </div>
    </div>
  );
}

