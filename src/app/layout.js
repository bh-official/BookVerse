import { ClerkProvider } from "@clerk/nextjs";
import { Unna } from "next/font/google";
import "./globals.css";
import AuthHeader from "@/components/AuthHeader";

const unna = Unna({
  weight: "400",
});

export const metadata = {
  title: "BookVerse",
  description: "A Full Stack Dynamic Book Review Application",
  openGraph: {
    title: "BookVerse",
    description: "A Full Stack Dynamic Book Review Application",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${unna.className} antialiased`}>
        <ClerkProvider>
          <AuthHeader />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
