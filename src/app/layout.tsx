import type { Metadata } from "next";
import "@/styles/globals.scss";
import { StoreHydration } from "@/components/storeHydration/StoreHydration";
import { ErrorBoundary } from "@/components/common/ErrorBoundary/ErrorBoundary";

export const metadata: Metadata = {
  title: {
    template: "Trello Clone",
    default: "Trello Clone",
  },
  description:
    "A Trello clone built with Next.js, TypeScript, Zustand, and SCSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreHydration />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
