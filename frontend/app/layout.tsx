import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parkinson's Disease Detection Platform | AI Biomarker Diagnostic",
  description: "Clinical-grade AI platform for early detection of Parkinson's Disease via voice acoustic biomarkers and machine learning.",
  keywords: [
    "Parkinson's Disease",
    "Voice Biomarkers",
    "Clinical AI",
    "Machine Learning Diagnostic",
    "Acoustic Voice Analysis",
    "SVM Classifier"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
