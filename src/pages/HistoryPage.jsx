import { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Added motion import

// Import Icons
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // Icon for success message

// Import custom components
import StatusChip from "../components/StatusChip";

// --- TimelineItem Component ---
const TimelineItem = ({ report, onDeleteClick, isLastItem }) => {
  const theme = useTheme();
  const displayStatus =
    report.status === "High Risk" ? "Urgent" : report.status;

  return (
    <Box sx={{ display: "flex", position: "relative", pb: isLastItem ? 0 : 6 }}>
      {/* The vertical timeline line */}
      {!isLastItem && (
        <Box
          sx={{
            position: "absolute",
            top: "20px",
            left: "19px",
            bottom: "-20px",
            width: "2px",
            bgcolor: theme.palette.divider,
          }}
        />
      )}

      {/* The timeline dot/icon */}
      <Box sx={{ mr: 4, flexShrink: 0, zIndex: 1 }}>
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            bgcolor: theme.palette.background.default,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid",
            borderColor: theme.palette.primary.main,
          }}
        >
          <ArticleIcon sx={{ color: theme.palette.text.primary }} />
        </Box>
      </Box>

      {/* The report card */}
      <Paper
        sx={{
          p: 3,
          flexGrow: 1,
          borderRadius: 3,
          transition: "all 0.3s ease",
          border: `1px solid ${theme.palette.divider}`,
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 10px 20px 0 rgba(0, 0, 0, 0.4)`,
            border: `1px solid ${theme.palette.secondary.main}`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{ fontWeight: 700, color: theme.palette.text.primary }}
          >
            Medical Report
          </Typography>
          <StatusChip status={displayStatus} />
        </Box>
        <Typography
          variant="body2"
          color={theme.palette.text.secondary}
          sx={{ mb: 1 }}
        >
          <strong>Date:</strong>{" "}
          {new Date(report.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
        <Typography
          variant="body2"
          color={theme.palette.text.secondary}
          sx={{
            mb: 3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <strong>Summary:</strong> {report.ai_description.split("\n")[0]}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            component={Link}
            to={`/dashboard?report_id=${report.id}`}
            variant="contained"
            color="primary"
            size="medium"
            endIcon={<ArrowForwardIcon />}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            View Details
          </Button>
          <IconButton
            size="medium"
            aria-label="delete"
            onClick={() => onDeleteClick(report.id)}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                color: theme.palette.error.main,
                bgcolor: "rgba(255, 0, 0, 0.1)",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

// --- HistoryPage Component ---
function HistoryPage() {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false); // NEW STATE

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/reports/");
      setReports(response.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to load your report history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteClick = (reportId) => {
    setReportToDelete(reportId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setReportToDelete(null);
  };

  // New Effect to dismiss success alert after 3 seconds
  useEffect(() => {
    if (isSuccessAlertOpen) {
      const timer = setTimeout(() => {
        setIsSuccessAlertOpen(false);
      }, 3000); // Alert vanishes after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isSuccessAlertOpen]);

  // FIX APPLIED HERE: Added authorization header to the axios delete call
  const confirmDelete = async () => {
    if (reportToDelete) {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authorization failed. Please log in again.");
        handleDialogClose();
        return;
      }

      try {
        await axios.delete(
          `http://127.0.0.1:8000/api/reports/${reportToDelete}/`, // <-- FIX HERE: Removed the /delete/ segment
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchReports(); // Refresh the list after deleting
        setIsSuccessAlertOpen(true); // SET SUCCESS ALERT
      } catch (err) {
        console.error("Failed to delete report:", err);
        setError("Could not delete the report. Please try again.");
      } finally {
        handleDialogClose();
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <CircularProgress sx={{ color: theme.palette.secondary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 4, borderRadius: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 4, sm: 6, lg: 10 },
        minHeight: "calc(100vh - 72px - 210px)",
        // Background handled by Layout.jsx
      }}
    >
      {/* SUCCESS MESSAGE TOAST */}
      <AnimatePresence>
        {isSuccessAlertOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              top: "100px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
              maxWidth: "400px",
              zIndex: 2000,
            }}
          >
            <Alert
              severity="success"
              icon={<CheckCircleOutlineIcon fontSize="inherit" />}
              sx={{
                borderRadius: 3,
                bgcolor: theme.palette.success.dark,
                color: theme.palette.success.contrastText,
              }}
            >
              Report **deleted** successfully.
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      {/* END SUCCESS MESSAGE */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 800, color: theme.palette.text.primary }}
        >
          Your <strong>History</strong>
        </Typography>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          color="secondary"
          startIcon={<UploadFileIcon />}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Upload New
        </Button>
      </Box>

      {reports.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 4,
          }}
        >
          <FolderOffIcon
            sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }}
          />
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
            No Reports Found
          </Typography>
          <Typography color={theme.palette.text.secondary}>
            Your uploaded medical reports will appear here.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={0}>
          {reports.map((report, index) => (
            <TimelineItem
              key={report.id}
              report={report}
              onDeleteClick={handleDeleteClick}
              isLastItem={index === reports.length - 1}
            />
          ))}
        </Stack>
      )}

      {/* --- Delete Confirmation Dialog --- */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
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
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700 }}>
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: theme.palette.text.secondary }}>
            Are you sure you want to permanently delete this report? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            autoFocus
            sx={{ fontWeight: 700 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HistoryPage;
