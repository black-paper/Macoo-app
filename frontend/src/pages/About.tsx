import {
  Park as EcoIcon,
  Favorite as FavoriteIcon,
  Lightbulb as LightbulbIcon,
  Nature as NatureIcon,
  People as PeopleIcon,
  Public as PublicIcon,
  Recycling as RecyclingIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  Container,
  Paper,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { setPageTitle } from "../utils";

const About: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    setPageTitle("Makeooとは");
  }, []);

  const features = [
    {
      icon: <EcoIcon />,
      title: "環境に優しい",
      description:
        "廃材や不用品を活用したエコフレンドリーなDIYレシピを提案し、環境への負荷を削減します。",
    },
    {
      icon: <LightbulbIcon />,
      title: "創造性を刺激",
      description:
        "アイデアあふれるDIYプロジェクトで、あなたの創造力を最大限に引き出します。",
    },
    {
      icon: <PeopleIcon />,
      title: "コミュニティ",
      description:
        "同じ志を持つ仲間たちと交流し、お互いのアイデアを共有できるプラットフォームです。",
    },
  ];

  const values = [
    {
      icon: <RecyclingIcon />,
      title: "持続可能性",
      description: "資源を無駄にしない、循環型社会の実現を目指します。",
    },
    {
      icon: <NatureIcon />,
      title: "自然との調和",
      description:
        "自然環境を大切にし、地球に優しいライフスタイルを推進します。",
    },
    {
      icon: <TrendingUpIcon />,
      title: "継続的改善",
      description:
        "常により良いサービスを提供するため、継続的な改善を心がけています。",
    },
  ];

  const stats = [
    { number: "500+", label: "レシピ数", color: "primary" },
    { number: "2,000+", label: "ユーザー数", color: "secondary" },
    { number: "95%", label: "満足度", color: "success" },
    { number: "10,000kg", label: "削減CO2", color: "warning" },
  ];

  return (
    <Box>
      {/* ヘッダーセクション */}
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
              fontSize: { xs: "3rem", md: "4.5rem" },
              fontWeight: 700,
              mb: 4,
              background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Makeooとは
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}
          >
            環境に優しいDIYレシピを通じて、持続可能な暮らしを提案するプラットフォームです
          </Typography>
        </Container>
      </Box>

      {/* ミッションセクション */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: 8,
            borderRadius: 4,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 6,
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.light",
                color: "primary.main",
              }}
            >
              <FavoriteIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              私たちのミッション
            </Typography>
          </Box>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ lineHeight: 2, mb: 4 }}
          >
            Makeooは「Make
            eco」、つまり「エコを作ろう」という想いから生まれました。
            日々の生活の中で出る廃材や不用品を、創造性豊かなDIYプロジェクトに変身させることで、
            環境への負荷を減らしながら、手作りの喜びを分かち合うことを目指しています。
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.8 }}
          >
            私たちは、小さな行動が大きな変化を生み出すと信じています。
            一人ひとりの創造性と環境への配慮が集まることで、より良い未来を築いていけるのです。
          </Typography>
        </Paper>
      </Container>

      {/* 統計セクション */}
      <Box sx={{ backgroundColor: "background.default", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ mb: 8, fontWeight: 700 }}
          >
            数字で見るMakeoo
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 4,
            }}
          >
            {stats.map((stat, index) => (
              <Card
                key={index}
                sx={{
                  textAlign: "center",
                  p: 4,
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: `${stat.color}.main`,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 特徴セクション */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography
          variant="h3"
          textAlign="center"
          sx={{ mb: 8, fontWeight: 700 }}
        >
          Makeooの特徴
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 6,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
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
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "primary.light",
                  color: "primary.main",
                  mx: "auto",
                  mb: 3,
                }}
              >
                {React.cloneElement(feature.icon, { sx: { fontSize: 40 } })}
              </Avatar>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                {feature.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                {feature.description}
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* 価値観セクション */}
      <Box sx={{ backgroundColor: "background.default", py: 12 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ mb: 8, fontWeight: 700 }}
          >
            私たちの価値観
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 6,
            }}
          >
            {values.map((value, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  textAlign: "center",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "secondary.light",
                    color: "secondary.main",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  {React.cloneElement(value.icon, { sx: { fontSize: 32 } })}
                </Avatar>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {value.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {value.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ビジョンセクション */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: 8,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
            textAlign: "center",
            color: "white",
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "white",
              color: "primary.main",
              mx: "auto",
              mb: 4,
            }}
          >
            <PublicIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 700 }}>
            未来への想い
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 800, mx: "auto", lineHeight: 2, opacity: 0.95 }}
          >
            私たちは、Makeooを通じて世界中の人々が環境に配慮したライフスタイルを送り、
            創造性を発揮できる社会を実現したいと考えています。
            一つひとつのDIYプロジェクトが、地球の未来を明るくする力になると信じています。
          </Typography>
        </Paper>
      </Container>

      {/* チームセクション */}
      <Box sx={{ backgroundColor: "background.default", py: 12 }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ mb: 8, fontWeight: 700 }}
          >
            一緒に作りましょう
          </Typography>
          <Card sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
              あなたも参加しませんか？
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8, mb: 4 }}
            >
              Makeooは、環境に優しいDIYを愛するすべての人々に開かれたプラットフォームです。
              あなたのアイデアや経験を共有して、一緒により良い世界を作りましょう。
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: "primary.main" }}
            >
              持続可能な未来は、一人ひとりの小さな行動から始まります。
            </Typography>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
