import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Divider,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocationOn, BoltOutlined } from "@mui/icons-material";
import { Columns4 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";
import { useNavigate } from "react-router-dom";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  width: "100%",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: "56.25%",
  position: "relative",
  minHeight: "120px",
});

const StatusChip = styled(Chip)(({ theme, status }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: status === "Active" ? "#4CAF50" : "#FF9800",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  fontSize: "0.7rem",
  height: "22px",
  "& .MuiChip-label": {
    padding: "0 6px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "0.75rem",
    height: "24px",
    "& .MuiChip-label": {
      padding: "0 8px",
    },
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const PlantCard = ({ plant, onSelect }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  
  const getTranslatedStatus = (status) => {
    return status === "Active" ? t.overview.status.active : t.overview.status.maintenance;
  };
  
  const handleSelect = () => {
    onSelect?.(plant);
  };

  const imageUrl = plant.image?.startsWith('/') 
    ? `${process.env.PUBLIC_URL || ''}${plant.image}` 
    : plant.image;

  return (
    <StyledCard onClick={handleSelect}>
      <StyledCardMedia 
        image={imageUrl || `${process.env.PUBLIC_URL || ''}/placeholder.svg`} 
        title={plant.name}
        sx={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <StatusChip label={getTranslatedStatus(plant.status)} status={plant.status} size="small" />
      </StyledCardMedia>
      <CardContent sx={{ flexGrow: 1, p: { xs: 1, sm: 1.5 } }}>
        <Typography
          gutterBottom
          variant="h6"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            mb: { xs: 1, sm: 1.5 },
            color: "text.primary",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {plant.name}
        </Typography>
        <Stack spacing={0.5}>
          <InfoRow>
            <LocationOn sx={{ fontSize: { xs: 14, sm: 16 }, flexShrink: 0 }} />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {plant.location}
            </Typography>
          </InfoRow>
          <InfoRow>
            <BoltOutlined sx={{ fontSize: { xs: 14, sm: 16 }, flexShrink: 0 }} />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              {t.common.capacity}: {plant.capacity}
            </Typography>
          </InfoRow>
          <InfoRow>
            <Columns4 size={14} style={{ flexShrink: 0 }} />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              {plant.strings} {t.common.strings}
            </Typography>
          </InfoRow>
        </Stack>
      </CardContent>
      <Divider />
      <Box
        sx={{
          p: { xs: 1, sm: 1.5 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(46, 125, 50, 0.04)",
          gap: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            color: "text.secondary",
            fontSize: { xs: "0.55rem", sm: "0.6rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
            minWidth: 0,
          }}
        >
          {t.common.lastUpdated}: 2h {t.common.ago}
        </Typography>
        <Chip
          label={t.common.viewDetails}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(plant);
            navigate("/plant-measures", { state: { plant } });
          }}
          sx={{
            backgroundColor: "#129990",
            color: "white",
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.65rem", sm: "0.7rem" },
            height: { xs: "20px", sm: "24px" },
            "& .MuiChip-label": {
              padding: { xs: "0 6px", sm: "0 8px" },
            },
            "&:hover": {
              backgroundColor: "#096B68",
            },
          }}
        />
      </Box>
    </StyledCard>
  );
};

export default PlantCard;
