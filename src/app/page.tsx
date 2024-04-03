// import MapComponent from "@/components/map/map";
import { Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DHD | Home",
  description: "The official Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function Home() {
  return (
    <>
      <Typography variant="h2">Home Page</Typography>
      {/* <MapComponent /> */}
    </>
  );
}
