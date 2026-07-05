import Logger from "dev-console-kit";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {

  if (process.env.NODE_ENV === "production") {
    Logger.setEnabled(false);
  }
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#313131" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
