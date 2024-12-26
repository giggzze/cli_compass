import { redirect } from "next/navigation";
import Login from "../components/Login";
import { auth } from "@clerk/nextjs/server";

export default async function LoginPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/commands/user");
  }

  return <Login />;
}
