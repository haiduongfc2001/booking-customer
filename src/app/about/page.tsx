import { Typography } from "@mui/material";
import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "DHD",
  description: "The official Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function Home() {
  return (
    <>
      <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <Typography>Home Page</Typography>
    </>
  );
}
