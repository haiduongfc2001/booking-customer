import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/theme/theme";
import Header from "@/components/app.header";
import Footer from "@/components/app.footer";
import { Metadata } from "next";
import { Suspense } from "react";
import { NavigationEvents } from "@/components/navigation-events";
import Providers from "@/redux/Provider";
import AlertModal from "@/modals/alert-modal";
import Loading from "@/components/loading/loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DHD | Booking",
  description: "The official Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <body className={inter.className}>
          <Providers>
            <Loading></Loading>
            <Header />
            {children}
            <Suspense fallback={null}>
              <NavigationEvents />
            </Suspense>
            <Footer />
            <AlertModal></AlertModal>
          </Providers>
        </body>
      </ThemeProvider>
    </html>
  );
}
