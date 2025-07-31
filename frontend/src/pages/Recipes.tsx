import {
  AccessTime as AccessTimeIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  ThumbUp as ThumbUpIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecipes } from "../hooks";
import { type Recipe } from "../services/api";
import {
  formatTime,
  getBgColor,
  getDifficultyLabel,
  getRecipeIcon,
  setPageTitle,
} from "../utils";

const Recipes: React.FC = () => {
  const theme = useTheme();
  const {
    recipes,
    categories,
    loading,
    error,
    pagination,
    selectedCategory,
    selectedLevel,
    setSelectedCategory,
    setSelectedLevel,
    retryFetch,
  } = useRecipes();

  useEffect(() => {
    setPageTitle("レシピ一覧");
  }, []);

  const difficultyOptions = [
    { value: "all", label: "すべての難易度" },
    { value: "beginner", label: "初級" },
    { value: "intermediate", label: "中級" },
    { value: "advanced", label: "上級" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          レシピを読み込んでいます...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={retryFetch}
              startIcon={<RefreshIcon />}
            >
              再試行
            </Button>
          }
        >
          <AlertTitle>エラーが発生しました</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* ヘッダーセクション */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
          py: { xs: 6, md: 8 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
            レシピ一覧
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.8 }}
          >
            環境に優しいDIYレシピをカテゴリや難易度から探してみましょう。
            あなたの創造力を刺激する素敵なアイデアがきっと見つかります。
          </Typography>
        </Container>
      </Box>

      {/* フィルターとコンテンツセクション */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* フィルター */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 6,
            backgroundColor: "grey.50",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <FilterListIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              フィルター
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ width: "100%" }}>
            {/* カテゴリフィルター */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>カテゴリで絞り込み</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="カテゴリで絞り込み"
                >
                  <MenuItem value="all">すべてのカテゴリ</MenuItem>
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.slug}>
                        {getRecipeIcon(category.iconName)} {category.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 難易度フィルター */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>難易度で絞り込み</InputLabel>
                <Select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  label="難易度で絞り込み"
                >
                  {difficultyOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* レシピ一覧 */}
        <Grid container spacing={4} sx={{ width: "100%" }}>
          {recipes.map((recipe: Recipe) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={recipe.id}>
              <Card
                component={Link}
                to={`/recipes/${recipe.slug}`}
                sx={{
                  height: "100%",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                {/* レシピ画像 */}
                <CardMedia
                  sx={{
                    height: 200,
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 60,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {getRecipeIcon(recipe.category?.iconName)}
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                    }}
                  >
                    <Chip
                      label={getDifficultyLabel(recipe.difficulty)}
                      color={
                        getDifficultyColor(recipe.difficulty) as
                          | "success"
                          | "warning"
                          | "error"
                          | "default"
                      }
                      size="small"
                      sx={{ color: "white", fontWeight: 600 }}
                    />
                  </Box>
                </CardMedia>

                <CardContent sx={{ p: 3 }}>
                  {/* カテゴリとタグ */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Chip
                      label={recipe.category?.name}
                      size="small"
                      sx={{
                        backgroundColor: getBgColor(recipe.category?.colorCode),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* タイトルと説明 */}
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {recipe.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      lineHeight: 1.6,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {recipe.description}
                  </Typography>

                  {/* メタ情報 */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTimeIcon
                        sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatTime(recipe.estimatedTimeMinutes)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ThumbUpIcon
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {recipe.likesCount}
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
                          {recipe.viewsCount}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* 作者情報 */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{ width: 24, height: 24, mr: 1, fontSize: "0.8rem" }}
                    >
                      {recipe.author?.displayName?.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {recipe.author?.displayName}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* レシピが見つからない場合 */}
        {recipes.length === 0 && (
          <Paper
            sx={{
              p: 8,
              textAlign: "center",
              backgroundColor: "grey.50",
              borderRadius: 3,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              レシピが見つかりませんでした
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              検索条件を変更して再度お試しください。
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
            >
              フィルターをリセット
            </Button>
          </Paper>
        )}

        {/* ページネーション */}
        {pagination?.totalPages && pagination.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              color="primary"
              size="large"
              variant="outlined"
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Recipes;
