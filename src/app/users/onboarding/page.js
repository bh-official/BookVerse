import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/utils/db";

export default function OnboardingPage() {
  async function handleSubmitNewUser(formData) {
    "use server";
    // we need to submit the username, bio, and clerk id to our database
    const { username, bio } = Object.fromEntries(formData);
    const { userId } = await auth();

    const inserted = await db.query(
      `insert into user_account (username, bio, clerk_id) values ($1, $2, $3)`,
      [username, bio, userId],
    );

    redirect(`/users/you`);
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
        <p className="text-gray-600 mb-6">
          Please create your profile to continue.
        </p>

        <form action={handleSubmitNewUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              name="username"
              placeholder="Enter your username"
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              placeholder="Tell us about yourself"
              className="w-full border rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6c47ff] text-white rounded-full font-semibold py-3 hover:bg-[#5a3ce6] transition-colors"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}
