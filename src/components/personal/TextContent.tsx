import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown.css";

interface TextContentProps {
  /** Path to a markdown file under public/, e.g. "/files/README.md" */
  path: string;
}

export const TextContent: React.FC<TextContentProps> = ({ path }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch(path)
      .then((response) => response.text())
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch((error) => {
        console.error(`Error loading file: ${path}`, error);
        if (!cancelled) setContent("Error loading content");
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return (
    <div className="markdown-body p-4 font-macos text-lg">
      <ReactMarkdown
        components={{
          a: (props) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
