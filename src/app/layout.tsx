"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/theme/theme";
import Header from "@/components/app.header";
import Footer from "@/components/app.footer";
import { Suspense } from "react";
import { NavigationEvents } from "@/components/navigation-events";
import AlertModal from "@/modals/alert-modal";
import Loading from "@/components/loading/loading";
import StoreProvider from "@/redux/store/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <body className={inter.className}>
            <Loading />
            <Header />
            {children}
            <Suspense fallback={null}>
              <NavigationEvents />
            </Suspense>
            <Footer />
            <AlertModal />
          </body>
        </ThemeProvider>
      </html>
    </StoreProvider>
  );
}
