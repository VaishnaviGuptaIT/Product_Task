import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff } from "lucide-react";
import { decryptPassword, encryptPassword } from "../../utils/encryption";
import { PasswordFormInputs } from "../../utils/type";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";

const ChangePassword = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PasswordFormInputs>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const watchNewPassword = watch("newPassword");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: keyof PasswordFormInputs
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/\s/g, "");
    setValue(field, pastedText);
  };

  const onSubmit = (data: PasswordFormInputs) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (currentPassword !== decryptPassword(currentUser?.password)) {
      toast.error("Current password is incorrect");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const updatedUser = {
      ...currentUser,
      password: encryptPassword(newPassword),
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(
      (user: any) => user.email === currentUser.email
    );

    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }

    toast.success("Password updated successfully!");

    setValue("currentPassword", "");
    setValue("newPassword", "");
    setValue("confirmPassword", "");
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
        marginTop: "4rem",
        display: "flex",
        alignItems: "center",
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
            background: "var(--color-gray-900)",
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
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box
              sx={{
                width: "80px",
                height: "80px",
                mx: "auto",
                mb: 3,
                borderRadius: "var(--radius-full)",
                background: "var(--gradient-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "var(--transition-bounce)",
                "&:hover": {
                  transform: "rotate(360deg) scale(1.1)",
                },
              }}
            >
              <Lock size={40} color="white" />
            </Box>
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
              Change Password
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "var(--text-color-secondary)" }}
            >
              Update your account password
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="currentPassword"
              control={control}
              rules={{
                required: "Current password is required",
                validate: {
                  noSpaces: (value) =>
                    !/\s/.test(value) || "Password cannot contain spaces",
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  {...field}
                  onKeyDown={handleKeyDown}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                    handlePaste(e, "currentPassword")
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
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                          sx={{ color: "var(--text-color-secondary)" }}
                        >
                          {showCurrentPassword ? (
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
              )}
            />
            <Box height={16} display="flex" alignItems="center">
              {errors.currentPassword && (
                <Typography variant="body2" color="error" mb={2}>
                  {errors.currentPassword.message}
                </Typography>
              )}
            </Box>

            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 32,
                  message: "Password must not exceed 32 characters",
                },
                validate: {
                  noSpaces: (value) =>
                    !/\s/.test(value) || "Password cannot contain spaces",
                  lowercase: (value) =>
                    /[a-z]/.test(value) ||
                    "Password must contain at least one lowercase letter",
                  uppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain at least one uppercase letter",
                  digit: (value) =>
                    /\d/.test(value) ||
                    "Password must contain at least one number",
                  specialChar: (value) =>
                    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) ||
                    "Password must contain at least one special character",
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  {...field}
                  onKeyDown={handleKeyDown}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                    handlePaste(e, "newPassword")
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
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          sx={{ color: "var(--text-color-secondary)" }}
                        >
                          {showNewPassword ? (
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
              )}
            />
            <Box height={16} display="flex" alignItems="center">
              {errors.newPassword && (
                <Typography variant="body2" color="error" mb={2}>
                  {errors.newPassword.message}
                </Typography>
              )}
            </Box>

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your new password",
                validate: {
                  matchesPassword: (value) =>
                    value === watchNewPassword || "Passwords do not match",
                  noSpaces: (value) =>
                    !/\s/.test(value) || "Password cannot contain spaces",
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...field}
                  onKeyDown={handleKeyDown}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                    handlePaste(e, "confirmPassword")
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
                            setShowConfirmPassword(!showConfirmPassword)
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
              )}
            />
            <Box height={16} display="flex" alignItems="center">
              {errors.confirmPassword && (
                <Typography variant="body2" color="error" mb={2}>
                  {errors.confirmPassword.message}
                </Typography>
              )}
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
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
              Update Password
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePassword;
