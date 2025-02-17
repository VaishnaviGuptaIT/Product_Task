import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import {
  User as UserIcon,
  Mail,
  Smartphone,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { encryptPassword } from "../../utils/encryption";
import {saveUser } from "../../utils/storage";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { SignupFormInputs, User } from "../../utils/type";
import {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  getValidationRules,
  inputHandlers,
} from "../../utils/validation";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    reset,
    setValue,
    getValues,
  } = useForm<SignupFormInputs>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  const validatePasswordMatch = (value: string) => {
    const password = watch("password");
    return value === password || "Passwords do not match";
  };

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      const users: User[] = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      if (users.length >= 5) {
        toast.error("Registration limit reached. Maximum of 5 users allowed.");
        return;
      }

      if (
        users.some(
          (user) => user.email.toLowerCase() === data.email.toLowerCase()
        )
      ) {
        setError("email", {
          type: "manual",
          message:
            "This email is already registered. Please use a different one.",
        });
        return;
      }

      const newUser: User = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.toLowerCase().trim(),
        mobile: data.mobile.trim(),
        password: encryptPassword(data.password),
      };

      saveUser(newUser);
      toast.success("Registration successful! Redirecting to login page...");
      reset();
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        "Something went wrong during signup. Please try again later."
      );
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
              Create Account
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "var(--text-color-secondary)" }}
            >
              Sign up to get started
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  placeholder="Enter your first name"
                  {...register(
                    "firstName",
                    getValidationRules.name("First name")
                  )}
                  onKeyDown={inputHandlers.handleKeyDown}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                    inputHandlers.handlePaste(
                      e,
                      "firstName",
                      setValue,
                      getValues
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <UserIcon
                          size={20}
                          color="var(--text-color-secondary)"
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles}
                />
                <Box height={16} display="flex" alignItems="center">
                  {errors.firstName && (
                    <Typography variant="body2" color="error">
                      {errors.firstName.message}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  placeholder="Enter your last name"
                  {...register(
                    "lastName",
                    getValidationRules.name("Last name")
                  )}
                  onKeyDown={inputHandlers.handleKeyDown}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                    inputHandlers.handlePaste(
                      e,
                      "lastName",
                      setValue,
                      getValues
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <UserIcon
                          size={20}
                          color="var(--text-color-secondary)"
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles}
                />
                <Box height={16} display="flex" alignItems="center">
                  {errors.lastName && (
                    <Typography variant="body2" color="error">
                      {errors.lastName.message}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
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
                    <Typography variant="body2" color="error">
                      {errors.email.message}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mobile"
                  placeholder="Enter your mobile number"
                  {...register("mobile", getValidationRules.mobile)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    inputHandlers.handleMobileInput(e, setValue)
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => inputHandlers.handleMobileInput(e, setValue)}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => inputHandlers.handleMobilePaste(e, setValue)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Smartphone
                          size={20}
                          color="var(--text-color-secondary)"
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles}
                />
                <Box height={16} display="flex" alignItems="center">
                  {errors.mobile && (
                    <Typography variant="body2" color="error">
                      {errors.mobile.message}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", getValidationRules.password)}
                  onKeyDown={inputHandlers.handleKeyDown}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                    inputHandlers.handlePaste(
                      e,
                      "password",
                      setValue,
                      getValues
                    )
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
                          sx={{ color: "var(--text-color-secondary)" }}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles}
                />
                <Box height={16} display="flex" alignItems="center">
                  {errors.password && (
                    <Typography variant="body2" color="error">
                      {errors.password.message}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: VALIDATION_MESSAGES.REQUIRED("Confirm password"),
                    validate: {
                      passwordMatch: validatePasswordMatch,
                      noSpaces: (value) =>
                        !VALIDATION_PATTERNS.NO_SPACES.test(value) ||
                        VALIDATION_MESSAGES.NO_SPACES("Confirm password"),
                    },
                  })}
                  onKeyDown={inputHandlers.handleKeyDown}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                    inputHandlers.handlePaste(
                      e,
                      "confirmPassword",
                      setValue,
                      getValues
                    )
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
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          edge="end"
                          sx={{ color: "var(--text-color-secondary)" }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles}
                />
                <Box height={16} display="flex" alignItems="center">
                  {errors.confirmPassword && (
                    <Typography variant="body2" color="error">
                      {errors.confirmPassword.message}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

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
                mt: 2,
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
              {isSubmitting ? "Creating Account..." : "Sign Up"}
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
                Already have an account?{" "}
                <Link to="/login">
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
                    Sign in
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

export default Signup;
