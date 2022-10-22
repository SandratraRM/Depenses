import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

export {};
export interface UserState {
    current: User | null | undefined;
}
const initialState: UserState = {
    current: undefined,
};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.current = action.payload;
        },
    },
});
export const { setUser } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
