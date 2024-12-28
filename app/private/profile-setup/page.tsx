import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Login from "@/components/shared/Login";
import { UserService } from "@/app/services/userService";
import ProfileSetupForm from "./components/ProfileSetupForm";

export default async function ProfileSetup() {
  const { userId } = await auth();

  if (!userId) {
    return <Login />;
  }

  if (await UserService.userExists(userId)) {
    redirect("/");
  }

  return <ProfileSetupForm userId={userId} />;
}
