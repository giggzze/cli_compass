import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Login from "@/components/shared/Login";

export default async function LoginPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/commands/user");
  }

  return <Login />;
}
