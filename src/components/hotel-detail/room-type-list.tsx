"use client";
import { FC } from "react";
import * as React from "react";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import formatCurrency from "@/utils/format-currency";
import { filterRoom } from "../../utils/data";
import TuneIcon from "@mui/icons-material/Tune";
import RoomAmenitiesList from "@/components/hotel-detail/room-amenities-list";
import PeopleIcon from "@mui/icons-material/People";
import CustomizedTooltip from "@/lib/tooltip";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneIcon from "@mui/icons-material/Done";
import BedRoundedIcon from "@mui/icons-material/BedRounded";
import LastPrice from "./last-price";
import { useRouter } from "next/navigation";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ALERT_TYPE, FALLBACK_URL } from "@/constant/constants";
import { sortSurchargeRates, extractSurchargeValues } from "@/utils/surcharge";
import {
  AppDispatch,
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/redux/store/store";
import { openAlert } from "@/redux/slices/alert-slice";

interface RoomTypeListProps {
  hotelData: { [key: string]: any };
  roomTypes: { [key: string]: any }[];
  setRoomTypes: any;
  numNights: number;
  customerRequest: CustomerRequest;
  roomRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
}

interface IRoomType {
  [key: string]: any;
}

interface IBed {
  [key: string]: any;
}

interface CustomerRequest {
  checkIn: string;
  checkOut: string;
  numAdults: number;
  numRooms: number;
  numChildren: number;
  childrenAges: number[];
  hotelId: number;
}

type Benefit = {
  contentTooltip: string;
  titleTooltip?: React.JSX.Element;
};

const roomBenefits = (
  roomType: { [key: string]: any },
  hotelData: { [key: string]: any }
): Benefit[] => {
  const surchargePolicy = hotelData.policies.find(
    (policy: any) => policy.type === "SURCHARGE_RATES"
  );
  let surchargeRates: { [key: string]: number } | null = null;

  if (surchargePolicy) {
    surchargeRates = JSON.parse(surchargePolicy.value);
  }

  const sortedSurchargeKeys = sortSurchargeRates(surchargeRates || {});
  const {
    freeChildAge,
    freeChildMaxAge,
    nextChildRange,
    nextChildStartAge,
    nextChildEndAge,
    adultAge,
    adultStartAge,
    adultRate,
  } = extractSurchargeValues(sortedSurchargeKeys, surchargeRates || {});

  const benefits: Benefit[] = [
    {
      contentTooltip: "Hoàn huỷ một phần",
      titleTooltip: (
        <ul style={{ paddingLeft: 10 }}>
          <li>
            Quý khách sẽ được hoàn tiền 100% nếu hủy đặt phòng trước 5 ngày so
            với ngày nhận phòng.
          </li>
          <li>
            Quý khách sẽ được hoàn tiền 50% nếu hủy đặt phòng trước 3 ngày so
            với ngày nhận phòng.
          </li>
          <li>Các trường hợp hủy sau thời hạn trên sẽ không được hoàn tiền.</li>
        </ul>
      ),
    },
    {
      contentTooltip: "Chính sách đặt phòng & phụ thu",
      titleTooltip: (
        <span>
          <p>Trẻ em lớn hơn {adultStartAge} tuổi sẽ được xem như người lớn</p>
          <p>
            Quý khách hàng vui lòng nhập đúng số lượng khách và tuổi để có giá
            chính xác
          </p>
          <div>
            <ul style={{ listStyle: "none", paddingInlineStart: 0 }}>
              <li style={{ paddingLeft: "10px" }}>
                <span>
                  Phụ thu người lớn sẽ bị tính phí{" "}
                  {formatCurrency(roomType?.effective_price * adultRate)}.
                </span>
              </li>
              <li style={{ paddingLeft: "10px" }}>
                <span>Phụ thu trẻ em:</span>
              </li>
              {surchargeRates && (
                <ul style={{ paddingLeft: "20px" }}>
                  <li>
                    <span>
                      Miễn phí {roomType.max_children} trẻ dưới{" "}
                      {freeChildMaxAge} tuổi, từ trẻ thứ{" "}
                      {roomType.max_children + 1} sẽ bị tính phí{" "}
                      {formatCurrency(
                        roomType?.effective_price *
                          surchargeRates[nextChildRange]
                      )}
                    </span>
                  </li>
                  <li>
                    <span>
                      Trẻ từ {nextChildStartAge} tuổi đến {nextChildEndAge} tuổi
                      sẽ bị tính phí{" "}
                      {formatCurrency(
                        roomType?.effective_price *
                          surchargeRates[nextChildRange]
                      )}
                      .
                    </span>
                  </li>
                  <li>
                    <span>
                      Trẻ từ {adultStartAge} tuổi trở lên sẽ bị tính phí như
                      người lớn{" "}
                      {formatCurrency(roomType?.effective_price * adultRate)}
                    </span>
                  </li>
                </ul>
              )}
            </ul>
          </div>
        </span>
      ),
    },
  ];

  if (roomType.free_breakfast) {
    benefits.splice(1, 0, {
      contentTooltip: "Giá đã bao gồm bữa sáng",
      titleTooltip: (
        <span>
          Giá đã bao gồm bữa sáng cho tất cả thành viên trong phòng (không tính
          người ở thêm)
        </span>
      ),
    });
  }

  return benefits;
};

const RoomTypeList: FC<RoomTypeListProps> = ({
  hotelData = {},
  roomTypes = [],
  setRoomTypes,
  numNights,
  customerRequest,
  roomRefs,
}) => {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);

  const dispatch: AppDispatch = useAppDispatch();
  const { isLoggedIn, customer_id } = useAppSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();

  const {
    checkIn,
    checkOut,
    numAdults,
    numRooms,
    numChildren,
    childrenAges,
    hotelId,
  } = customerRequest;

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

  const handleNavigateBooking = (roomTypeId: string) => {
    const searchParams = new URLSearchParams({
      roomTypeId: roomTypeId,
      hotelId: hotelId.toString(),
      checkIn: checkIn,
      checkOut: checkOut,
      numRooms: numRooms.toString(),
      numNights: numNights.toString(),
      numAdults: numAdults.toString(),
      numChildren: numChildren.toString(),
      childrenAges: childrenAges.join(","),
    });

    router.push(`/hotel/booking?${searchParams.toString()}`, { scroll: true });
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
          {/* <Box
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
          </Box> */}
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {/* Display hotels as cards */}
          {roomTypes.length > 0 &&
            roomTypes?.map((roomType: IRoomType) => (
              <Grid
                item
                xs={12}
                key={roomType?.id}
                ref={(el) => {
                  if (roomRefs.current) {
                    roomRefs.current[roomType.id] = el;
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
                      roomType?.roomTypeImages?.filter(
                        (image: { [key: string]: any }) =>
                          image.is_primary === true
                      )[0]?.url || FALLBACK_URL.HOTEL_NO_IMAGE;
                    const discountPercent = Math.floor(
                      (roomType?.room_discount / roomType.base_price) * 100
                    );
                    const benefits = roomBenefits(roomType, hotelData);

                    return (
                      <Grid container spacing={2}>
                        <Grid item sm={12} md={2.5}>
                          <CardMedia
                            component="img"
                            src={room_type_avatar}
                            alt={roomType?.name}
                            sx={{
                              height: "150px",
                              objectFit: "cover",
                              borderRadius: 1,
                            }}
                          />
                          <RoomAmenitiesList
                            roomTypeAmenities={roomType?.roomTypeAmenities}
                          />
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
                                {roomType?.name}
                              </Typography>
                              <Box
                                sx={{
                                  color: "#4A5568",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
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
                                    {roomType?.standard_occupant} người
                                    <CustomizedTooltip
                                      title={
                                        <ul style={{ paddingLeft: 10 }}>
                                          <li>
                                            Sức chứa tối đa của phòng{" "}
                                            {roomType?.max_occupant}
                                          </li>
                                          <li>
                                            Sức khách tiêu chuẩn{" "}
                                            {roomType?.standard_occupant}
                                          </li>
                                          <li>
                                            Cho phép ở thêm{" "}
                                            {roomType?.max_extra_bed > 0 &&
                                              `${roomType?.max_extra_bed} người lớn`}{" "}
                                            {roomType?.max_children > 0 &&
                                              `${roomType?.max_children} trẻ em`}{" "}
                                            thoả mãn {roomType?.max_occupant}{" "}
                                            khách tối đa có thể mất thêm phí
                                          </li>
                                          <li>
                                            Chi tiết phí phụ thu vui lòng xem
                                            tại{" "}
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
                                          Diện tích phòng: {roomType?.area}
                                          m&sup2;
                                        </span>
                                      }
                                      content={
                                        <Typography variant="body1">
                                          &nbsp;{roomType?.area}m&sup2;
                                        </Typography>
                                      }
                                    />
                                  </Box>

                                  {roomType?.views?.length > 0 && (
                                    <Box
                                      sx={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        pr: 3,
                                      }}
                                    >
                                      <VisibilityIcon sx={{ mr: 1 }} />
                                      <CustomizedTooltip
                                        title={
                                          <span>
                                            {roomType.views.join(", ")}
                                          </span>
                                        }
                                        content={
                                          <Typography variant="body1">
                                            {roomType.views.join(", ")}
                                          </Typography>
                                        }
                                      />
                                    </Box>
                                  )}
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  {roomType?.rooms.length > 0 &&
                                    roomType?.rooms.length <= 5 && (
                                      <Box
                                        sx={{
                                          color: "error.main",
                                          display: "flex",
                                          padding: 1,
                                          alignItems: "center",
                                          borderRadius: 1,
                                          bgcolor: "rgba(229, 62, 62, 0.1)",
                                        }}
                                      >
                                        <Icon sx={{ mr: 0.5 }}>
                                          <ErrorOutlineIcon />
                                        </Icon>
                                        <Typography>
                                          Chỉ còn {roomType?.rooms.length} phòng
                                          trống
                                        </Typography>
                                      </Box>
                                    )}
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
                                    {benefits.map((benefit, index) => (
                                      <ListItem key={index} sx={{ py: 0 }}>
                                        <ListItemIcon>
                                          <DoneIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                          <CustomizedTooltip
                                            title={benefit.titleTooltip}
                                            content={benefit.contentTooltip}
                                          />
                                        </ListItemText>
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
                                  {roomType?.beds?.map((bed: IBed) => (
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
                                  {roomType?.base_price !==
                                    roomType?.effective_price && (
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
                                        {formatCurrency(roomType?.base_price)}
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
                                    {formatCurrency(roomType?.effective_price)}
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
                                    onClick={() => {
                                      if (!isLoggedIn && !customer_id) {
                                        dispatch(
                                          openAlert({
                                            type: ALERT_TYPE.WARNING,
                                            message:
                                              "Vui lòng đăng nhập để đặt phòng.",
                                          })
                                        );
                                        return;
                                      }
                                      handleNavigateBooking(roomType.id);
                                    }}
                                  >
                                    Đặt phòng
                                  </Button>
                                  {roomType?.cost && (
                                    <Box
                                      sx={{
                                        cursor: "pointer",
                                        position: "relative",
                                        mt: "12px",
                                      }}
                                    >
                                      <LastPrice
                                        checkIn={customerRequest?.checkIn}
                                        numRooms={customerRequest?.numRooms}
                                        numNights={numNights}
                                        roomCost={roomType?.cost}
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
