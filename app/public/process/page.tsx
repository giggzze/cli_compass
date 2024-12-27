"use client";

import ProcessPageContent from "@/components/process/ProcessPageContent";
import { LoginPrompt } from "../components/LoginPrompt";

export default function PublicProcessPage() {
  return (
    <div>
      <LoginPrompt type="process" />
      <ProcessPageContent privacy="public" />
    </div>
  );
}
