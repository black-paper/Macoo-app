import {
  AccessTime as AccessTimeIcon,
  Build as BuildIcon,
  Cancel as CancelIcon,
  Comment as CommentIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Person as PersonIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Refresh as RefreshIcon,
  Restaurant as RestaurantIcon,
  Send as SendIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import RecipeImageCarousel from "../components/RecipeImageCarousel";
import { useRecipeDetail } from "../hooks";
import {
  formatDate,
  formatTime,
  getBgColor,
  getDifficultyLabel,
  getRecipeIcon,
  setPageTitle,
} from "../utils";

const RecipeDetail: React.FC = () => {
  const theme = useTheme();
  const { slug } = useParams<{ slug: string }>();
  const {
    recipe,
    loading,
    error,
    isLiked,
    showCommentForm,
    newComment,
    submittingComment,
    handleLike,
    toggleCommentForm,
    setNewComment,
    handleCommentSubmit,
    retryFetch,
  } = useRecipeDetail(slug);

  useEffect(() => {
    if (recipe) {
      setPageTitle(recipe.title);
    } else {
      setPageTitle("レシピ詳細");
    }
  }, [recipe]);

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

  if (error || !recipe) {
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
          {error || "レシピが見つかりません"}
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
        }}
      >
        <Container maxWidth="xl">
          {/* パンくずナビ */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 4 }}
          >
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
              ホーム
            </Link>
            <Link
              to="/recipes"
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
              }}
            >
              <RestaurantIcon sx={{ mr: 0.5, fontSize: 16 }} />
              レシピ一覧
            </Link>
            <Typography
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {recipe.title}
            </Typography>
          </Breadcrumbs>

          {/* レシピタイトルと基本情報 */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Chip
                label={recipe.category?.name}
                icon={<span>{getRecipeIcon(recipe.category?.iconName)}</span>}
                sx={{
                  backgroundColor: getBgColor(recipe.category?.colorCode),
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  px: 2,
                  py: 1,
                }}
              />
            </Box>
            <Typography
              variant="h2"
              sx={{ mb: 3, fontWeight: 700, maxWidth: 800, mx: "auto" }}
            >
              {recipe.title}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.8, mb: 4 }}
            >
              {recipe.description}
            </Typography>

            {/* メタ情報 */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 4,
                justifyItems: "center",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <AccessTimeIcon sx={{ mb: 1, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {formatTime(recipe.estimatedTimeMinutes)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Chip
                  label={getDifficultyLabel(recipe.difficulty)}
                  color={
                    recipe.difficulty === "beginner"
                      ? "success"
                      : recipe.difficulty === "intermediate"
                        ? "warning"
                        : "error"
                  }
                  sx={{ mb: 1, fontWeight: 600 }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Avatar sx={{ mb: 1, bgcolor: "primary.main" }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {recipe.author?.displayName}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* レシピ画像カルーセル */}
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            <RecipeImageCarousel title={recipe.title} />
          </Box>
        </Container>
      </Box>

      {/* メインコンテンツ */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 6,
          }}
        >
          {/* メインコンテンツ */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* 材料セクション */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <ShoppingCartIcon sx={{ mr: 2, color: "primary.main" }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    必要な材料
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 2,
                  }}
                >
                  {recipe.materials?.map((material) => (
                    <Paper
                      key={material.id}
                      variant="outlined"
                      sx={{
                        p: 3,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: "primary.light",
                        },
                      }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {material.name}
                        </Typography>
                        {material.notes && (
                          <Typography variant="body2" color="text.secondary">
                            {material.notes}
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="body1"
                        color="primary.main"
                        sx={{ fontWeight: 600 }}
                      >
                        {material.quantity}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* 道具セクション */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <BuildIcon sx={{ mr: 2, color: "secondary.main" }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    必要な道具
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 2,
                  }}
                >
                  {recipe.tools?.map((tool) => (
                    <Paper
                      key={tool.id}
                      variant="outlined"
                      sx={{
                        p: 3,
                        backgroundColor: tool.isEssential
                          ? "warning.light"
                          : "transparent",
                        border: tool.isEssential ? "2px solid" : "1px solid",
                        borderColor: tool.isEssential
                          ? "warning.main"
                          : "divider",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, flexGrow: 1 }}
                        >
                          {tool.name}
                        </Typography>
                        {tool.isEssential && (
                          <Chip
                            label="必須"
                            size="small"
                            color="warning"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Box>
                      {tool.notes && (
                        <Typography variant="body2" color="text.secondary">
                          {tool.notes}
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* 手順セクション */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <PlaylistAddCheckIcon sx={{ mr: 2, color: "success.main" }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    作り方
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {recipe.steps?.map((step) => (
                    <Paper
                      key={step.id}
                      variant="outlined"
                      sx={{ p: 4, borderRadius: 2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 3,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 48,
                            height: 48,
                            fontSize: "1.2rem",
                            fontWeight: 700,
                          }}
                        >
                          {step.stepNumber}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 600 }}
                          >
                            {step.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ mb: 2, lineHeight: 1.8 }}
                          >
                            {step.description}
                          </Typography>
                          {step.estimatedTimeMinutes && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "text.secondary",
                              }}
                            >
                              <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2">
                                約{step.estimatedTimeMinutes}分
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* サイドバー */}
          <Box
            sx={{
              position: "sticky",
              top: 24,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {/* いいねボタンとメタ情報 */}
            <Card>
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Button
                  onClick={handleLike}
                  variant={isLiked ? "contained" : "outlined"}
                  size="large"
                  startIcon={
                    isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />
                  }
                  fullWidth
                  sx={{ mb: 3, py: 2 }}
                >
                  いいね ({recipe.likesCount})
                </Button>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                    justifyItems: "center",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <VisibilityIcon sx={{ color: "text.secondary", mb: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.viewsCount}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <CommentIcon sx={{ color: "text.secondary", mb: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.commentsCount}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* 作者情報 */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  作者について
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      bgcolor: "primary.main",
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {recipe.author?.displayName}
                      </Typography>
                      {recipe.author?.isVerified && (
                        <Chip
                          label="認証済み"
                          size="small"
                          color="primary"
                          sx={{ ml: 1, fontSize: "0.7rem", height: 20 }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      @{recipe.author?.username}
                    </Typography>
                  </Box>
                </Box>
                {recipe.author?.bio && (
                  <Typography variant="body2" color="text.secondary">
                    {recipe.author.bio}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* タグ */}
            {recipe.tags && recipe.tags.length > 0 && (
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    タグ
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {recipe.tags.map((tag) => (
                      <Chip
                        key={tag.id}
                        label={`#${tag.name}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          "&:hover": {
                            backgroundColor: "primary.light",
                            cursor: "pointer",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>

        {/* コメントセクション */}
        <Box sx={{ mt: 8 }}>
          <Card>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <CommentIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  コメント ({recipe.commentsCount})
                </Typography>
              </Box>

              {/* コメント投稿フォーム */}
              <Box sx={{ mb: 4 }}>
                <Button
                  onClick={toggleCommentForm}
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  {showCommentForm ? "投稿をキャンセル" : "コメントを投稿"}
                </Button>

                {showCommentForm && (
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      placeholder="レシピの感想や質問をお聞かせください..."
                      value={newComment}
                      onChange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => setNewComment(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={toggleCommentForm}
                        startIcon={<CancelIcon />}
                      >
                        キャンセル
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleCommentSubmit}
                        disabled={submittingComment || !newComment.trim()}
                        startIcon={<SendIcon />}
                      >
                        {submittingComment ? "投稿中..." : "投稿する"}
                      </Button>
                    </Box>
                  </Paper>
                )}
              </Box>

              {/* コメント一覧 */}
              <Box>
                {recipe.comments?.map((comment) => (
                  <Box
                    key={comment.id}
                    sx={{
                      mb: 4,
                      pb: 4,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <PersonIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, mr: 2 }}
                          >
                            {comment.author?.displayName}
                          </Typography>
                          {comment.author?.isVerified && (
                            <Chip
                              label="認証済み"
                              size="small"
                              color="primary"
                              sx={{ mr: 2, fontSize: "0.7rem", height: 20 }}
                            />
                          )}
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                          {comment.content}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}

                {(!recipe.comments || recipe.comments.length === 0) && (
                  <Paper
                    sx={{
                      p: 6,
                      textAlign: "center",
                      backgroundColor: "grey.50",
                    }}
                  >
                    <CommentIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      まだコメントがありません
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      最初のコメントを投稿してみませんか？
                    </Typography>
                  </Paper>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default RecipeDetail;
