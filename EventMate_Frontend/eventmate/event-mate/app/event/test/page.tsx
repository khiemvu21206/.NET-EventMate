"use client";
import { useState } from "react";

export default function Home() {
  const [downloadURL, setDownloadURL] = useState("");

  const download = async () => {
    const result = await fetch("https://anhnail.com/wp-content/uploads/2024/11/Hinh-gai-xinh-2009-toc-dai-cute.jpg", {
      method: "GET",
      headers: {},
    });
    const blob = await result.blob();
    const url = URL.createObjectURL(blob);
    setDownloadURL(url);
  };

  const handleDownload = async (e) => {
    try {
      await download();
      URL.revokeObjectURL(downloadURL);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className=" bg-gray-500 bg-opacity-75 transition-opacity flex flex-col justify-center  items-center">
      <img src="/test.jpg" width={500} height={600} className="mb-2 " />
      <button
        onClick={handleDownload}
        type="button"
        className="flex-1 content-center text-center bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <a href={downloadURL} download={"test"}>
          Download Image
        </a>
      </button>
    </div>
  );
}