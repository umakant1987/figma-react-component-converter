import React, { useState } from "react";
import { useFigmaStore } from "../store/useFigmaStore";

export function UploadFigma() {
  const [file, setFile] = useState(null);
  const { setFigmaData } = useFigmaStore();

  const handleUpload = async (e) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        const json = JSON.parse(fileReader.result);
        setFigmaData(json);
      } catch (err) {
        alert("Invalid Figma JSON");
      }
    };
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      fileReader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium">Upload Figma JSON File</label>
      <input
        type="file"
        accept="application/JSON"
        onChange={handleUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
}
