import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

// Import modern icons
import PsychologyIcon from "@mui/icons-material/Psychology";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CloseIcon from "@mui/icons-material/Close";

// --- NEW: User Profile Dialog Component ---
const UserProfileDialog = ({ open, handleClose, user }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          backdropFilter: "blur(10px)",
          color: theme.palette.text.primary,
          borderRadius: "12px",
          border: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          User Profile
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ color: theme.palette.text.secondary }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* --- TOP AVATAR AND DISPLAY NAME --- */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4, // Increased padding
            pb: 2, // Reduced bottom padding before details
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: theme.palette.primary.main,
              fontSize: "32px",
              mb: 2,
            }}
          >
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {user.username || "Guest User"}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {user.email || "No Email Provided"}
          </Typography>
        </Box>

        {/* --- DETAILED INFORMATION SECTION --- */}
        <Box sx={{ mt: 2, px: 3 }}>
          <Divider sx={{ borderColor: theme.palette.divider, mb: 2 }} />

          {/* Username Field */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <PersonOutlineIcon
              sx={{ color: theme.palette.secondary.main, mr: 2 }}
            />
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary }}
            >
              <Box component="strong" sx={{ fontWeight: 700, mr: 1 }}>
                Username:
              </Box>
              {user.username}
            </Typography>
          </Box>

          {/* Email Field */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <EmailOutlinedIcon
              sx={{ color: theme.palette.secondary.main, mr: 2 }}
            />
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary }}
            >
              <Box component="strong" sx={{ fontWeight: 700, mr: 1 }}>
                Email:
              </Box>
              {user.email}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ color: theme.palette.text.secondary }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function Navbar({ onTutorialOpen }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose(); // Close the menu dropdown
    setIsProfileDialogOpen(true); // Open the detailed dialog
  };

  const handleProfileDialogClose = () => {
    setIsProfileDialogOpen(false);
  };

  // Fetch mock user data (should be replaced with actual Django API call)
  useEffect(() => {
    // In a real app, you would fetch user details here using the token
    // Example structure of the expected data:
    const mockUserData = {
      username: "Current User",
      email: "user@arogyaai.com",
      isAuthenticated: localStorage.getItem("access_token") ? true : false,
    };
    setCurrentUser(mockUserData);
  }, []);

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  // Styles for navigation links
  const navLinkSx = {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    textTransform: "none",
    fontSize: "1rem",
    padding: theme.spacing(1, 2),
    margin: theme.spacing(0, 1),
    borderRadius: theme.shape.borderRadius,
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
    // Styles for the active link (ACCENT COLOR)
    "&.active": {
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.primary.main,
    },
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ px: { xs: 2, md: 4 } }}>
        <Toolbar
          sx={{ height: "72px", px: 0, justifyContent: "space-between" }}
        >
          {/* Logo and App Name */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <PsychologyIcon
              sx={{
                color: theme.palette.secondary.main,
                mr: 1.5,
                fontSize: "2.5rem",
              }}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{ color: theme.palette.text.primary, fontWeight: 800 }}
            >
              Arogya{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI
              </Box>
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Button component={NavLink} to="/dashboard" sx={navLinkSx}>
              Dashboard
            </Button>
            <Button component={NavLink} to="/history" sx={navLinkSx}>
              Report History
            </Button>
            <Button component={NavLink} to="/about" sx={navLinkSx}>
              About
            </Button>
            <IconButton
              onClick={onTutorialOpen}
              sx={{
                color: theme.palette.secondary.main,
                ml: 2,
                "&:hover": {
                  color: theme.palette.secondary.light,
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Box>

          {/* User Menu */}
          <Box sx={{ ml: 4 }}>
            <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: "bold",
                  border: `2px solid ${theme.palette.divider}`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                  },
                }}
              >
                {currentUser.username
                  ? currentUser.username.charAt(0).toUpperCase()
                  : "U"}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.3))",
                  mt: 1.5,
                  bgcolor: theme.palette.background.paper,
                  backdropFilter: "blur(10px)",
                  color: theme.palette.text.primary,
                  borderRadius: "12px",
                  border: `1px solid ${theme.palette.divider}`,
                  "& .MuiMenuItem-root": {
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: theme.palette.background.paper,
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  },
                },
              }}
            >
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <AccountCircleIcon
                    fontSize="small"
                    sx={{ color: theme.palette.text.primary }}
                  />
                </ListItemIcon>
                Profile
              </MenuItem>
              <Divider sx={{ borderColor: theme.palette.divider }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <Typography color="error">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 2. USER PROFILE DIALOG */}
      <UserProfileDialog
        open={isProfileDialogOpen}
        handleClose={handleProfileDialogClose}
        user={currentUser}
      />
    </>
  );
}

export default Navbar;
