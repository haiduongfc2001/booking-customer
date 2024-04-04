import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import HotelIcon from "@mui/icons-material/Hotel";

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: "background.paper", mt: 8, p: 6 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
        <Stack
          direction="column"
          spacing={2}
          sx={{ width: { xs: "100%", sm: "50%" } }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <HotelIcon
              sx={{
                mr: 1,
                width: "60px",
                height: "60px",
                color: "#00d1b2",
              }}
            />
            <Typography
              variant="h2"
              noWrap
              component="div"
              sx={{
                color: "#00d1b2",
                fontSize: "36px",
                fontWeight: "bold",
                letterSpacing: "2px",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                textTransform: "uppercase",
              }}
            >
              dhd
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary" align="left">
            A short description of what you do here
          </Typography>
          <Typography variant="body2" color="text.secondary" align="left">
            © 2024 Company Terms Privacy Blog
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: { xs: "100%", sm: "50%" },
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Stack direction="column" spacing={2}>
            <Typography variant="h6" color="text.secondary" align="left">
              PRODUCT
            </Typography>
            <Link
              variant="body2"
              underline="none"
              sx={{ color: "text.secondary" }}
            >
              Pricing
            </Link>
            <Link
              variant="body2"
              underline="none"
              sx={{ color: "text.secondary" }}
            >
              FAQ
            </Link>
          </Stack>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6" color="text.secondary" align="left">
              COMPANY
            </Typography>
            <Link
              variant="body2"
              underline="none"
              sx={{ color: "text.secondary" }}
            >
              About
            </Link>
            <Link
              variant="body2"
              underline="none"
              sx={{ color: "text.secondary" }}
            >
              Contact
            </Link>
            <Link
              variant="body2"
              underline="none"
              sx={{ color: "text.secondary" }}
            >
              Blog
            </Link>
          </Stack>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6" color="text.secondary" align="left">
              SOCIAL
            </Typography>
            <Link
              variant="body2"
              underline="none"
              sx={{ color: "text.secondary" }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Image
                  src="/images/twitter.png"
                  alt="Twitter"
                  width="16"
                  height="16"
                  loading="lazy"
                />{" "}
                &nbsp; Twitter
              </Stack>
            </Link>
            <Link
              variant="body2"
              underline="none"
              sx={{ color: "text.secondary" }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Image
                  src="/images/facebook.svg"
                  alt="Facebook"
                  width="16"
                  height="16"
                  loading="lazy"
                />{" "}
                &nbsp; Facebook
              </Stack>
            </Link>
            <Link
              variant="body2"
              underline="none"
              sx={{ color: "text.secondary" }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Image
                  src="/images/instagram.webp"
                  alt="Instagram"
                  width="16"
                  height="16"
                  loading="lazy"
                />{" "}
                &nbsp; Instagram
              </Stack>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
