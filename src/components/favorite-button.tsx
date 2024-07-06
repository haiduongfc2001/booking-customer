import React, { FC } from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import { openAlert } from "@/redux/slices/alert-slice";
import { postRequest } from "@/services/api-instance";
import { ALERT_TYPE, STATUS_CODE } from "@/constant/constants";

interface FavoriteButtonProps {
  hotelId: number;
  isLiked: boolean;
  onToggle: () => void;
}

const FavoriteButton: FC<FavoriteButtonProps> = ({
  hotelId,
  isLiked,
  onToggle,
}) => {
  const customer_id = useAppSelector((state) => state.auth.customer_id);
  const dispatch = useAppDispatch();

  const addFavoriteHotel = async () => {
    try {
      const response = await postRequest(`/customer/addFavoriteHotel`, {
        customer_id,
        hotel_id: hotelId,
      });
      if (response?.status === STATUS_CODE.CREATED) {
        onToggle();
      }
    } catch (error: any) {
      dispatch(
        openAlert({
          type: ALERT_TYPE.ERROR,
          message:
            error.response?.data?.message || "Đã xảy ra lỗi không mong muốn.",
        })
      );
    }
  };

  const removeFavoriteHotel = async () => {
    try {
      const response = await postRequest(`/customer/removeFavoriteHotel`, {
        customer_id,
        hotel_id: hotelId,
      });
      if (response?.status === STATUS_CODE.OK) {
        onToggle();
      }
    } catch (error: any) {
      dispatch(
        openAlert({
          type: ALERT_TYPE.ERROR,
          message:
            error.response?.data?.message || "Đã xảy ra lỗi không mong muốn.",
        })
      );
    }
  };

  const handleToggleLike = () => {
    if (isLiked) {
      removeFavoriteHotel();
    } else {
      addFavoriteHotel();
    }
  };

  return (
    <IconButton
      sx={{
        top: "16px",
        right: "4px",
        zIndex: 2,
        position: "absolute",
        flex: "0 0 auto",
        color: "rgba(0, 0, 0, 0.54)",
        padding: "12px",
        overflow: "visible",
        fontSize: "1.7142857142857142rem",
        textAlign: "center",
        transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        borderRadius: "50%",
        "& .MuiIconButton-label": {
          width: "100%",
          display: "flex",
          alignItems: "inherit",
          justifyContent: "inherit",
        },
        "& svg:hover": {
          color: "neutral.800",
          transition: "color 0.2s ease",
        },
      }}
      onClick={handleToggleLike}
    >
      <FavoriteIcon
        sx={{
          fill: isLiked ? "red" : "neutral.900",
          stroke: "#ffffff",
        }}
      />
    </IconButton>
  );
};

export default FavoriteButton;
