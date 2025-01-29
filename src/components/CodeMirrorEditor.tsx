import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { markdown } from '@codemirror/lang-markdown';
import { rust } from '@codemirror/lang-rust';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';
import {yaml} from '@codemirror/lang-yaml';
import axios from 'axios';

interface CodeMirrorEditorProps {
  fileContent: string;
  language: string;
  filePath: string;
}

export default function CodeMirrorEditor({ fileContent, language, filePath }: CodeMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(fileContent);
  const [isSaving, setIsSaving] = useState(false);
  const viewRef = useRef<EditorView | null>(null);
  const contentRef = useRef(fileContent);

  useEffect(() => {
    if (!editorRef.current) return;

    console.log('Initializing EditorView'); // Debugging

    const customTheme = EditorView.theme({
      '&': {
        backgroundColor: '#1f2430',
        color: '#fff',
        height: '100%',
        overflow: 'auto', // Use 'auto' instead of 'scroll'
      },
      '.cm-content': {
        caretColor: '#fff',
      },
      '.cm-gutters': {
        backgroundColor: '#161d2d',
        color: '#858585',
        borderRight: 'none',
      },
      '.cm-lineNumbers .cm-gutterElement': {
        minWidth: '3ch',
        padding: '0',
      },
      '.cm-activeLine': {
        backgroundColor: 'rgba(52, 227, 227, 0.2)',
      },
      '.cm-activeLineGutter': {
        backgroundColor: '#161d2d',
      },
      '.cm-selectionBackground': {
        backgroundColor: '#3a3a3a',
      },
      '.cm-cursor': {
        borderLeftColor: '#fff',
        animation: 'blink 1s step-end infinite',
      },
    });

    const getLanguageExtension = () => {
      switch (language) {
        case 'javascript': return javascript();
        case 'python': return python();
        case 'java': return java();
        case 'cpp': return cpp();
        case 'html': return html();
        case 'css': return css();
        case 'json': return json();
        case 'xml': return xml();
        case 'markdown': return markdown();
        case 'rust': return rust();
        case 'php': return php();
        case 'sql': return sql();
        case 'yaml': return yaml();
        default: return javascript();
      }
    };

    const state = EditorState.create({
      doc: fileContent,
      extensions: [
        basicSetup,
        getLanguageExtension(),
        oneDark,
        customTheme,
        EditorView.lineWrapping,
        autocompletion(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setContent(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      console.log('Destroying EditorView'); // Debugging
      view.destroy();
      viewRef.current = null;
    };
  }, [language]);

  useEffect(() => {
    if (viewRef.current && fileContent !== content) {
      console.log('Updating EditorView with new content'); // Debugging
      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: fileContent,
        },
      });
      viewRef.current.dispatch(transaction);
      setContent(fileContent);
    }
  }, [fileContent]);

  const saveFile = async () => {
    setIsSaving(true);
    try {
      await axios.post('http://localhost:8080/api/update', {
        path: filePath,
        content,
      });
      console.log('File saved successfully');
    } catch (error) {
      console.error('Error saving file:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (content !== contentRef.current) {
        saveFile();
        contentRef.current = content;
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [content]);

  return (
    <div className="h-full flex flex-col">
        <div className="flex items-center">
          {isSaving && (
            <span className="ml-2 text-blue-400 animate-pulse">
              <i className="fas fa-cloud-upload-alt"></i> Saving...
            </span>
          )}
        </div>

      <div
        ref={editorRef}
        key={`${filePath}-${language}`} // Force re-render
        className="rounded h-screen overflow-auto bg-transparent p-0"
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        <style>{`
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 4px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.6);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 255, 255, 0.8);
          }
          ::-webkit-scrollbar-track {
            background-color: rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </div>
    </div>
  );
}