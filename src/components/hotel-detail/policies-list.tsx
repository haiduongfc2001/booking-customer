import React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

interface Policy {
  type: string;
  value: string | number;
  description?: string;
}

interface Props {
  policies: Policy[];
}

const HotelPolicies: React.FC<Props> = ({ policies }) => {
  const renderPolicyDescription = (type: string, value: any) => {
    switch (type) {
      case "TAX":
        return renderTaxPolicy(value);
      case "SERVICE_FEE":
        return renderServiceFeePolicy(value);
      case "CHECK_IN_TIME":
      case "CHECK_OUT_TIME":
        return renderCheckInOutPolicy(type, value);
      case "SURCHARGE_RATES":
        return (
          <Box p={1}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "text.secondary",
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              Chính sách trẻ em: &nbsp;
            </Typography>
            <Typography variant="body1">
              {parseSurchargeRates(value)}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderTaxPolicy = (value: any) => (
    <PolicyItem primary={`Thuế: ${value}%`} />
  );

  const renderServiceFeePolicy = (value: any) => (
    <PolicyItem primary={`Phí dịch vụ: ${value}%`} />
  );

  const renderCheckInOutPolicy = (type: string, value: any) => (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          borderLeft: "2px solid",
          borderLeftColor: "primary.main",
          pt: "0px !important",
        }}
      >
        <Box display="flex" flexDirection="column" p={1}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "text.secondary",
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            {type === "CHECK_IN_TIME" ? "Giờ nhận phòng" : "Giờ trả phòng"}
          </Typography>
          <Typography variant="body1">{value}</Typography>
        </Box>
      </Grid>
    </Grid>
  );

  const renderSurchargeRatesPolicy = (value: any) => (
    <PolicyItem
      primary="Chính sách trẻ em:"
      secondary={parseSurchargeRates(value)}
    />
  );

  const parseSurchargeRates = (value: string) => {
    try {
      const surchargeRates = JSON.parse(value);
      let description = "";
      Object.keys(surchargeRates).forEach((range, index) => {
        const rate = surchargeRates[range];
        const rangeText =
          range === "18"
            ? `Trên ${range} tuổi`
            : `Từ ${range} tuổi đến dưới ${range === "0" ? "4" : range}`;
        description += `${index > 0 ? "\n" : ""}${rangeText}: ${
          rate * 100
        }% tiền phòng`;
      });
      // return description;
      return "Trẻ em từ 13 tuổi sẽ được xem như người lớn. Quý khách hàng vui lòng nhập đúng số lượng khách và tuổi để có giá chính xác.";
    } catch (error) {
      console.error("Error parsing surcharge rates:", error);
      return "";
    }
  };

  const PolicyItem: React.FC<{ primary: string; secondary?: string }> = ({
    primary,
    secondary,
  }) => (
    <Box display="flex" p={1}>
      <Typography
        variant="subtitle1"
        sx={{
          color: "text.secondary",
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        {primary}
      </Typography>
      <Typography variant="body1">{secondary}</Typography>
    </Box>
  );

  return (
    <Box
      width="100%"
      bgcolor="#ffffff"
      margin="auto"
      marginTop="16px"
      padding="16px"
      borderRadius="8px"
      boxShadow="0px 5px 5px rgba(0, 0, 0, 0.1)"
    >
      <Typography variant="h5" mb={1}>
        Chính sách khách sạn
      </Typography>
      <List component="ul">
        {policies?.map((policy, index) => (
          <div key={index}>
            <ListItem>
              <ListItemText
                primary={
                  policy.description && !policy.value ? (
                    <Box
                      display="flex"
                      flexDirection="column"
                      bgcolor="background.paper"
                      p={1}
                      borderRadius={1}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "text.secondary",
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        {policy.type}
                      </Typography>
                      <Typography variant="body1">
                        {policy.description}
                      </Typography>
                    </Box>
                  ) : (
                    renderPolicyDescription(policy.type, policy.value)
                  )
                }
              />
            </ListItem>
            {index < policies?.length - 1 && <Divider component="li" />}
          </div>
        ))}
      </List>
    </Box>
  );
};

export default HotelPolicies;
