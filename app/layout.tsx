// app/layout.tsx

import Providers from "./providers";
import "./globals.css";
import { Metadata } from "next";
import {Navbar} from "@/components/navbar";

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
            <Navbar />
            {children}
        </Providers>
        </body>
        </html>
    );
}
