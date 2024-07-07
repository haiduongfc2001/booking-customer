import { useRouter } from "next/navigation";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  styled,
} from "@mui/material";
import { RootState, useAppSelector } from "@/redux/store/store";
import dayjs from "dayjs";

interface ProvinceCardProps {
  province: string;
  lable: string;
  imageUrl: string;
}

const CircleCard = styled(Card)(({ theme }) => ({
  borderRadius: "50%",
  textAlign: "center",
  overflow: "hidden",
  width: 200,
  height: 200,
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    width: 150,
    height: 150,
  },
  transition: "transform 0.3s ease-in-out",
  "&:hover, &:focus": {
    transform: "scale(1.05)",
  },
}));

const CircleCardMedia = styled(CardMedia)({
  height: "100%",
  width: "100%",
  objectFit: "cover",
});

const ProvinceCard: React.FC<ProvinceCardProps> = ({
  province,
  lable,
  imageUrl,
}) => {
  const router = useRouter();
  const { checkIn, checkOut, numAdults, numChildren, childrenAges, numRooms } =
    useAppSelector((state: RootState) => state.search);

  const handleCardClick = () => {
    const formattedCheckIn = dayjs(checkIn).format("YYYY-MM-DD");
    const formattedCheckOut = dayjs(checkOut).format("YYYY-MM-DD");

    const searchQueryParams = new URLSearchParams({
      location: lable,
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      numAdults: String(numAdults),
      numChildren: String(numChildren),
      childrenAges: childrenAges.join(","),
      numRooms: String(numRooms),
    }).toString();

    router.push(`/search?${searchQueryParams}`, { scroll: true });
  };

  return (
    <CircleCard
      sx={{
        "& .MuiButtonBase-root.MuiCardActionArea-root": {
          height: "100%",
          width: "100%",
        },
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CircleCardMedia
          // component="img"
          image={imageUrl}
          title={province}
          sx={{ width: "100%" }}
        />
        <CardContent
          sx={{
            position: "absolute",
            p: 2.5,
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            transition: "background-color 0.3s ease-in-out",
            "&:hover, &:focus": {
              bgcolor: "rgba(0,0,0,0.8)",
            },
          }}
        >
          <Typography gutterBottom variant="h6" component="div" color="white">
            {province}
          </Typography>
        </CardContent>
      </CardActionArea>
    </CircleCard>
  );
};

const provinces = [
  {
    name: "Hà Nội",
    lable: "Thành phố Hà Nội",
    imageUrl:
      "https://lh5.googleusercontent.com/p/AF1QipN3-_0wrzFsf30vYg5nR6mwLroFyNp-qYsnV6B6=w540-h312-n-k-no",
  },
  {
    name: "Hồ Chí Minh",
    lable: "Thành phố Hồ Chí Minh",
    imageUrl:
      "https://bcp.cdnchinhphu.vn/334894974524682240/2022/12/23/dien-tich-cac-quan-tai-ho-chi-minh-1-16717832922811126226268.jpg",
  },
  {
    name: "Đà Nẵng",
    lable: "Thành phố Đà Nẵng",
    imageUrl:
      "https://vcdn1-dulich.vnecdn.net/2022/06/03/cauvang-1654247842-9403-1654247849.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=Swd6JjpStebEzT6WARcoOA",
  },
  {
    name: "Thanh Hóa",
    lable: "Tỉnh Thanh Hóa",
    imageUrl:
      "https://bcp.cdnchinhphu.vn/334894974524682240/2023/2/27/thanhphothanhhoa-16774897649251166490864.jpg",
  },
];

const Provinces: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: "20px", md: "60px" },
        py: "40px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography
        variant="h5"
        sx={{ marginBottom: "16px", fontWeight: "bold", color: "#333" }}
      >
        Điểm đến yêu thích
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ marginBottom: "32px", color: "#666" }}
      >
        Địa điểm hot nhất do DHDBooking đề xuất
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {provinces.map((province) => (
          <ProvinceCard
            key={province.name}
            province={province.name}
            lable={province.lable}
            imageUrl={province.imageUrl}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Provinces;
