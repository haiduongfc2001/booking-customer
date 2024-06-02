"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { usePathname, useRouter } from "next/navigation";

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
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
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ my: 2, p: 3, bgcolor: "background.paper", borderRadius: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface CustomizedTabsProps {
  tabs: TabInfo[];
}

export default function CustomizedTabs({ tabs }: CustomizedTabsProps) {
  // Destructure the tabs prop
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = React.useState(() => {
    const index = tabs?.findIndex((tab) => tab.href === pathname);
    return index === -1 ? 0 : index;
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push(tabs[newValue].href);
  };

  return (
    <Box sx={{ width: "100%", my: 3 }}>
      <Box sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="tabs account management"
        >
          {tabs?.length > 0 &&
            tabs.map((tab, index) => (
              <StyledTab key={tab.id} label={tab.label} {...a11yProps(index)} />
            ))}
        </StyledTabs>
      </Box>
      {tabs?.length > 0 &&
        tabs.map((tab, index) => (
          <CustomTabPanel key={tab.id} value={value} index={index}>
            {tab.content}
          </CustomTabPanel>
        ))}
    </Box>
  );
}
