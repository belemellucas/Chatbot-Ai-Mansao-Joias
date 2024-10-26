import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ApolloProviderWrapper from "@/components/ui/ApolloProvider";
import { Toaster } from "sonner";
//import Head from "next/head";
import Favicon from '/public/favicon.ico';

export const metadata: Metadata = {
  title: "Mansão Joias",
  description: "Agente de AI Personalizado",
  icons: [{ rel: 'icon', url: Favicon.src }],

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProviderWrapper>
      <ClerkProvider>
        <html lang="en">
          <body>
            {children}
            <Toaster position="bottom-center" />
          </body>
        </html>
      </ClerkProvider>
    </ApolloProviderWrapper>
  );
}
