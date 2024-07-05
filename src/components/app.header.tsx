"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Avatar, Button, ListItemIcon, Tooltip, styled } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HotelIcon from "@mui/icons-material/Hotel";
import { logout } from "@/redux/slices/auth-slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import { usePopover } from "@/lib/use-popover";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { openAlert } from "@/redux/slices/alert-slice";
import { ALERT_TYPE } from "@/constant/constants";

const pages = ["Đơn đặt phòng", "Khách sạn yêu thích", "Tài khoản"];

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const router = useRouter();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const accountPopover = usePopover();

  const dispatch: AppDispatch = useAppDispatch();
  const { isLoggedIn, email, customer_id, avatar } = useAppSelector(
    (state: RootState) => state.auth
  );

  const settings = [
    {
      label: "Tài khoản",
      action: () => handleProfileAction("Tài khoản"),
      icon: <AccountCircleIcon />,
    },
    {
      label: "Đăng xuất",
      action: () => handleLogoutAction(),
      icon: <LogoutIcon />,
    },
  ];

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleProfileAction = (action: string) => {
    setAnchorEl(null);
    router.push("/account");
  };

  const handleLogoutAction = () => {
    setAnchorEl(null);
    dispatch(logout());
    dispatch(
      openAlert({
        type: ALERT_TYPE.SUCCESS,
        message: "Đăng xuất thành công.",
      })
    );
    router.push("/login");
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const StyledMenu = styled(Menu)(({ theme }) => ({
    mt: "45px",
    "& .MuiPaper-root": {
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[5],
      minWidth: 120,
      backgroundColor: theme.palette.background.paper,
    },
    "& .MuiMenu-list": {
      padding: theme.spacing(1),
    },
  }));

  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      borderRadius: theme.shape.borderRadius,
      "& .MuiTypography-root": {
        color: theme.palette.primary.contrastText,
      },
      "& .MuiListItemIcon-root": {
        color: theme.palette.primary.contrastText,
      },
    },
    "& .MuiTypography-root": {
      fontWeight: theme.typography.fontWeightMedium,
    },
  }));

  const renderMenu = (
    <StyledMenu
      sx={{ mt: "45px" }}
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {settings.map((setting) => (
        <StyledMenuItem key={setting.label} onClick={setting.action}>
          <ListItemIcon>{setting.icon}</ListItemIcon>
          <Typography textAlign="center">{setting.label}</Typography>
        </StyledMenuItem>
      ))}
    </StyledMenu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => router.push("/account/my-booking")}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <ShoppingCartIcon />
        </IconButton>
        <p>Đơn đặt phòng</p>
      </MenuItem>
      <MenuItem onClick={() => router.push("/account/favorite-hotel")}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <HotelIcon />
        </IconButton>
        <p>Khách sạn yêu thích</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="small"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <Avatar
            sx={{
              cursor: "pointer",
              height: 40,
              width: 40,
            }}
            alt={email ?? "User Avatar"}
            src={avatar ?? undefined}
          />
        </IconButton>
        <p>Hồ sơ</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, maxHeight: "64px" }}>
      <AppBar position="static">
        <Toolbar sx={{ bgcolor: "background.paper", color: "black" }}>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {/* {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))} */}

              <MenuItem onClick={() => router.push("/account/my-booking")}>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <ShoppingCartIcon />
                </IconButton>
                <p>Đơn đặt phòng</p>
              </MenuItem>
              <MenuItem onClick={() => router.push("/account/favorite-hotel")}>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <HotelIcon />
                </IconButton>
                <p>Khách sạn yêu thích</p>
              </MenuItem>
              <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                  size="small"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar
                    sx={{
                      cursor: "pointer",
                      height: 40,
                      width: 40,
                    }}
                    alt={email ?? "User Avatar"}
                    src={avatar ?? undefined}
                  />
                </IconButton>
                <p>Hồ sơ</p>
              </MenuItem>
            </Menu>
          </Box>
          <Link href="/" passHref>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <HotelIcon
                sx={{ display: "flex", mr: 1, width: "40px", height: "40px" }}
              />
              <Typography
                variant="h5"
                noWrap
                component="span"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                  textTransform: "uppercase",
                }}
              >
                DHD
              </Typography>
            </Box>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          {isLoggedIn && customer_id ? (
            <>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* <IconButton
   size="large"
   aria-label="show 4 new mails"
   color="inherit"
 >
   <Badge badgeContent={4} color="error">
     <MailIcon />
   </Badge>
 </IconButton>
 <IconButton
   size="large"
   aria-label="show 17 new notifications"
   color="inherit"
 >
   <Badge badgeContent={17} color="error">
     <NotificationsIcon />
   </Badge>
 </IconButton> */}
                <Button
                  variant="text"
                  color="primary"
                  size="medium"
                  sx={{
                    width: "fit-content",
                    height: "fit-content",
                  }}
                  onClick={() => router.push("/account/my-booking")}
                >
                  Đơn đặt phòng
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  size="medium"
                  sx={{
                    width: "fit-content",
                    height: "fit-content",
                  }}
                  onClick={() => router.push("/account/favorite-hotel")}
                >
                  Khách sạn yêu thích
                </Button>

                <Tooltip title="Cài đặt tài khoản">
                  <>
                    <Button
                      variant="text"
                      size="medium"
                      sx={{
                        width: "fit-content",
                        height: "fit-content",
                        color: "neutral.900",
                        "&:hover": {
                          color: "primary.main",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => router.push("/account")}
                    >
                      {email}
                    </Button>
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                      sx={{
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          cursor: "pointer",
                          height: 40,
                          width: 40,
                        }}
                        alt={email ?? "User Avatar"}
                        src={avatar ?? undefined}
                      />
                    </IconButton>
                  </>
                </Tooltip>
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => router.push("/login")}
              >
                Đăng nhập
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
