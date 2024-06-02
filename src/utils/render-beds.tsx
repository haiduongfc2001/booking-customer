import { Typography } from "@mui/material";
import * as React from "react";

interface Bed {
  id: number;
  quantity: number;
  description: string;
}

interface RenderBedsProps {
  beds?: Bed[];
}

export const renderBeds = ({ beds }: RenderBedsProps): JSX.Element | null => {
  if (!beds || beds.length === 0) return null;

  return (
    <>
      {beds.map((bed, index) => (
        <Typography variant="body1" key={bed.id} component="span" pl={1}>
          {bed.quantity}&nbsp;{bed.description}
          {index < beds.length - 1 ? ", " : ""}
        </Typography>
      ))}
    </>
  );
};
