import { Link } from "react-router-dom";
import { Product } from "../../utils/type";
import { Star, Tag, Percent } from "lucide-react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(() => ({
  height:"320px",
  position: "relative",
  overflow: "hidden",
  borderRadius: "var(--radius-lg)",
  background: "var(--color-gray-50)",
  border: "2px solid var(--color-gray-300)",
  boxShadow: "var(--shadow-xl)",
  transition: "var(--transition-medium)",
  "&:hover": {
    transform: "scale(1.05)",
    "& .overlay": {
      opacity: 1,
    },
  },
}));
const Overlay = styled(Box)({
  position: "absolute",
  inset: 0,
  background: "var(--color-primary-opacity)",
  opacity: 0,
  transition: "var(--transition-medium)",
});

const ProductImage = styled(CardMedia)({
  height: "12rem",
  objectFit: "cover",
});

const StyledLink = styled(Link)({
  textDecoration: "none",
  display: "block",
  borderRadius: "var(--radius-lg)",
  overflow: "hidden",
});
const CategoryChip = styled(Chip)({
  position: "absolute",
  top: "0.5rem",
  left: "0.5rem",
  backgroundColor: "var(--color-primary)",
  color: "white",
  zIndex: 1,
});

const DiscountChip = styled(Chip)({
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
  backgroundColor: "var(--color-success)",
  color: "white",
  zIndex: 1,
});
const ProductCard = ({ product }: { product: Product }) => {
  const discountPercentage = Math.round(product.discountPercentage);
  return (
    <StyledLink to={`/products/${product.id}`}>
      <StyledCard>
        <Overlay className="overlay" />
        <Box position="relative">
          <CategoryChip
            icon={<Tag size={16} />}
            label={product.category}
            size="small"
          />
          {discountPercentage > 0 && (
            <DiscountChip
              icon={<Percent size={16} />}
              label={`${discountPercentage}% OFF`}
              size="small"
            />
          )}
          <ProductImage
            component="img"
            image={product.thumbnail}
            alt={product.title}
            loading="lazy"
          />
        </Box>
        <CardContent sx={{ position: "relative", p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "var(--color-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--color-accent)", mb: 1 }}
          >
            {product.brand}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "var(--color-success)" }}
              >
                ${product.price}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Star color="#FFB800" size={20} />
              <Typography
                variant="body2"
                sx={{ ml: 1, color: "var(--color-gray-900)" }}
              >
                {product.rating}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
    </StyledLink>
  );
};

export default ProductCard;
