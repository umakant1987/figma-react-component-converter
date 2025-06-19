import React from "react";
import { useFigmaStore } from "../store/useFigmaStore";
import JSZip from "jszip";
import { generateComponents } from "../utils/generator";

export function ConvertedComponents({ darkMode }) {
  const { figmaData } = useFigmaStore();

  const [components, setComponents] = React.useState([]);
  const [codeSnippets, setCodeSnippets] = React.useState([]);
  const [componentNames, setComponentNames] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const runGeneration = async () => {
      setIsLoading(true);
      const result = await generateComponents(figmaData);
      setComponents(result.components);
      setCodeSnippets(result.codeSnippets);
      setComponentNames(result.componentNames);
      setIsLoading(false);
    };
    if (figmaData) runGeneration();
  }, [figmaData]);

  if (!figmaData) return null;

  const downloadIndividualFiles = () => {
    const zip = new JSZip();
    let indexExports = [];
    codeSnippets.forEach((code, idx) => {
      const name = componentNames[idx] || `Component${idx + 1}`;
      zip.file(`${name}.jsx`, code);
      indexExports.push(`export { default as ${name} } from './${name}';`);
    });
    zip.file("index.js", indexExports.join("\n"));
    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "ReactComponents.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Converted Components</h2>
      {isLoading ? (
        <div className="text-center text-gray-600 dark:text-gray-300 animate-pulse">⏳ Generating components...</div>
      ) : (
        <>
          <div className="space-y-4">{components}</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-white mt-8 mb-2">Generated React Code</h3>
          <div className="bg-[#1e1e1e] text-green-200 p-4 rounded border border-gray-300 text-sm overflow-x-auto font-mono whitespace-pre-wrap">
            {codeSnippets.map((snippet, idx) => (
              <div key={idx} className="relative group">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(snippet);
                  }}
                  className="absolute top-2 right-2 text-xs text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Copy
                </button>
                <pre>{snippet}</pre>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => {
                const blob = new Blob([codeSnippets.join("\n\n")], { type: "text/javascript" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "GeneratedComponents.jsx";
                link.click();
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow"
            >
              Download All Code
            </button>
            <button
              onClick={downloadIndividualFiles}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow"
            >
              Download as Individual Files
            </button>
          </div>
        </>
      )}
    </div>
  );
}
