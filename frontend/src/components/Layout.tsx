import {
  Add as AddIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Instagram as InstagramIcon,
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: "ホーム", path: "/", icon: <HomeIcon /> },
    { text: "レシピ一覧", path: "/recipes", icon: <RestaurantIcon /> },
    { text: "Makeooとは", path: "/about", icon: <InfoIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          Makeoo
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemText>
              <Button
                component={Link}
                to={item.path}
                fullWidth
                startIcon={item.icon}
                sx={{
                  justifyContent: "flex-start",
                  py: 2,
                  px: 3,
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "text.primary",
                  backgroundColor:
                    location.pathname === item.path
                      ? "primary.light"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
                onClick={handleDrawerToggle}
              >
                {item.text}
              </Button>
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          size="large"
          onClick={handleDrawerToggle}
        >
          レシピを投稿
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ height: 80 }}>
            {/* ロゴ */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                mr: "auto",
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: "primary.main",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: { xs: 0, sm: 2 },
                }}
              >
                <RestaurantIcon sx={{ color: "white", fontSize: 28 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Makeoo
              </Typography>
            </Box>

            {/* デスクトップナビゲーション */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      color:
                        location.pathname === item.path
                          ? "primary.main"
                          : "text.primary",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="large"
                  sx={{ ml: 2 }}
                >
                  レシピを投稿
                </Button>
              </Box>
            )}

            {/* モバイルメニューボタン */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="メニューを開く"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ color: "text.primary" }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* モバイルドロワー */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* メインコンテンツ */}
      <Box component="main" sx={{ flexGrow: 1, pt: "80px" }}>
        <Outlet />
      </Box>

      {/* フッター */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "grey.900",
          color: "white",
          py: 8,
          mt: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            {/* ブランド */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: "primary.main",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                  }}
                >
                  <RestaurantIcon sx={{ color: "white", fontSize: 32 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Makeoo
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "grey.300",
                  lineHeight: 1.8,
                  maxWidth: 400,
                }}
              >
                環境に優しいDIYレシピを通じて、持続可能な暮らしを提案するプラットフォームです。
                手作りの楽しさと環境への配慮を両立しましょう。
              </Typography>
            </Grid>

            {/* リンク */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                サイトマップ
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: "grey.300",
                      justifyContent: "flex-start",
                      "&:hover": {
                        color: "white",
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                <Button
                  href="#"
                  sx={{
                    color: "grey.300",
                    justifyContent: "flex-start",
                    "&:hover": {
                      color: "white",
                    },
                  }}
                >
                  利用規約
                </Button>
                <Button
                  href="#"
                  sx={{
                    color: "grey.300",
                    justifyContent: "flex-start",
                    "&:hover": {
                      color: "white",
                    },
                  }}
                >
                  プライバシーポリシー
                </Button>
              </Box>
            </Grid>

            {/* SNS */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                フォローする
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <IconButton
                  href="#"
                  sx={{
                    color: "grey.300",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "grey.800",
                    },
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  href="#"
                  sx={{
                    color: "grey.300",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "grey.800",
                    },
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  href="#"
                  sx={{
                    color: "grey.300",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "grey.800",
                    },
                  }}
                >
                  <YouTubeIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          {/* コピーライト */}
          <Divider sx={{ my: 6, borderColor: "grey.800" }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "grey.400" }}>
              © 2024 Makeoo. All rights reserved. Made with ❤️ for sustainable
              living.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
