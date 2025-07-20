import React, { useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { GoPaste } from "react-icons/go";
import { MdDone } from "react-icons/md";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "javascript",
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);
  const lang = language;

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="relative p-2 my-6 border rounded-lg bg-primary/5 hover:shadow-lg transition-all hover:scale-105 duration-300">
      <div className="flex items-center justify-between bg-[#212429] border-b border-white/15 rounded-md rounded-b-none text-base p-5 font-medium">
        <div className="flex space-x-1">
          <span className="bg-red-500 rounded-full w-3 h-3"></span>
          <span className="bg-yellow-500 rounded-full w-3 h-3"></span>
          <span className="bg-green-500 rounded-full w-3 h-3"></span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-5 right-5 bg-white/10 text-white rounded-sm border border-white/10 z-10 px-2 py-1.5 leading-none text-sm flex items-center gap-1 cursor-pointer shadow-lg transition-all hover:scale-105 duration-300"
        >
          {copied ? (
            <div className="flex items-center gap-1 text-green-500 font-medium">
              <MdDone />
              <span>Copied !</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-white font-medium">
              <GoPaste />
              <span>Copy</span>
            </div>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-md rounded-t-none">
        <code ref={codeRef} className={`language-${lang}`}>
          <SyntaxHighlighter
            language={lang}
            style={atomOneDark}
            customStyle={{
              padding: "1.5rem",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
