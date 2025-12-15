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
});

const StatusChip = styled(Chip)(({ theme, status }) => ({
  position: "absolute",
  top: 16,
  right: 16,
  backgroundColor: status === "Active" ? "#4CAF50" : "#FF9800",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  fontSize: "0.75rem",
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

  return (
    <StyledCard onClick={handleSelect}>
      <StyledCardMedia image={plant.image} title={plant.name}>
        <StatusChip label={getTranslatedStatus(plant.status)} status={plant.status} size="small" />
      </StyledCardMedia>
      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
        <Typography
          gutterBottom
          variant="h6"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "0.9rem",
            mb: 1.5,
            color: "text.primary",
          }}
        >
          {plant.name}
        </Typography>
        <Stack spacing={1}>
          <InfoRow>
            <LocationOn sx={{ fontSize: 16 }} />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.75rem",
              }}
            >
              {plant.location}
            </Typography>
          </InfoRow>
          <InfoRow>
            <BoltOutlined sx={{ fontSize: 16 }} />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.75rem",
              }}
            >
              {t.common.capacity}: {plant.capacity}
            </Typography>
          </InfoRow>
          <InfoRow>
            <Columns4 size={16} />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.75rem",
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
          p: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(46, 125, 50, 0.04)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            color: "text.secondary",
            fontSize: "0.6rem",
            whiteSpace: "nowrap",
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
            fontSize: "0.7rem",
            height: "24px",
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
