import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function LoginPrompt() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 my-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Want to create and manage private commands?</h3>
        <p className="text-sm text-muted-foreground">
          Sign in to create your own private commands and manage your command history.
        </p>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </div>
    </div>
  );
}
