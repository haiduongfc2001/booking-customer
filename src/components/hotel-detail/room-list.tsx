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
import { filterRoom, hotelData, roomAmenities, roomBenefits } from "./data";
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

interface RoomListProps {
  numberOfNights: number;
  numberOfRooms: number;
}

const RoomList: FC<RoomListProps> = ({ numberOfNights, numberOfRooms }) => {
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
          {hotelData?.roomList?.map((room) => (
            <Grid item xs={12} key={room.id}>
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
                <Grid container spacing={2}>
                  <Grid item sm={12} md={2.5}>
                    <CardMedia
                      component="img"
                      src={
                        room?.images[0].url ||
                        "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                      }
                      alt={room.number}
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
                            webkitBoxOrient: "vertical",
                            webkitLineClamp: "3",
                          }}
                        >
                          {room.number}
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
                            <PeopleIcon /> &nbsp;2 người
                            <CustomizedTooltip
                              title={
                                <ul style={{ paddingLeft: 10 }}>
                                  <li>Sức chứa tối đa của phòng 4</li>
                                  <li>Sức khách tiêu chuẩn 2</li>
                                  <li>
                                    Cho phép ở thêm 1 người lớn 2 trẻ em thoả mã
                                    4 khách tối đa có thể mất thêm phí
                                  </li>
                                  <li>
                                    Chi tiết phí phụ thu vui lòng xem tại{" "}
                                    <em>
                                      <strong>&quot;Giá cuối cùng&quot;</strong>
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
                              title={<span>Diện tích phòng: 45m&sup2;</span>}
                              content={
                                <Typography variant="body1">
                                  &nbsp;45m&sup2;
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
                            <VisibilityIcon />
                            <CustomizedTooltip
                              title={<span>Hướng thành phố</span>}
                              content={
                                <Typography variant="body1">
                                  &nbsp;Hướng thành phố
                                </Typography>
                              }
                            />
                          </Box>
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
                            <Typography variant="body1">
                              2 giường đơn
                            </Typography>
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
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  fontSize: "16px",
                                  fontWeight: 500,
                                  textDecoration: "line-through",
                                }}
                              >
                                {formatCurrency(room.price)}
                              </Typography>
                            </Box>
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
                              {formatCurrency(room.price - room.discount)}
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
                            <Box
                              sx={{
                                cursor: "pointer",
                                position: "relative",
                                mt: "12px",
                              }}
                            >
                              <LastPrice
                                numberOfRooms={numberOfRooms}
                                numberOfNights={numberOfNights}
                                roomPrice={room.price - room.discount}
                                serviceCharge={hotelData?.serviceCharge}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default RoomList;
