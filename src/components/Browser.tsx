import React, { useState, useRef } from "react";
import { Input } from "antd";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const WebView = () => {
  const [url, setUrl] = useState("https://replit.dev");
  const [inputUrl, setInputUrl] = useState("https://replit.dev");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleNavigate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUrl(inputUrl);
  };

  const refreshPage = () => {
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <form onSubmit={handleNavigate} className="flex p-2 bg-gray-800 shadow-md">
        <Input
          type="text"
          name="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="flex-1 p-2 bg-gray-700 text-white rounded-md"
        />
        <Button className="ml-2 bg-blue-600 hover:bg-blue-500">
          Go
        </Button>
        <Button onClick={refreshPage} className="ml-2 bg-gray-600 hover:bg-gray-500 flex items-center">
          <ReloadOutlined className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </form>

      {/* Webview Container */}
      <div className="flex-1 overflow-hidden border-t border-gray-700">
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-none"
          title="WebView"
        />
      </div>
    </div>
  );
};

export default WebView;
