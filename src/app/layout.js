import { ClerkProvider } from "@clerk/nextjs";
import { Unna } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const unna = Unna({
  weight: "400",
});

export const metadata = {
  metadataBase: new URL("https://book-verse-blond.vercel.app"),
  title: "BookVerse - Your Book Review Community",
  description:
    "Discover, review, and share books with the BookVerse community. Write reviews, create posts, and connect with fellow book lovers.",
  keywords: [
    "books",
    "book reviews",
    "reading",
    "book community",
    "literature",
    "book recommendations",
    "author",
    "novels",
    "fiction",
    "non-fiction",
  ],
  openGraph: {
    title: "BookVerse - Your Book Review Community",
    description:
      "Discover, review, and share books with the BookVerse community. Write reviews, create posts, and connect with fellow book lovers.",
    type: "website",
    url: "https://book-verse-blond.vercel.app/",
    siteName: "BookVerse",
    locale: "en_US",
    alternateLocale: "en-GB",
    authors: ["BookVerse Team"],
    creator: "BookVerse",
    publisher: "BookVerse",
    images: [
      {
        url: "/BookVerse.png",
        width: 1200,
        height: 630,
        alt: "BookVerse - Book Review Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookVerse - Your Book Review Community",
    description:
      "Discover, review, and share books with the BookVerse community.",
    creator: "@bookverse",
    images: ["/BookVerse.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${unna.className} antialiased overflow-x-hidden`}>
        <ClerkProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
