import React, { useState } from "react";
import { UploadFigma } from "./components/UploadFigma";
import { ConvertedComponents } from "./components/ConvertedComponents";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? 'bg-[#1e1e1e] text-white' : 'bg-gray-50 text-black'} p-6 max-w-5xl mx-auto font-sans min-h-screen`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 text-center">
          Figma to React Converter
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-sm px-3 py-1 rounded border border-gray-400 bg-white dark:bg-gray-700 dark:text-white"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>
      <UploadFigma />
      <ConvertedComponents darkMode={darkMode} />
    </div>
  );
}
