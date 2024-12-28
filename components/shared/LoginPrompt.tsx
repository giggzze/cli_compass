import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

type LoginPromptType = "commands" | "process";

interface LoginPromptProps {
  type?: LoginPromptType;
}

const promptContent = {
  commands: {
    title: "Want to create and manage private commands?",
    description:
      "Sign in to create your own private commands and manage your command history.",
  },
  process: {
    title: "Want to create and manage your processes?",
    description:
      "Sign in to create custom processes and and share them with others.",
  },
};

export function LoginPrompt({ type = "commands" }: LoginPromptProps) {
  const content = promptContent[type];
  const afterSignInUrl =
    type === "commands" ? "/private/command" : "/private/process";

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 my-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {content.title}
        </h3>
        <p className="text-sm text-muted-foreground">{content.description}</p>
        <SignInButton mode="modal" afterSignInUrl={afterSignInUrl}>
          <Button>Sign in</Button>
        </SignInButton>
      </div>
    </div>
  );
}
