import React from "react";
import { Link , useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Button,
} from "@mui/material";
import {
  Home,
  Person,
  Key,
  Menu as MenuIcon,
  Close,
  ShoppingBag,
} from "@mui/icons-material";
import { LogoutButton } from "./LogoutButton";

// Styled components
const StyledAppBar = styled(AppBar)(() => ({
  background: "var(--color-bg-primary)",
  backdropFilter: "var(--blur-xl)",
  borderBottom: "1px solid var(--color-overlay-light)",
  padding: "0.5rem 0",
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  background: "var(--gradient-primary)",
  padding: theme.spacing(1),
  borderRadius: "var(--radius-full)",
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ active, theme }) => ({
  borderRadius: "var(--radius-full)",
  padding: theme.spacing(1, 3),
  marginLeft: theme.spacing(2),
  color: active ? "var(--color-white)" : "var(--color-gray-300)",
  background: active ? "var(--color-primary-opacity)" : "transparent",
  "&:hover": {
    background: active
      ? "var(--color-primary-opacity)"
      : "var(--color-overlay-light)",
  },
  transition: "var(--transition-medium)",
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1),
    transition: "var(--transition-medium)",
  },
  "&:hover .MuiSvgIcon-root": {
    transform: "scale(1.1)",
  },
}));

const MobileNavItem = styled(ListItem)(({ theme }) => ({
  borderRadius: "var(--radius-lg)",
  marginBottom: theme.spacing(1),
  "&:hover": {
    background: "var(--color-overlay-light)",
  },
}));

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/home", label: "Home", icon: <Home /> },
    { path: "/profile", label: "Profile", icon: <Person /> },
    { path: "/change-password", label: "Password", icon: <Key /> },
  ];

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Container maxWidth="xl" sx={{ margin: "auto" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LogoContainer>
              <Link to="/">
                <ShoppingBag sx={{ color: "white", fontSize: 24 }} />
              </Link>
            </LogoContainer>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography
                variant="h6"
                sx={{
                  ml: 2,
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                }}
              >
                Products
              </Typography>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {navItems.map((item) => (
              <NavButton
                key={item.path}
                component={Link}
                to={item.path}
                active={isActive(item.path)}
                startIcon={item.icon}
              >
                {item.label}
              </NavButton>
            ))}
            <Box
              sx={{
                ml: 3,
                pl: 3,
                borderLeft: "1px solid var(--color-overlay-light)",
              }}
            >
              <LogoutButton />
            </Box>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{
              display: { xs: "flex", md: "none" },
              color: "var(--color-primary)",
              bgcolor: "var(--color-overlay-light)",
              "&:hover": { bgcolor: "var(--color-overlay-medium)" },
              borderRadius: "var(--radius-xl)",
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <Close /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 300,
            background: "var(--color-bg-primary)",
            backgroundImage: "var(--gradient-surface)",
            backdropFilter: "var(--blur-lg)",
          },
        }}
      >
        <List sx={{ p: 2 }}>
          {navItems.map((item) => (
            <MobileNavItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              sx={{
                bgcolor: isActive(item.path)
                  ? "var(--color-primary-opacity)"
                  : "transparent",
                color: isActive(item.path)
                  ? "var(--color-white)"
                  : "var(--color-gray-300)",
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </MobileNavItem>
          ))}
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid var(--color-overlay-light)",
            }}
          >
            <LogoutButton />
          </Box>
        </List>
      </Drawer>
    </StyledAppBar>
  );
}
