import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getCurrentUser, getUsers } from "../../utils/storage";
import { User, Mail, Smartphone } from "lucide-react";
import toast from "react-hot-toast";
import { ProfileFormInputs } from "../../utils/type";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  getValidationRules,
  inputHandlers,
} from "../../utils/validation";

const Profile = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
    },
  });

  const fetchUserData = () => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      reset(user);
    }
  };

  const updateUserData = (updatedUser: any) => {
    const users = getUsers();
    const emailExists = users.some(
      (user) =>
        user.email === updatedUser.email && user.email !== currentUser.email
    );

    if (emailExists) {
      toast.error("The email address is already in use!");
      return;
    }

    const index = users.findIndex((user) => user.email === currentUser.email);

    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error("User not found!");
    }
  };

  const onSubmit = (data: ProfileFormInputs) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...data,
      };
      updateUserData(updatedUser);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(false);
    fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
    "&.Mui-disabled": {
      backgroundColor: "var(--color-overlay-light)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "var(--text-color-secondary)",
    "&.Mui-focused": {
      color: "var(--color-primary)",
    },
    "&.Mui-disabled": {
      color: "var(--color-gray-400)",
    },
  },
  "& .Mui-disabled .MuiInputBase-input": {
    color: "var(--color-gray-400) !important",
    "-webkit-text-fill-color": "var(--color-gray-400) !important",
  },
  "& .MuiInputBase-input": {
    color: "var(--text-color-primary)",
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
              }}
            >
              <User size={40} color="white" />
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
              {isEditing ? "Edit Profile" : "View Profile"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "var(--text-color-secondary)" }}
            >
              Manage your account details
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstName"
                  control={control}
                  rules={getValidationRules.name("First name")}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="First Name"
                      disabled={!isEditing}
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
                            <User
                              size={20}
                              color="var(--text-color-secondary)"
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    />
                  )}
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
                <Controller
                  name="lastName"
                  control={control}
                  rules={getValidationRules.name("Last name")}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Last Name"
                      disabled={!isEditing}
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
                            <User
                              size={20}
                              color="var(--text-color-secondary)"
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    />
                  )}
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
                <Controller
                  name="email"
                  control={control}
                  rules={getValidationRules.email}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      disabled={!isEditing}
                      onKeyDown={inputHandlers.handleKeyDown}
                      onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                        inputHandlers.handlePaste(
                          e,
                          "email",
                          setValue,
                          getValues
                        )
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail
                              size={20}
                              color="var(--text-color-secondary)"
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    />
                  )}
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
                <Controller
                  name="mobile"
                  control={control}
                  rules={getValidationRules.mobile}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Mobile"
                      disabled={!isEditing}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        inputHandlers.handleMobileInput(e, setValue)
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        inputHandlers.handleMobileInput(e, setValue)
                      }
                      onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                        inputHandlers.handleMobilePaste(e, setValue)
                      }
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
                  )}
                />
                <Box height={16} display="flex" alignItems="center">
                  {errors.mobile && (
                    <Typography variant="body2" color="error">
                      {errors.mobile.message}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
                transition: "opacity 0.3s ease-in-out",
                opacity: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: "100%",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                {!isEditing ? (
                  <Button
                    fullWidth
                    onClick={handleEditClick}
                    type="button"
                    sx={{
                      background: "var(--gradient-primary)",
                      color: "var(--text-color-primary)",
                      p: 1.5,
                      fontSize: "1rem",
                      textTransform: "none",
                      borderRadius: "var(--radius-full)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "var(--shadow-glow)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      sx={{
                        flex: 1,
                        background: "var(--gradient-primary)",
                        color: "var(--text-color-primary)",
                        p: 1.5,
                        fontSize: "1rem",
                        textTransform: "none",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancelClick}
                      type="button"
                      sx={{
                        flex: 1,
                        backgroundColor: "var(--color-overlay-light)",
                        color: "var(--text-color-primary)",
                        p: 1.5,
                        fontSize: "1rem",
                        textTransform: "none",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
