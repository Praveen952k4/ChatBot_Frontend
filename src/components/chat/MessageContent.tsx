import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { node, inline, className, children, ...rest } = props as any;
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const codeId = `code-${Math.random()}`;

            if (!inline && match) {
              return (
                <div className="relative group my-4">
                  <div className="flex items-center justify-between bg-[hsl(var(--muted))] px-4 py-2 rounded-t-lg border border-border">
                    <span className="text-xs text-muted-foreground font-mono">
                      {match[1]}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2"
                      onClick={() => copyToClipboard(codeString, codeId)}
                    >
                      {copiedCode === codeId ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          <span className="text-xs">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          <span className="text-xs">Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <SyntaxHighlighter
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                    className="!mt-0 !rounded-t-none"
                    {...rest}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code
                className="bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded text-sm font-mono"
                {...rest}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}