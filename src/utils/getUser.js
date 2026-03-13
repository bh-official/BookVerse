import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const { userId } = await auth();

  // if there is no userId, return null (user not logged in)
  if (!userId) {
    return null;
  }

  // check database to see if it has that user in it
  const userDetails = (
    await db.query(`select * from user_account where clerk_id = $1`, [userId])
  ).rows;

  // if nothing came back for that user
  if (userDetails.length === 0) {
    redirect("/users/onboarding");
  }

  return userDetails;
}
