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
import { Columns4 } from "lucide-react"; // Import Columns4 from lucide-react

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

const PlantCard = ({ plant }) => {
  return (
    <StyledCard>
      <StyledCardMedia image={plant.image} title={plant.name}>
        <StatusChip label={plant.status} status={plant.status} size="small" />
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
            color: "#16423C",
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
              Capacity: {plant.capacity}
            </Typography>
          </InfoRow>
          <InfoRow>
            {/* Replace PowerOutlined with Columns4 from lucide-react */}
            <Columns4 size={16} />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.75rem",
              }}
            >
              {plant.strings} Strings
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
            fontSize: "0.7rem",
          }}
        >
          Last updated: 2h ago
        </Typography>
        <Chip
          label="View Details"
          size="small"
          sx={{
            backgroundColor: "#2E7D32",
            color: "white",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.7rem",
            height: "24px",
            "&:hover": {
              backgroundColor: "#1B5E20",
            },
          }}
        />
      </Box>
    </StyledCard>
  );
};

export default PlantCard;
