import React from "react";
import Head from "next/head";
import "./globals.css";
import { Providers } from "./provider";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon-32x32.ico" />
      </Head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
