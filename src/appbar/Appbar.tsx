import * as React from "react";
import MUIAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import PaidIcon from "@mui/icons-material/Paid";
import { useRef, useState } from "react";
import { User } from "firebase/auth";
import { getLoggedUser, loginWithGoogle, logout } from "../google/auth";
import { Button, ListItemIcon, ListItemText, Stack } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUser } from "./UserSlice";
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const AppBar = () => {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.current);
    const dispatchSetUser = (user: User | null) => {
        dispatch(setUser(user));
    };
    const [needLogin, setNeedLogin] = useState(false);
    const inited = useRef(false);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const updateUser = () => {
        getLoggedUser().then((user) => {
            dispatchSetUser(user);
        });
    };
    React.useEffect(() => {
        if (inited.current) {
            return;
        }
        inited.current = true;
        updateUser();
    }, []);

    React.useEffect(() => {
        setNeedLogin(user === null);
    }, [user]);
    const handleLogin = () => {
        loginWithGoogle().then((user) => {
            if (user) {
                dispatchSetUser(user);
            }
        });
    };
    const handleLogout = async () => {
        handleCloseUserMenu();
        await logout();
        updateUser();
    };

    return (
        <MUIAppBar position="static" color="default">
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <PaidIcon sx={{ display: "flex", mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: "flex",
                            color: "inherit",
                        }}
                    >
                        Dépenses
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}></Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {needLogin && (
                            <Button color="inherit" onClick={handleLogin}>
                                Login
                            </Button>
                        )}
                        {user && (
                            <>
                                <Button onClick={handleOpenUserMenu} component={Stack}>
                                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                                        <IconButton sx={{ p: 0 }}>
                                            <Avatar
                                                imgProps={{
                                                    referrerPolicy: "no-referrer",
                                                }}
                                                alt={user.displayName as string}
                                                src={user.photoURL as string}
                                            />
                                        </IconButton>
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{
                                                mr: 2,
                                                display: "flex",
                                                color: "inherit",
                                            }}
                                        >
                                            {user.displayName as string}
                                        </Typography>
                                    </Stack>
                                </Button>

                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <LogoutIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Logout</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </MUIAppBar>
    );
};
export default AppBar;
