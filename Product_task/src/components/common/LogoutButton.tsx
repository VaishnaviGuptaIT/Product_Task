import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { setLogout } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const LogoutBtn = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  padding: theme.spacing(1, 2),
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",
  transition: "background-color 300ms",
  borderRadius: "var(--radius-full)",
}));

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setLogout());
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <LogoutBtn
      variant="contained"
      onClick={handleLogout}
      startIcon={<LogOut />}
    >
      Logout
    </LogoutBtn>
  );
};
