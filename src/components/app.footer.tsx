import React from "react";
import { Typography, Container, Link, Grid, Box } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        width: "100%",
        marginTop: "auto",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="body1" align="center" color="primary.lightest">
              Stay Connected
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" align="center" color="primary.lightest">
              Follow us on social media:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" align="center" color="primary.lightest">
              <Link href="#" color="inherit">
                Facebook
              </Link>{" "}
              |{" "}
              <Link href="#" color="inherit">
                Twitter
              </Link>{" "}
              |{" "}
              <Link href="#" color="inherit">
                Instagram
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" align="center" color="primary.lightest">
              Contact us: example@example.com
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
