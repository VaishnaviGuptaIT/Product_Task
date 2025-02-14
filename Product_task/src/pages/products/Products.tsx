import { useEffect, useState } from "react";
import { Product } from "../../utils/type";
import ProductCard from "../../components/products/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { Button, CircularProgress, Box, Typography } from "@mui/material";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 8;

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://dummyjson.com/products?limit=${ITEMS_PER_PAGE}&skip=${
          (page - 1) * ITEMS_PER_PAGE
        }`
      );

      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const generatePaginationNumbers = () => {
    let pages = [];
    const maxVisiblePages = 3;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, page - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Box
      maxWidth="xl"
      sx={{
        color: "var(--color-primary)",
        p: 3,
        mx: "auto",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Explore Our Products
      </Typography>
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
        <>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg:"repeat(4, 1fr)",
            }}
            gap={2}
            maxWidth={1400}
            margin="auto"
          >
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={3}
              gap={1}
          >
            <Button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              sx={{
                background: "var(--color-secondary)",
                color: "var(--text-color-primary)",
                "&:hover": { background: "var(--color-accent)" },
              }}
            >
              <ChevronLeft />
            </Button>

            {generatePaginationNumbers().map((pageNum) => (
              <Button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                sx={{
                  minWidth: "40px",
                  background:
                    page === pageNum
                      ? "var(--color-primary)"
                      : "var(--color-bg-secondary)",
                  color: "var(--text-color-primary)",
                  "&:hover": { background: "var(--color-accent)" },
                }}
              >
                {pageNum}
              </Button>
            ))}

            <Button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              sx={{
                background: "var(--color-secondary)",
                color: "var(--text-color-primary)",
                "&:hover": { background: "var(--color-accent)" },
              }}
            >
              <ChevronRight />
            </Button>
          </Box>
          <Typography textAlign="center" mt={2}>
            Page {page} of {totalPages}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default Products;
