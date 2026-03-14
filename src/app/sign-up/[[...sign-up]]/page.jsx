import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SignUp
        appearance={{
          elements: {
            rootBox:
              "bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-500/30",
            card: "bg-transparent shadow-none",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton:
              "bg-slate-700 hover:bg-purple-700 text-white border-slate-600",
            socialButtonsBlockButtonText: "text-white",
            formFieldLabel: "text-purple-300",
            formFieldInput:
              "bg-slate-700/50 border-purple-500/50 text-white placeholder:text-gray-400 focus:border-pink-400",
            formButtonPrimary:
              "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
            footerActionLink: "text-pink-400 hover:text-pink-300",
            dividerLine: "bg-purple-500/30",
            dividerText: "text-gray-400",
            identityPreviewText: "text-white",
            identityPreviewEditButton: "text-pink-400",
            formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
          },
        }}
      />
    </div>
  );
}
