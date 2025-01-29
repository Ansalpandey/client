import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import FileTree from '../components/FileTree';
import CodeMirrorEditor from '../components/CodeMirrorEditor';
import TerminalComponent from '../components/Terminal';

export default function Editor() {
  const [fileContent, setFileContent] = useState('// Start coding...');
  const [language, setLanguage] = useState('javascript');
  const [filePath, setFilePath] = useState(''); // Add state for filePath

  const handleFileClick = (fileExtension: string, content: string, path: string) => {
    setFileContent(content);
    setLanguage(fileExtension);
    setFilePath(path); // Update filePath when a file is clicked
  };

  return (
    <div className="h-screen">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={25} minSize={0} maxSize={100}>
          <FileTree onFileClick={handleFileClick} />
        </Panel>

        {/* Horizontal resize handle with rounded hover indicator */}
        <PanelResizeHandle>
          <div className="w-1 h-screen bg-gray-600 hover:bg-gray-400 transition-colors relative group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-gray-800 rounded-lg opacity-30 group-hover:opacity-100 transition-opacity" />
          </div>
        </PanelResizeHandle>

        <Panel>
          <PanelGroup direction="vertical">
            {/* Adjust defaultSize to ensure the sum is 100% */}
            <Panel defaultSize={70} minSize={0} maxSize={100}>
              <CodeMirrorEditor
                fileContent={fileContent}
                language={language}
                filePath={filePath} // Pass filePath to CodeMirrorEditor
              />
            </Panel>

            {/* Vertical resize handle with rounded hover indicator */}
            <PanelResizeHandle>
              <div className="h-1 w-full bg-gray-600 hover:bg-gray-400 transition-colors relative group">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-0.5 w-8 bg-gray-800 rounded-lg opacity-10 group-hover:opacity-50 transition-opacity" />
              </div>
            </PanelResizeHandle>

            {/* Adjust defaultSize to ensure the sum is 100% */}
            <Panel defaultSize={30} minSize={0} maxSize={100}>
              <div className="h-full text-white">
                <TerminalComponent />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}