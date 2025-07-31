import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Nature as EcoIcon,
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { setPageTitle } from "../utils";

const Home: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    setPageTitle("エコフレンドリーなDIYレシピプラットフォーム");
  }, []);

  // モック人気レシピデータ
  const popularRecipes = [
    {
      id: "1",
      title: "ペットボトルで作るプランター",
      description:
        "使い終わったペットボトルを再利用して、おしゃれなプランターを作ります。",
      category: "ガーデニング",
      difficulty: "初級",
      likes: 42,
      views: 150,
      comments: 8,
      author: "田中みどり",
    },
    {
      id: "2",
      title: "古着から作るエコバッグ",
      description:
        "着なくなった服を再利用して、便利なエコバッグを作成しましょう。",
      category: "衣類・アクセサリー",
      difficulty: "初級",
      likes: 28,
      views: 89,
      comments: 5,
      author: "佐藤リサイクル",
    },
    {
      id: "3",
      title: "廃材で作るスマホスタンド",
      description:
        "木材の廃材を活用して、シンプルで機能的なスマホスタンドを作ります。",
      category: "インテリア",
      difficulty: "中級",
      likes: 35,
      views: 120,
      comments: 12,
      author: "山田木工",
    },
  ];

  const stats = [
    { label: "レシピ数", value: "500+", icon: <MenuBookIcon /> },
    { label: "ユーザー数", value: "2,000+", icon: <PeopleIcon /> },
    { label: "環境貢献度", value: "95%", icon: <EcoIcon /> },
    { label: "満足度", value: "4.8/5", icon: <StarIcon /> },
  ];

  return (
    <Box>
      {/* ヒーローセクション */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 700,
              mb: 4,
              background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            環境に優しい
            <Box component="span" sx={{ color: "primary.main" }}>
              DIY
            </Box>
            を
            <br />
            みんなでシェアしよう
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 6, lineHeight: 1.6, maxWidth: 600, mx: "auto" }}
          >
            Makeooは、手作りの楽しさと環境への配慮を両立する
            DIYレシピ投稿・閲覧プラットフォームです
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              component={Link}
              to="/recipes"
              variant="contained"
              size="large"
              endIcon={<AddIcon />}
              sx={{ px: 4, py: 2, fontSize: "1.1rem" }}
            >
              レシピを投稿する
            </Button>
            <Button
              component={Link}
              to="/recipes"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 4, py: 2, fontSize: "1.1rem" }}
            >
              レシピを探す
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 統計セクション */}
      <Box sx={{ py: 8, backgroundColor: "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ width: "100%" }}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    textAlign: "center",
                    p: 4,
                    backgroundColor: "transparent",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "primary.light",
                      borderColor: "primary.main",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { fontSize: 28, color: "primary.main" },
                    })}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 特徴紹介セクション */}
      <Box sx={{ py: 12, backgroundColor: "background.default" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            textAlign="center"
            sx={{ mb: 8, fontWeight: 700 }}
          >
            Makeooの特徴
          </Typography>
          <Grid container spacing={6} sx={{ width: "100%" }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 4,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <MenuBookIcon sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  豊富なレシピ
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.8 }}
                >
                  初心者から上級者まで、様々なレベルのDIYレシピを投稿・閲覧できます
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 4,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <EcoIcon sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  エコフレンドリー
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.8 }}
                >
                  環境に配慮した材料や手法を使ったDIYレシピに特化しています
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 4,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  コミュニティ
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.8 }}
                >
                  作り手同士が交流し、お互いのアイデアを共有できるコミュニティ
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 人気レシピセクション */}
      <Box sx={{ py: 12, backgroundColor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
              人気のレシピ
            </Typography>
            <Typography variant="h6" color="text.secondary">
              今週最も人気のDIYレシピをチェックしてみましょう
            </Typography>
          </Box>
          <Grid container spacing={4} sx={{ width: "100%" }}>
            {popularRecipes.map((recipe) => (
              <Grid size={{ xs: 12, md: 4 }} key={recipe.id}>
                <Card
                  component={Link}
                  to={`/recipes/${recipe.id}`}
                  sx={{
                    height: "100%",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MenuBookIcon sx={{ fontSize: 60, color: "white" }} />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Chip
                        label={recipe.category}
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={recipe.difficulty}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {recipe.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      {recipe.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            mr: 1,
                            fontSize: "0.8rem",
                          }}
                        >
                          {recipe.author.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {recipe.author}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ThumbUpIcon
                            sx={{
                              fontSize: 16,
                              mr: 0.5,
                              color: "text.secondary",
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {recipe.likes}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <VisibilityIcon
                            sx={{
                              fontSize: 16,
                              mr: 0.5,
                              color: "text.secondary",
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {recipe.views}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              component={Link}
              to="/recipes"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
            >
              すべてのレシピを見る
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTAセクション */}
      <Box
        sx={{
          py: 12,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
            あなたもレシピを投稿してみませんか？
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 6, opacity: 0.9, lineHeight: 1.8 }}
          >
            環境に優しいDIYアイデアを世界中の人と共有して、
            持続可能な未来を一緒に作りましょう。
          </Typography>
          <Button
            component={Link}
            to="/recipes"
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "white",
              color: "primary.main",
              px: 4,
              py: 2,
              fontSize: "1.1rem",
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            レシピを投稿する
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
