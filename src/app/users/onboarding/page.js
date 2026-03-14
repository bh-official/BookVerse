import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/utils/db";

export default function OnboardingPage() {
  async function handleSubmitNewUser(formData) {
    "use server";
    const { username, bio } = Object.fromEntries(formData);
    const { userId } = await auth();

    await db.query(
      `insert into user_account (username, bio, clerk_id) values ($1, $2, $3)`,
      [username, bio, userId],
    );

    redirect(`/users/you`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome! 👋</h1>
          <p className="text-gray-400 mb-6">
            Create your profile to start your BookVerse journey.
          </p>

          <form action={handleSubmitNewUser} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Username *
              </label>
              <input
                name="username"
                placeholder="Enter your username"
                required
                className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Bio *
              </label>
              <textarea
                name="bio"
                placeholder="Tell us about yourself - what books do you like?"
                required
                className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 h-24 resize-none text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white rounded-full font-semibold py-3 hover:bg-purple-500 transition-colors mt-6"
            >
              Create Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
