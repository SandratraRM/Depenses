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
import { useState } from "react";
import { loginWithGoogle, logout } from "../google/Auth";
import { Button, ListItemIcon, ListItemText, Stack } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const AppBar = () => {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user.current);

    const [needLogin, setNeedLogin] = useState(false);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    React.useEffect(() => {
        setNeedLogin(user === null);
    }, [user]);

    const handleLogin = () => {
        loginWithGoogle(dispatch);
    };
    const handleLogout = async () => {
        handleCloseUserMenu();
        await logout(dispatch);
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
