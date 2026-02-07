"use client";

import { Highlight, themes } from "prism-react-renderer";
import { cn } from "@/lib/utils";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  showCopyButton?: boolean;
}

// Auto-detect language based on code content
function detectLanguage(code: string): string {
  const trimmed = code.trim();

  // Shell/Bash patterns
  if (
    trimmed.startsWith("$") ||
    trimmed.startsWith("sudo ") ||
    trimmed.startsWith("npm ") ||
    trimmed.startsWith("yarn ") ||
    trimmed.startsWith("pnpm ") ||
    trimmed.startsWith("git ") ||
    trimmed.startsWith("docker ") ||
    trimmed.startsWith("kubectl ") ||
    trimmed.startsWith("cd ") ||
    trimmed.startsWith("ls ") ||
    trimmed.startsWith("cat ") ||
    trimmed.startsWith("echo ") ||
    trimmed.startsWith("export ") ||
    trimmed.startsWith("#!/")
  ) {
    return "bash";
  }

  // SQL patterns
  if (
    /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|GRANT|REVOKE)\s/i.test(trimmed)
  ) {
    return "sql";
  }

  // JavaScript/TypeScript patterns
  if (
    trimmed.includes("const ") ||
    trimmed.includes("let ") ||
    trimmed.includes("function ") ||
    trimmed.includes("=>") ||
    trimmed.includes("import ") ||
    trimmed.includes("export ")
  ) {
    if (
      trimmed.includes(": string") ||
      trimmed.includes(": number") ||
      trimmed.includes(": boolean") ||
      trimmed.includes("interface ") ||
      trimmed.includes("type ") ||
      /<[A-Z]/.test(trimmed)
    ) {
      return "typescript";
    }
    return "javascript";
  }

  // Python patterns
  if (
    trimmed.startsWith("def ") ||
    trimmed.startsWith("class ") ||
    trimmed.startsWith("import ") ||
    trimmed.startsWith("from ") ||
    trimmed.includes("print(") ||
    /^\s*#.*$/.test(trimmed.split("\n")[0])
  ) {
    return "python";
  }

  // JSON patterns
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      // Not valid JSON
    }
  }

  // YAML patterns
  if (
    trimmed.includes(": ") &&
    !trimmed.includes(";") &&
    /^\w+:/.test(trimmed)
  ) {
    return "yaml";
  }

  // CSS patterns
  if (
    trimmed.includes("{") &&
    (trimmed.includes("color:") ||
      trimmed.includes("background:") ||
      trimmed.includes("margin:") ||
      trimmed.includes("padding:"))
  ) {
    return "css";
  }

  // HTML patterns
  if (/<\/?[a-z][\s\S]*>/i.test(trimmed)) {
    return "markup";
  }

  // Default to bash for CLI-like commands
  return "bash";
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  className,
  showCopyButton = true,
}: CodeBlockProps) {
  const detectedLanguage = language || detectLanguage(code);

  return (
    <div className={cn("relative group", className)}>
      <Highlight theme={themes.nightOwl} code={code.trim()} language={detectedLanguage}>
        {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              highlightClassName,
              "rounded-lg p-4 overflow-x-auto text-sm",
              showLineNumbers && "pl-12"
            )}
            style={style}
          >
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {showLineNumbers && (
                    <span className="absolute left-0 w-8 text-right pr-4 text-gray-500 select-none">
                      {i + 1}
                    </span>
                  )}
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>

      {showCopyButton && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={code} variant="ghost" size="sm" />
        </div>
      )}

      {detectedLanguage && (
        <span className="absolute bottom-2 right-2 text-xs text-gray-400 opacity-50">
          {detectedLanguage}
        </span>
      )}
    </div>
  );
}
