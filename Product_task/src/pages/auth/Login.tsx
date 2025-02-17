import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LoginInputs, User } from "../../utils/type";
import { getUsers } from "../../utils/storage";
import { decryptPassword } from "../../utils/encryption";
import { useDispatch } from "react-redux";
import { setLogin } from "../../store/slices/authSlice";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  getValidationRules,
  inputHandlers,
} from "../../utils/validation";

const Login = () => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setValue,
      getValues,
    } = useForm<LoginInputs>({
      mode: "onChange",
      defaultValues: {
        email: "",
        password: "",
      },
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

 const onSubmit = async (formData: LoginInputs) => {
   try {
     const users = getUsers();
     const user = users.find((u: User) => u.email === formData.email);

     if (!user) {
       toast.error("Email not found");
       return;
     }

     if (decryptPassword(user.password) !== formData.password) {
       toast.error("Incorrect password");
       return;
     }

     localStorage.setItem("currentUser", JSON.stringify(user));
     dispatch(setLogin(true));
     toast.success("Successfully logged in!");
     navigate("/dashboard");
   } catch (err) {
     toast.error("An error occurred during login");
     console.error(err);
   }
 };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--color-overlay-light)",
      borderRadius: "var(--radius-lg)",
      color: "var(--text-color-primary)",
      transition: "var(--transition-medium)",
      "& fieldset": {
        borderColor: "var(--color-overlay-medium)",
      },
      "&:hover fieldset": {
        borderColor: "var(--color-accent)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--color-primary)",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--text-color-secondary)",
      "&.Mui-focused": {
        color: "var(--color-primary)",
      },
    },
    mb: 2,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "var(--color-gray-900)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "var(--gradient-glow)",
          filter: "var(--blur-xl)",
          animation: "pulse 8s ease-in-out infinite",
        },
        "@keyframes pulse": {
          "0%, 100%": {
            opacity: 0.5,
          },
          "50%": {
            opacity: 0.8,
          },
        },
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            position: "relative",
            backdropFilter: "var(--blur-lg)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "var(--shadow-xl)",
            p: { xs: 3, sm: 6 },
            border: "1px solid var(--color-overlay-light)",
            animation: "fadeIn 0.6s ease-out",
            "@keyframes fadeIn": {
              from: {
                opacity: 0,
                transform: "translateY(20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                color: "var(--text-color-primary)",
                fontFamily: "var(--font-heading)",
                fontWeight: "bold",
                mb: 1,
                background: "var(--gradient-primary)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "var(--text-color-secondary)" }}
            >
              Sign in to continue to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Enter your email address"
              {...register("email", getValidationRules.email)}
              onKeyDown={inputHandlers.handleKeyDown}
              onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                inputHandlers.handlePaste(e, "email", setValue, getValues)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} color="var(--text-color-secondary)" />
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
            <Box height={16} display="flex" alignItems="center">
              {errors.email && (
                <Typography variant="body2" color="error" mb={2}>
                  {errors.email.message}
                </Typography>
              )}
            </Box>

            <TextField
              fullWidth
              label="Password"
              placeholder="Enter your password"
              {...register("password", getValidationRules.password)}
              onKeyDown={inputHandlers.handleKeyDown}
              onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                inputHandlers.handlePaste(e, "password", setValue, getValues)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color="var(--text-color-secondary)" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      sx={{
                        color: "var(--text-color-secondary)",
                      }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
            <Box height={16} display="flex" alignItems="center">
              {errors.password && (
                <Typography variant="body2" color="error" mb={2}>
                  {errors.password.message}
                </Typography>
              )}
            </Box>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              endIcon={
                isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowRight />
                )
              }
              sx={{
                background: "var(--gradient-primary)",
                color: "var(--text-color-primary)",
                p: 1.5,
                mt: 1,
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
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
            <Box
              sx={{
                my: 4,
                textAlign: "center",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "var(--color-overlay-light)",
                  zIndex: 0,
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-color-secondary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  position: "relative",
                  zIndex: 1,
                  "&::before, &::after": {
                    content: '""',
                    display: "block",
                    width: "4px",
                    height: "4px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--color-primary)",
                  },
                }}
              >
                Don't have an account?{" "}
                <Link to="/signup">
                  <Typography
                    component="span"
                    sx={{
                      color: "var(--color-primary)",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "var(--transition-fast)",
                      "&:hover": {
                        color: "var(--color-secondary)",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign up now
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;