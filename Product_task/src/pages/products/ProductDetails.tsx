import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "../../utils/type";
import {
  Star,
  ArrowLeft,
  Tag,
  Percent,
  Box as BoxIcon,
} from "lucide-react";
import axios from "axios";
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://dummyjson.com/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setIsLoading(false);
      });
  }, [id]);

  return (
    <Box
      sx={{
        color: "var(--text-color-primary)",
        p: 4,
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress sx={{ color: "var(--color-primary)" }} />
        </Box>
      ) : (
        product && (
          <>
            <Link to="/">
              <Button
                startIcon={<ArrowLeft />}
                sx={{
                  background: "var(--gradient-primary)",
                  color: "var(--text-color-primary)",
                  p: 1.5,
                  mb: 4,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "var(--radius-full)",
                  transition: "var(--transition-bounce)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "var(--shadow-glow)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                Back to Products
              </Button>
            </Link>
            <Card
              sx={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                background: "var(--color-gray-50)",
                border: "2px solid var(--color-gray-300)",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <Box sx={{ position: "relative", p: 2 }}>
                    <CardMedia
                      component="img"
                      image={product.thumbnail}
                      alt={product.title}
                      sx={{
                        borderRadius: "var(--radius-lg)",
                        height: "400px",
                        objectFit: "cover",
                      }}
                    />
                    {product.discountPercentage > 0 && (
                      <Chip
                        icon={<Percent size={16} />}
                        label={`${Math.round(product.discountPercentage)}% OFF`}
                        sx={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          backgroundColor: "var(--color-success)",
                          color: "white",
                        }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Chip
                        icon={<Tag size={16} />}
                        label={product.category}
                        sx={{
                          backgroundColor: "var(--color-primary)",
                          color: "white",
                        }}
                      />
                      <Chip
                        icon={<BoxIcon size={16} />}
                        label={product.brand}
                        sx={{
                          backgroundColor: "var(--color-accent)",
                          color: "white",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{ color: "var(--color-primary)", mb: 2 }}
                    >
                      {product.title}
                    </Typography>

                    <Typography sx={{ mb: 3 }}>
                      {product.description}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{ color: "var(--color-success)" }}
                      >
                        ${product.price}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={24}
                          color={
                            i < Math.floor(product.rating) ? "#FFD700" : "#ccc"
                          }
                        />
                      ))}
                      <Typography sx={{ ml: 1 }}>
                        {product.rating} rating
                      </Typography>
                    </Box>

                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </>
        )
      )}
    </Box>
  );
};

export default ProductDetail;
