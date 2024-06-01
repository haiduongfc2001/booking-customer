"use client";
import { FC } from "react";
import * as React from "react";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import formatCurrency from "@/utils/format-currency";
import { filterRoom, roomAmenities, roomBenefits } from "../../utils/data";
import TuneIcon from "@mui/icons-material/Tune";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RoomAmenitiesList from "@/components/hotel-detail/room-amenities-list";
import PeopleIcon from "@mui/icons-material/People";
import CustomizedTooltip from "@/lib/tooltip";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneIcon from "@mui/icons-material/Done";
import BedRoundedIcon from "@mui/icons-material/BedRounded";
import LastPrice from "./last-price";

interface RoomTypeListProps {
  hotelData: { [key: string]: any };
  numNights: number;
  numRooms: number;
  checkInDate: string;
  roomRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
}

interface IRoomType {
  [key: string]: any;
}

interface IBed {
  [key: string]: any;
}

const RoomTypeList: FC<RoomTypeListProps> = ({
  hotelData,
  numNights,
  numRooms,
  checkInDate,
  roomRefs,
}) => {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);

  const handleFilterToggle = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      // Nếu filter đã được chọn, loại bỏ nó khỏi danh sách
      setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    } else {
      // Nếu filter chưa được chọn, thêm nó vào danh sách
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleClearFilters = () => {
    if (selectedFilters.length <= 0) return;
    setSelectedFilters([]);
  };

  return (
    <>
      <Box sx={{ flex: "1" }}>
        <Box
          sx={{
            width: "100%",
            background: "background.paper",
            py: 3,
          }}
        >
          <Box
            sx={{
              m: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "23px",
                m: "0 !important",
              }}
            >
              Chọn phòng
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              m: 0,
            }}
          >
            <Box
              sx={{
                border: "1px solid #EDF2F7",
                p: "8px 24px 16px 24px",
                fontSize: "14px",
                boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.05)",
                mt: 2,
                lineHeight: "17px",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: "50px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <TuneIcon />
                  <Typography
                    variant="h6"
                    ml={2}
                    sx={{
                      fontSize: "16px",
                      lineHeight: "16px",
                      fontWeight: 600,
                    }}
                  >
                    Chọn lọc:
                  </Typography>
                </Box>

                {selectedFilters.length > 0 && (
                  <Button
                    size="small"
                    color="error"
                    onClick={handleClearFilters}
                  >
                    Xóa tất cả
                  </Button>
                )}
              </Box>
              <Box>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    pb: 0,
                    flexWrap: "wrap",
                    display: "flex",
                  }}
                >
                  {filterRoom?.map((filter, index) => (
                    <Grid
                      key={index}
                      item
                      xs={6}
                      md={2.4}
                      //   sx={{ m: "4px 8px 4px 0px" }}
                    >
                      <Button
                        variant={
                          selectedFilters.includes(filter)
                            ? "contained"
                            : "outlined"
                        }
                        sx={{
                          p: "8px 12px",
                          webkitBoxPack: "center",
                          justifyContent: "center",
                          webkitBoxAlign: "center",
                          alignItems: "center",
                          display: "flex",
                          border: "1px solid rgb(190, 194, 201)",
                          borderRadius: 999,
                          bgcolor: selectedFilters.includes(filter)
                            ? "primary.main"
                            : "transparent",
                          color: selectedFilters.includes(filter)
                            ? "primary.lightest"
                            : "rgb(42, 42, 46)",
                        }}
                        onClick={() => handleFilterToggle(filter)}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "14px",
                            lineHeight: "14px",
                            fontWeight: 400,
                            m: 0,
                          }}
                        >
                          {filter}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {/* Display hotels as cards */}
          {hotelData?.room_types?.map((room_type: IRoomType) => (
            <Grid
              item
              xs={12}
              key={room_type?.id}
              ref={(el) => {
                if (roomRefs.current) {
                  roomRefs.current[room_type.id] = el;
                }
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  p: 2,
                  borderRadius: 1,
                  overflow: "hidden",
                  boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
                  bgcolor: "background.paper",
                  display: "flex",
                }}
              >
                {(() => {
                  const room_type_avatar =
                    room_type?.images?.filter(
                      (image: { [key: string]: any }) =>
                        image.is_primary === true
                    )[0]?.url ||
                    "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";

                  const discountPercent = Math.floor(
                    (room_type?.room_discount / room_type.base_price) * 100
                  );

                  return (
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={2.5}>
                        <CardMedia
                          component="img"
                          src={room_type_avatar}
                          alt={room_type?.name}
                          sx={{
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: 1,
                          }}
                        />
                        <Button
                          color="primary"
                          endIcon={<ChevronRightIcon />}
                          sx={{
                            my: 1,
                          }}
                        >
                          Xem chi tiết phòng
                        </Button>
                        <RoomAmenitiesList roomAmenities={roomAmenities} />
                      </Grid>
                      <Grid item sm={12} md={9.5}>
                        <Grid container spacing={2}>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              ml: 2,
                              p: "24px 0 16px !important",
                              borderBottom: "2px solid #E2E8F0",
                            }}
                          >
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
                              {room_type?.name}
                            </Typography>
                            <Box
                              sx={{
                                color: "#4A5568",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  pr: 3,
                                }}
                              >
                                <PeopleIcon /> &nbsp;
                                {room_type?.standard_occupant} người
                                <CustomizedTooltip
                                  title={
                                    <ul style={{ paddingLeft: 10 }}>
                                      <li>
                                        Sức chứa tối đa của phòng{" "}
                                        {room_type?.max_occupant}
                                      </li>
                                      <li>
                                        Sức khách tiêu chuẩn{" "}
                                        {room_type?.standard_occupant}
                                      </li>
                                      <li>
                                        Cho phép ở thêm{" "}
                                        {room_type?.max_extra_bed > 0 &&
                                          `${room_type?.max_extra_bed} người lớn`}{" "}
                                        {room_type?.max_children > 0 &&
                                          `${room_type?.max_children} trẻ em`}{" "}
                                        thoả mãn {room_type?.max_occupant} khách
                                        tối đa có thể mất thêm phí
                                      </li>
                                      <li>
                                        Chi tiết phí phụ thu vui lòng xem tại{" "}
                                        <em>
                                          <strong>
                                            &quot;Giá cuối cùng&quot;
                                          </strong>
                                        </em>
                                      </li>
                                    </ul>
                                  }
                                  content={
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        color: "primary.main",
                                        ml: 0.5,
                                      }}
                                    >
                                      (Xem chi tiết)
                                    </Typography>
                                  }
                                />
                              </Box>

                              <Box
                                sx={{
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  pr: 3,
                                }}
                              >
                                <AspectRatioIcon />
                                <CustomizedTooltip
                                  title={
                                    <span>
                                      Diện tích phòng: {room_type?.area}m&sup2;
                                    </span>
                                  }
                                  content={
                                    <Typography variant="body1">
                                      &nbsp;{room_type?.area}m&sup2;
                                    </Typography>
                                  }
                                />
                              </Box>

                              {room_type?.views?.length > 0 && (
                                <Box
                                  sx={{
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    pr: 3,
                                  }}
                                >
                                  <VisibilityIcon />
                                  <CustomizedTooltip
                                    title={room_type.views.map(
                                      (view: string, index: number) => (
                                        <span key={index}>{view}</span>
                                      )
                                    )}
                                    content={room_type.views.map(
                                      (view: string, index: number) => (
                                        <Typography key={index} variant="body1">
                                          &nbsp;{view}
                                        </Typography>
                                      )
                                    )}
                                  />
                                </Box>
                              )}
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid
                              container
                              spacing={2}
                              sx={{
                                px: 2,
                              }}
                            >
                              <Grid
                                item
                                xs={5}
                                sx={{
                                  borderRight: "2px solid #E2E8F0",
                                  bgcolor: "primary.light",
                                }}
                              >
                                <Typography variant="body1" color="primary">
                                  Lợi ích và ưu đãi
                                </Typography>
                                <List
                                  sx={{
                                    "& .MuiListItemIcon-root": {
                                      color: "success.main",
                                    },
                                  }}
                                >
                                  {roomBenefits?.map((benefit, index) => (
                                    <ListItem key={index} sx={{ py: 0 }}>
                                      <ListItemIcon>
                                        <DoneIcon />
                                      </ListItemIcon>
                                      <ListItemText>{benefit}</ListItemText>
                                    </ListItem>
                                  ))}
                                </List>
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                sx={{
                                  borderRight: "2px solid #E2E8F0",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <BedRoundedIcon />
                                {room_type?.beds?.map((bed: IBed) => (
                                  <Typography variant="body1" key={bed.id}>
                                    {bed.quantity}&nbsp;{bed.description}
                                  </Typography>
                                ))}
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                sx={{
                                  display: "flex",
                                  p: "16px 0",
                                  alignItems: "flex-end",
                                  flexDirection: "column",
                                }}
                              >
                                {room_type?.base_price !==
                                  room_type?.effective_price && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "flex-end",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        color: "#ffffff",
                                        p: "2px 4px",
                                        position: "relative",
                                        background: "#6366F1",
                                        fontWeight: 600,
                                        borderRadius: "3px 3px 0 3px",
                                        mb: 1,
                                      }}
                                    >
                                      {discountPercent} %
                                      <Box
                                        component="span"
                                        sx={{
                                          position: "absolute",
                                          right: 0,
                                          bottom: "-4px",
                                          width: 0,
                                          height: 0,
                                          borderColor:
                                            "transparent #6366F1 transparent transparent",
                                          borderStyle: "solid",
                                          borderWidth: "0 5px 5px 0",
                                        }}
                                      />
                                    </Box>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontSize: "16px",
                                        fontWeight: 500,
                                        textDecoration: "line-through",
                                      }}
                                    >
                                      {formatCurrency(room_type?.base_price)}
                                    </Typography>
                                  </Box>
                                )}
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: "rgb(229, 62, 62)",
                                    fontSize: "20px",
                                    mt: 1,
                                    fontWeight: 600,
                                    lineHeight: "24px",
                                  }}
                                  component="span"
                                >
                                  {formatCurrency(room_type?.effective_price)}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "rgb(74, 85, 104)",
                                    mt: "2px",
                                  }}
                                >
                                  /phòng/đêm
                                </Typography>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  sx={{ my: 2 }}
                                >
                                  Đặt phòng
                                </Button>
                                {room_type?.cost && (
                                  <Box
                                    sx={{
                                      cursor: "pointer",
                                      position: "relative",
                                      mt: "12px",
                                    }}
                                  >
                                    <LastPrice
                                      checkInDate={checkInDate}
                                      numRooms={numRooms}
                                      numNights={numNights}
                                      roomCost={room_type?.cost}
                                      serviceCharge={hotelData?.serviceCharge}
                                    />
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })()}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default RoomTypeList;
