// app/layout.tsx

import Providers from "./providers";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "TestVar",
    description: "A Flashcard Sharing Platform",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
