"use client";
import { FC } from "react";
import * as React from "react";
import { Box, CardMedia, Grid, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import formatCurrency from "@/utils/format-currency";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";

interface SearchResultProps {
  location: string;
  checkInDate: Dayjs;
  checkOutDate: Dayjs;
  numberOfPeople: number;
  numberOfRooms: number;
}

const SearchResult: FC<SearchResultProps> = ({
  location = "",
  checkInDate = dayjs(),
  checkOutDate = dayjs().add(1, "day"),
  numberOfPeople = 1,
  numberOfRooms = 1,
}) => {
  const hotels = [
    {
      hotel_id: 38527,
      hotel_name: "Khách sạn La Vague",
      hotel_address: "Số 8, Trần Phú, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/thumb/1616771153173ME/outside.png",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 48801,
      hotel_name: "Khách sạn Grand Gosia Nha Trang",
      hotel_address:
        "10-12 Trần Phú, Vĩnh Nguyên, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://storage.googleapis.com/hms_prod/photo/thumb/1617092342927GY/144944532.png",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 38483,
      hotel_name: "Khách sạn Sea Pearl Nha Trang",
      hotel_address: "98a, Trần Phú, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/thumb/1617174369612dF/172059893.jpg",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 48130,
      hotel_name: "The Empyrean Nha Trang",
      hotel_address:
        "2 , Nguyễn Thị Minh Khai, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/thumb/1616819671281ZO/40510723.png",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 38437,
      hotel_name: "Khách sạn Ibis Styles Nha Trang",
      hotel_address: "86, Hùng Vương, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/img/467043orJ/z4260616666973_ae897d5bc64a75a0a960e005004c5497.jpg",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 38380,
      hotel_name: "Khách sạn Boton Blue & Spa Nha Trang",
      hotel_address:
        "Phạm Văn Đồng, Phường Vĩnh Hòa, Phạm Văn Đồng, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/thumb/2685xI/ecea6c41b2d197bd06460bee7ab542b0.jpg",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 38406,
      hotel_name: "TUI BLUE - Khách sạn TUI BLUE Nha Trang",
      hotel_address:
        "18, Trần Hưng Đạo, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/img/470238wvF/dji_0056.jpg",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 38664,
      hotel_name: "Khách Sạn Mường Thanh Luxury Nha Trang",
      hotel_address:
        "60, Trần Phú, Lộc Thọ, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/thumb/1620472922630mr/293542180_result.jpg",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 9723,
      hotel_name: "Khách Sạn Mường Thanh Grand Nha Trang",
      hotel_address:
        "6 , Dương Hiến Quyền, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/thumb/1616860211117eh/283800904.png",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 45768,
      hotel_name: "Khách sạn Merperle Beach Nha Trang",
      hotel_address: "88a, Trần Phú, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://googleapis.tripi.vn/download/storage/v1/b/tourcdn/o/photos%2FDETKKSYJY7_%2Ftmp%2Fplaytemp7486223076244920531%2FmultipartBody4363323379706674084asTemporaryFile?generation=1592549175846288&alt=media",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 38470,
      hotel_name: "Khách Sạn Majestic Premium Nha Trang",
      hotel_address:
        "96b5/4 , Trần Phú, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/thumb/1617199586684xK/152261603.jpg",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 512,
      hotel_name: "Khách sạn Sheraton Nha Trang",
      hotel_address:
        "26-28, Trần Phú, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://www.googleapis.com/download/storage/v1/b/hotel_image/o/logo%2F4%2F210187.jpg?generation=1563771731644355&alt=media",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 553,
      hotel_name: "Khách Sạn Novotel Nha Trang",
      hotel_address: "50, Trần Phú, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://googleapis.tripi.vn/download/storage/v1/b/tourcdn/o/photos%2FXMS2N0BE6X_%2Ftmp%2Fplaytemp4401775770632333474%2FmultipartBody6774088289307231415asTemporaryFile?generation=1586178743406910&alt=media",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 8496,
      hotel_name: "Khách sạn StarCity Nha Trang",
      hotel_address:
        "72-74 , Trần Phú, Lộc Thọ, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/thumb/1616818433346JL/out.png",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 38396,
      hotel_name: "Vinpearl  Beachfront Nha Trang",
      hotel_address:
        "78-80 Trần Phú, Phường Lộc Thọ, Trần Phú, Lộc Thọ, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/thumb/1616841710477jp/dai-dien.png",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
    {
      hotel_id: 2048,
      hotel_name: "Champa Island Nha Trang - Resort Hotel & Spa   ",
      hotel_address: "304 , 2/4, Thành Phố Nha Trang, Khánh Hòa, Việt Nam",
      hotel_avatar:
        "https://gcs.tripi.vn/hms_prod/photo/img/469422dbJ/z4420199007786_a80da51a029391ded0f8199ec2230a6a.jpg",
      min_room_price: 900000,
      original_room_price: 1000000,
    },
  ];

  const router = useRouter();

  const handleNavigate = (hotel_id: number) => {
    const formattedCheckInDate = checkInDate.format("YYYY-MM-DD");
    const formattedCheckOutDate = checkOutDate.format("YYYY-MM-DD");

    const searchQueryParams = new URLSearchParams({
      location,
      checkInDate: formattedCheckInDate,
      checkOutDate: formattedCheckOutDate,
      numberOfPeople: String(numberOfPeople),
      numberOfRooms: String(numberOfRooms),
    }).toString();

    router.push(`/hotel/${hotel_id}?${searchQueryParams}`, { scroll: true });
  };

  return (
    <Box sx={{ flex: "1", p: "0 20px" }}>
      <Box
        width="100%"
        height="100px"
        m={2}
        p={2}
        bgcolor="background.paper"
        borderRadius="8px"
        display="flex"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography variant="h5">{location}</Typography>
        <Typography component="span">
          {`Có ${hotels?.length ?? 0} khách sạn ở ${location}`}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Display hotels as cards */}
        {hotels.map((hotel) => (
          <Grid item xs={12} key={hotel.hotel_id}>
            <Box
              sx={{
                width: "100%",
                mx: 2,
                p: 2,
                borderRadius: 1,
                overflow: "hidden",
                boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
                bgcolor: "background.paper",
                display: "flex",
                "&:hover": {
                  bgcolor: "rgb(235,240,252)",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                },
                "&:hover .MuiTypography-h6": {
                  color: "primary.main",
                  transition: "all .2s",
                  cursor: "pointer",
                },
              }}
              onClick={() => handleNavigate(hotel.hotel_id)}
            >
              <Grid container spacing={2}>
                <Grid item sm={12} md={4}>
                  <CardMedia
                    component="img"
                    src={
                      hotel?.hotel_avatar ||
                      "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                    }
                    alt={hotel.hotel_name}
                    sx={{
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </Grid>
                <Grid item sm={12} md={5}>
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        fontSize: "18px",
                        fontWeight: "600",
                        lineHeight: "24px",
                        pt: "4px",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: "3",
                      }}
                    >
                      {hotel.hotel_name}
                    </Typography>
                    <Stack direction="row">
                      <LocationOnIcon />
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {hotel.hotel_address}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item sm={12} md={3}>
                  <Box
                    p={2}
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#718096",
                        textDecoration: "line-through",
                        cursor: "pointer",
                      }}
                      component="span"
                    >
                      {formatCurrency(hotel.original_room_price)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgb(229, 62, 62)",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      component="span"
                    >
                      {formatCurrency(hotel.min_room_price)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchResult;
