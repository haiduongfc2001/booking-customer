import { BankTransferIcon, MomoIcon, ZaloPayIcon } from "@/constant/icons";
import QrCodeOutlinedIcon from "@mui/icons-material/QrCodeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";

export const paymentMethodsList: any[] = [
  // {
  //   name: "Chuyển khoản (Việt QR miễn phí)",
  //   icon: <BankTransferIcon />,
  //   code: "VIETQR",
  // },
  // {
  //   name: "Vnpay QR",
  //   icon: <QrCodeOutlinedIcon />,
  //   code: "VNPAYQR",
  // },
  // {
  //   name: "ATM/Internet Banking",
  //   icon: <CreditCardOutlinedIcon />,
  //   code: "ATM/INTERNET_BANKING",
  // },
  {
    name: "ZaloPay",
    icon: <ZaloPayIcon />,
    code: "ZALOPAY",
  },
  // {
  //   name: "Momo",
  //   icon: <MomoIcon />,
  //   code: "MOMO",
  // },
];
