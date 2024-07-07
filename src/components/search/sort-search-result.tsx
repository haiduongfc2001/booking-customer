"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { PAGINATION } from "@/constant/constants";

interface StyledTabsProps {
  children?: React.ReactNode;
  value: any;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
    backgroundColor: "#635ee7",
  },
});

interface StyledTabProps {
  label: string;
  value: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontSize: theme.typography.pxToRem(15),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  fontWeight: 600,
  lineHeight: "17px",
  color: "#111927",
  borderRadius: 8,
  "&.Mui-selected": {
    opacity: 1,
    color: "#6366F1",
    backgroundColor: "#edf0ff",
    border: "1px solid #EBEEFE",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#edf0ff",
  },
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface CustomizedTabsProps {
  tabs: { id: number; label: string; value: string }[];
  sortOption: string;
  setSortOption: (value: string) => void;
  setPage: (value: number) => void;
}

export default function CustomizedSortOptionTabs({
  tabs,
  sortOption = "RELEVANT",
  setSortOption,
  setPage,
}: CustomizedTabsProps) {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSortOption(newValue);
    setPage(PAGINATION.INITIAL_PAGE);
  };

  return (
    <Box sx={{ width: "100%", m: 2 }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 1,
          "& .MuiTabs-flexContainer": {
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <StyledTabs
          value={sortOption}
          onChange={handleChange}
          aria-label="tabs sort hotel"
        >
          {tabs?.length > 0 &&
            tabs.map((tab, index) => (
              <StyledTab
                key={tab.id}
                label={tab.label}
                value={tab.value}
                {...a11yProps(index)}
                sx={{
                  borderRight: "1px solid rgb(226, 232, 240)",
                  ml: "0px !important",
                  width: "20%",
                }}
              />
            ))}
        </StyledTabs>
      </Box>
    </Box>
  );
}
