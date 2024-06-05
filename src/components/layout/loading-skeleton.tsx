import React from "react";
import { Grid, Card, CardContent, Skeleton, Typography } from "@mui/material";

const SkeletonCard: React.FC = () => {
  return (
    <Card sx={{ width: "100%", m: 2 }}>
      <Skeleton variant="rectangular" height={140} />
      <CardContent>
        <Typography variant="h5">
          <Skeleton width="80%" />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Skeleton width="60%" />
        </Typography>
      </CardContent>
    </Card>
  );
};

const SkeletonComponent: React.FC = () => {
  return (
    <Grid
      container
      spacing={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
    >
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </Grid>
  );
};

export default SkeletonComponent;
