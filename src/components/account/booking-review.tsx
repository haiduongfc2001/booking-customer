import React, { useState } from "react";
import {
  Box,
  Rating,
  TextField,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { API, STATUS_CODE } from "@/constant/constants";
import { postRequest } from "@/services/api-instance";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Define the initial state for the ratings and comments
const initialRatings = {
  location_rating: 0,
  price_rating: 0,
  service_rating: 0,
  cleanliness_rating: 0,
  amenities_rating: 0,
  comment: "",
};

// Define the types for the rating keys
type RatingKeys = keyof typeof initialRatings;

// Define the props interface
interface BookingReviewProps {
  booking_id: number;
  openModalReview: boolean;
  setOpenModalReview: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookingReview: React.FC<BookingReviewProps> = ({
  booking_id,
  openModalReview,
  setOpenModalReview,
}) => {
  const [ratings, setRatings] = useState(initialRatings);

  const handleCloseModalReview = () => {
    setOpenModalReview(false);
  };

  const handleRatingChange =
    (name: RatingKeys) =>
    (event: React.ChangeEvent<{}>, newValue: number | null) => {
      setRatings({
        ...ratings,
        [name]: newValue || 0,
      });
    };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRatings({
      ...ratings,
      comment: event.target.value,
    });
  };

  const handleReviewBooking = async () => {
    setOpenModalReview(false);
    try {
      console.log("ratings ", ratings);
      const response = await postRequest(API.REVIEW.CREATE_REVIEW, {
        booking_id: Number(booking_id),
        customer_id: 525,
        ...ratings,
      });

      if (response && response.status === STATUS_CODE.CREATED) {
        alert("Đánh giá thành công");
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    } finally {
      setOpenModalReview(false);
      window.location.reload();
    }
  };

  return (
    <Dialog
      open={openModalReview}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseModalReview}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography component="div" variant="h4" gutterBottom>
          Đánh giá đơn đặt phòng
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {[
              { label: "Vị trí", name: "location_rating" },
              { label: "Giá cả", name: "price_rating" },
              { label: "Dịch vụ", name: "service_rating" },
              { label: "Độ sạch sẽ", name: "cleanliness_rating" },
              { label: "Tiện nghi", name: "amenities_rating" },
            ].map((item) => (
              <Grid item xs={12} key={item.name} container alignItems="center">
                <Grid item xs={4}>
                  <Typography component="span" variant="h6">
                    {item.label}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Rating
                    name={item.name}
                    value={ratings[item.name as RatingKeys] as number}
                    onChange={handleRatingChange(item.name as RatingKeys)}
                    max={10}
                  />
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                label="Bình luận"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={ratings.comment}
                onChange={handleCommentChange}
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleReviewBooking}
        >
          Gửi đánh giá
        </Button>
        <Button
          onClick={handleCloseModalReview}
          variant="contained"
          color="inherit"
        >
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingReview;
