import React from "react";

interface TextContentProps {
  content: string;
}

export const TextContent: React.FC<TextContentProps> = ({ content }) => {
  return (
    <div className="p-4 font-mono text-sm whitespace-pre-wrap">{content}</div>
  );
};
