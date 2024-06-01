"use client";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import * as React from "react";
import { booking, roomInfo } from "@/utils/data";
import {
  BankTransferIcon,
  MomoIcon,
  SingleBedIcon,
  ZaloPayIcon,
} from "@/constant/icons";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import QrCodeOutlinedIcon from "@mui/icons-material/QrCodeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import calculateNumberOfNights from "@/utils/calculate-number-of-nights";
import RoomPricing from "@/components/booking/room-pricing";
import RoomInfo from "@/components/booking/room-info";
import BookingDetails from "@/components/booking/booking-details";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export default function HotelDetail(props: any) {
  const {
    roomId,
    checkInDate,
    checkOutDate,
    numAdults,
    numChildren,
    numRooms,
    hotelId,
  } = props.searchParams;

  const numNights = calculateNumberOfNights(checkInDate, checkOutDate);

  return (
    <div>
      <Box mx={10} my={4}>
        <CustomizedBreadcrumbs
          newBreadcrumbsData={[
            {
              label: "Tài khoản",
              icon: <PersonOutlineOutlinedIcon />,
            },
            {
              label: "Đơn đặt phòng",
              icon: <BorderColorOutlinedIcon />,
            },
          ]}
        />

        <Grid container spacing={3} my={3}>
          <Grid item xs={12} md={7}>
            <BookingDetails booking={booking} numNights={numNights} />
          </Grid>
          <Grid item xs={12} md={5}>
            <RoomInfo roomInfo={roomInfo} booking={booking} />

            <RoomPricing
              numNights={numNights}
              booking={booking}
              roomInfo={roomInfo}
            />
          </Grid>
        </Grid>
      </Box>

      {/* <List>
        <ListItem>roomId : {roomId}</ListItem>
        <ListItem>checkInDate : {checkInDate}</ListItem>
        <ListItem>checkOutDate : {checkOutDate}</ListItem>
        <ListItem>numAdults : {numAdults}</ListItem>
        <ListItem>numChildren : {numChildren}</ListItem>
        <ListItem>numRooms : {numRooms}</ListItem>
        <ListItem>hotelId : {hotelId}</ListItem>
      </List> */}
    </div>
  );
}
