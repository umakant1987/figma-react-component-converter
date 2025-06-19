import React from "react";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatOpenAI({
  temperature: 0.3,
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const prompt = PromptTemplate.fromTemplate(
  `Given a Figma node with name "{name}" and description "{description}", write a reusable React functional component with TailwindCSS.`
);

const chain = RunnableSequence.from([prompt, model]);

function detectNodes(data) {
  const components = [];
  const traverse = (nodes) => {
    nodes.forEach((node) => {
      if (node.name && (node.type === "FRAME" || node.type === "COMPONENT")) {
        components.push({ name: node.name, description: node.description || "" });
      }
      if (node.children) traverse(node.children);
    });
  };
  traverse(data.document?.children || []);
  return components;
}

export async function generateComponents(figmaData) {
  if (!figmaData || !figmaData.document) return { components: null, codeSnippets: [], componentNames: [] };

  const nodes = detectNodes(figmaData);
  const codeSnippets = [];
  const componentNames = [];
  const components = [];

  for (const { name, description } of nodes) {
    const res = await chain.invoke({ name, description });
    const code = res.content?.trim?.() || "";
    componentNames.push(name);
    codeSnippets.push(code);
    components.push(
      <div key={name} className="border p-4 rounded bg-white text-black dark:bg-gray-800 dark:text-white">
        <h4 className="font-bold mb-2">{name}</h4>
        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm overflow-x-auto">{code}</pre>
      </div>
    );
  }

  return { components, codeSnippets, componentNames };
}