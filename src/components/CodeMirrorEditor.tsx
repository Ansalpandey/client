import { useEffect, useRef, useState, useMemo } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { markdown } from "@codemirror/lang-markdown";
import { rust } from "@codemirror/lang-rust";
import { php } from "@codemirror/lang-php";
import { sql } from "@codemirror/lang-sql";
import { yaml } from "@codemirror/lang-yaml";
import axios from "axios";
import { debounce } from "lodash";

interface CodeMirrorEditorProps {
  fileContent: string;
  language: string;
  filePath: string;
}

export default function CodeMirrorEditor({
  fileContent,
  language,
  filePath,
}: CodeMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const viewRef = useRef<EditorView | null>(null);
  const contentRef = useRef(fileContent);

  // Specify the language extension type
  type LanguageExtension =
    | ReturnType<typeof javascript>
    | ReturnType<typeof python>
    | ReturnType<typeof java>
    | ReturnType<typeof cpp>
    | ReturnType<typeof html>
    | ReturnType<typeof css>
    | ReturnType<typeof json>
    | ReturnType<typeof xml>
    | ReturnType<typeof markdown>
    | ReturnType<typeof rust>
    | ReturnType<typeof php>
    | ReturnType<typeof sql>
    | ReturnType<typeof yaml>;

  const languageExtension = useMemo<LanguageExtension>(() => {
    const languageMap: Record<string, LanguageExtension> = {
      javascript: javascript(),
      python: python(),
      java: java(),
      cpp: cpp(),
      html: html(),
      css: css(),
      json: json(),
      xml: xml(),
      markdown: markdown(),
      rust: rust(),
      php: php(),
      sql: sql(),
      yaml: yaml(),
    };

    return languageMap[language] || javascript(); // Default to javascript if not found
  }, [language]);

  const customTheme = useMemo(
    () =>
      EditorView.theme({
        "&": {
          backgroundColor: "#1f2430",
          color: "#fff",
          height: "100%",
          overflow: "auto",
        },
        ".cm-content": {
          caretColor: "#fff",
        },
        ".cm-gutters": {
          backgroundColor: "#161d2d",
          color: "#858585",
          borderRight: "none",
        },
        ".cm-lineNumbers .cm-gutterElement": {
          minWidth: "3ch",
          padding: "0",
        },
        ".cm-activeLine": {
          backgroundColor: "rgba(52, 227, 227, 0.2)",
        },
        ".cm-activeLineGutter": {
          backgroundColor: "#161d2d",
        },
        ".cm-selectionBackground": {
          backgroundColor: "#3a3a3a",
        },
        ".cm-cursor": {
          borderLeftColor: "#fff",
          animation: "blink 1s step-end infinite",
        },
      }),
    []
  );

  // Initialize the editor when the component mounts or the language changes
  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: fileContent,
      extensions: [
        basicSetup,
        languageExtension,
        oneDark,
        customTheme,
        EditorView.lineWrapping,
        autocompletion(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            contentRef.current = update.state.doc.toString();
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
      view.destroy();
      viewRef.current = null;
    };
  }, [language, languageExtension, customTheme]);

  // Update editor when the fileContent prop changes
  useEffect(() => {
    if (viewRef.current && fileContent !== contentRef.current) {
      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: fileContent,
        },
      });
      viewRef.current.dispatch(transaction);
      contentRef.current = fileContent;
    }
  }, [fileContent]);

  // Debounced save function
  const saveFile = useMemo(
    () =>
      debounce(async () => {
        setIsSaving(true);
        try {
          await axios.post("http://localhost:8080/api/update", {
            path: filePath,
            content: contentRef.current,
          });
          console.log("File saved successfully");
        } catch (error) {
          console.error("Error saving file:", error);
        } finally {
          setIsSaving(false);
        }
      }, 20000),
    [filePath]
  );

  // Auto-save content when it changes
  useEffect(() => {
    saveFile();
  }, [contentRef.current, saveFile]);

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
        key={`${filePath}-${language}`}
        className="rounded h-screen overflow-auto bg-transparent p-0"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        <style>
          {" "}
          {
            /* Custom scrollbar */
            `
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
        `
          }
        </style>
      </div>
    </div>
  );
}
