"use client";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HotelIcon from "@mui/icons-material/Hotel";
import { Box, List, ListItem } from "@mui/material";

export default function HotelDetail(props: any) {
  const hotelData = {
    id: 1,
    name: "Khách sạn Pullman Hanoi",
    location: "Hà Nội",
  };

  const { location, checkInDate, checkOutDate, numberOfPeople, numberOfRooms } =
    props.searchParams;

  const searchQueryParams = new URLSearchParams({
    location,
    checkInDate,
    checkOutDate,
    numberOfPeople,
    numberOfRooms,
  }).toString();

  return (
    <Box mx={10} my={4}>
      <CustomizedBreadcrumbs
        newBreadcrumbsData={[
          {
            label: `${location}`,
            href: `/search?${searchQueryParams}`,
            icon: <LocationOnIcon />,
          },
          {
            label: `${hotelData.name}`,
            icon: <HotelIcon />,
          },
        ]}
      />

      <List>
        <ListItem>location : {location}</ListItem>
        <ListItem>checkInDate : {checkInDate}</ListItem>
        <ListItem>checkOutDate : {checkOutDate}</ListItem>
        <ListItem>numberOfPeople : {numberOfPeople}</ListItem>
        <ListItem>numberOfRooms : {numberOfRooms}</ListItem>
      </List>
    </Box>
  );
}
