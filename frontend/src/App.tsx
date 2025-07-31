import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Recipes from "./pages/Recipes";
import muiTheme from "./theme/muiTheme";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipes/:slug" element={<RecipeDetail />} />
            <Route path="about" element={<About />} />
            {/* 404ページ */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

// 404 Not Foundページコンポーネント
import { ArrowBack, Home as HomeIcon } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 8,
        }}
      >
        <Box>
          <Box
            sx={{
              width: 96,
              height: 96,
              backgroundColor: "primary.light",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 4,
            }}
          >
            <HomeIcon sx={{ fontSize: 48, color: "primary.main" }} />
          </Box>
          <Typography variant="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h4" color="text.secondary" gutterBottom>
            ページが見つかりません
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
          >
            申し訳ございませんが、お探しのページは存在しないか、移動した可能性があります。
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
              size="large"
            >
              前のページに戻る
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              size="large"
            >
              ホームに戻る
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
