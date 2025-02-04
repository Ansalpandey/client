import { useState, useCallback, useMemo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FileTree from "../components/FileTree";
import CodeMirrorEditor from "../components/CodeMirrorEditor";
import TerminalComponent from "../components/Terminal";
import WebView from "../components/Browser";

const Editor = () => {
  const [fileContent, setFileContent] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [filePath, setFilePath] = useState("");

  // Memoize handleFileClick to avoid unnecessary re-renders
  const handleFileClick = useCallback((fileExtension: string, content: string, path: string) => {
    if (filePath !== path) {
      setFileContent(content);
      setLanguage(fileExtension);
      setFilePath(path);
    }
  }, [filePath]);

  // Memoize CodeMirrorEditor to avoid re-initialization
  const memoizedCodeMirrorEditor = useMemo(() => {
    return <CodeMirrorEditor fileContent={fileContent} language={language} filePath={filePath} />;
  }, [fileContent, language, filePath]);

  return (
    <div className="h-screen">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={0} maxSize={100}>
          <FileTree onFileClick={handleFileClick} />
        </Panel>

        <PanelResizeHandle>
          <div className="w-1 h-screen bg-gray-600 hover:bg-gray-400 transition-colors relative group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-gray-800 rounded-lg opacity-30 group-hover:opacity-100 transition-opacity" />
          </div>
        </PanelResizeHandle>

        <Panel defaultSize={40}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={70}>
              {/* Render the memoized CodeMirrorEditor */}
              {memoizedCodeMirrorEditor}
            </Panel>

            <PanelResizeHandle>
              <div className="h-1 w-full bg-gray-600 hover:bg-gray-400 transition-colors relative group">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-0.5 w-8 bg-gray-800 rounded-lg opacity-10 group-hover:opacity-50 transition-opacity" />
              </div>
            </PanelResizeHandle>

            <Panel defaultSize={50} minSize={0} maxSize={100}>
              <div className="w-screen h-screen bg-gray-900 text-white">
                <TerminalComponent />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle>
          <div className="w-1 h-screen bg-gray-600 hover:bg-gray-400 transition-colors relative group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-gray-800 rounded-lg opacity-30 group-hover:opacity-100 transition-opacity" />
          </div>
        </PanelResizeHandle>

        <Panel defaultSize={40}>
          <WebView />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Editor;
