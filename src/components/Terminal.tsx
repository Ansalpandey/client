import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export default function TerminalComponent() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize the terminal
    terminal.current = new Terminal({
      cursorBlink: true,
      cursorStyle: "bar",
      scrollback: 10, // Enable scrollback to allow for scrollbars
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
    });

    fitAddon.current = new FitAddon();
    terminal.current.loadAddon(fitAddon.current);
    terminal.current.open(terminalRef.current);

    // Fit the terminal after DOM renders
    fitAddon.current.fit();

    // Set up the ResizeObserver for responsiveness
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.current?.fit();
    });
    resizeObserver.observe(terminalRef.current);

    // Initialize WebSocket after terminal is ready
    const initializeWebSocket = () => {
      const wsUrl =
        "ws://localhost:8080/ws/docker-terminal?containerId=c212de42f06bd071f0f8d132d8dcb255bc1230493739481c168784ed6088ec74";
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      wsRef.current.onmessage = (event) => {
        console.log("Message received from server:", event.data);
        terminal.current?.write(event.data);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      // Send terminal input to WebSocket
      terminal.current?.onData((data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          console.log("Sending data to server:", data);
          wsRef.current.send(data);
        } else {
          console.log("WebSocket is not open");
        }
      });
    };

    // Call WebSocket initialization after terminal is ready
    initializeWebSocket();

    // Listen for the 'clear' command and reset terminal
    terminal.current?.onData((data) => {
      if (data === "\x0C") { // '\x0C' is the ASCII value for clear command
        terminal.current?.clear(); // Clear the terminal content
        terminal.current?.reset(); // Reset terminal and clear scrollback buffer
      }
    });

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      terminal.current?.dispose();
      wsRef.current?.close();
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        scrollBehavior: "smooth",
        padding: "2px",
        height: "100%",
        backgroundColor: "#1e1e1e",
      }}
    >
      <style>{`
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 4px; /* Minimum width */
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
  );
}
