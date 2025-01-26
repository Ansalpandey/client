import React, { useEffect } from "react";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";

export default function TerminalComponent() {
  const terminalRef = React.useRef<HTMLDivElement | null>(null); // Ref for the terminal container
  const terminalInstance = React.useRef<Terminal | null>(null); // Ref to hold the Terminal instance

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize Terminal and FitAddon
    const terminal = new Terminal({
      rows: 10, // Number of rows in the terminal
      theme: {
        background: "#1e1e1e", // Terminal background color
        foreground: "#ffffff", // Terminal text color
      },
      scrollback: 1000, // Set the scrollback buffer size
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current); // Attach the terminal to the container
    fitAddon.fit(); // Fit the terminal size to the container

    terminalInstance.current = terminal; // Save the terminal instance

    // Initialize terminal content
    terminal.writeln("Welcome to react-xtermjs!");
    terminal.writeln("Start typing your commands...");
    terminal.write("> "); // Add an initial prompt

    let currentInput = ""; // To track the user's input

    // Handle user input
    const inputDisposable = terminal.onData((data) => {
      const char = data; // The key pressed by the user

      if (char === "\u007F") {
        // Handle backspace
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1); // Remove the last character
          terminal.write("\b \b"); // Erase the character visually
        }
      } else if (char === "\r") {
        // Handle Enter key
        terminal.writeln(""); // Move to the next line
        terminal.writeln(`You entered: ${currentInput}`); // Echo the input
        terminal.write("> "); // Add a new prompt
        currentInput = ""; // Reset input buffer
        terminal.scrollToBottom(); // Ensure the terminal scrolls to the bottom after each input
      } else {
        // Handle other characters
        currentInput += char; // Append character to the input buffer
        terminal.write(char); // Display the character
      }
    });

    // Handle window resize
    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      inputDisposable.dispose(); // Remove the input listener
      terminal.dispose(); // Dispose of the terminal instance
    };
  }, []);

  return (
    <div
      ref={terminalRef} // Div that will hold the terminal
      className="w-full bg-gray-800 rounded-t-lg text-white"
      style={{
        height: "300px", // Set a fixed height to prevent overflow
        overflow: "auto", // Allow scrolling inside the terminal when content overflows
      }}
    ></div>
  );
}
