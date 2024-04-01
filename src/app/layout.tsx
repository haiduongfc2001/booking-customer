import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/theme/theme";
import Header from "@/components/app.header";
import Footer from "@/components/app.footer";
import { Container } from "@mui/material";
import { Metadata } from "next";

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
          <Header />
          <Container sx={{ px: "60px !important", py: "40px !important" }}>
            {children}
          </Container>
          <Footer />
        </body>
      </ThemeProvider>
    </html>
  );
}
