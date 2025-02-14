import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthSlice } from "../../utils/type";

const handleCookie = () => {
  const currentUser = localStorage.getItem("currentUser");
  return !!currentUser;
};

const initialState: AuthSlice = {
  isAuth: handleCookie(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<any>) => {
      state.isAuth = action.payload;
      if (!action.payload) {
        localStorage.removeItem("currentUser");
      }
    },
    setLogout: (state) => {
      state.isAuth = false;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
