import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Notification } from "../api/notificationApi";
import Log from "../lib/Log";

interface NotificationCardProps {
  notification: Notification;
  isNew: boolean;
  onMarkViewed: (id: string) => void;
  rankNumber?: number; // Optional rank for priority inbox
}

/**
 * Gets the color for notification type badge
 */
function getTypeColor(
  type: "Placement" | "Result" | "Event"
): "primary" | "success" | "warning" {
  switch (type) {
    case "Placement":
      return "primary";
    case "Result":
      return "success";
    case "Event":
      return "warning";
    default:
      return "primary";
  }
}

/**
 * Format timestamp as relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    // Format as date for older timestamps
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return timestamp;
  }
}

/**
 * NotificationCard Component
 * Displays a single notification with type badge, message, timestamp, and action buttons
 * Fully responsive: stacks vertically on mobile, horizontal on desktop
 */
const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isNew,
  onMarkViewed,
  rankNumber,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Log on mount with responsive info
  useEffect(() => {
    const viewType = isMobile ? "mobile" : "desktop";
    Log(
      "frontend",
      "info",
      "component",
      `NotificationCard rendered in ${viewType} view - ID: ${notification.ID}, Type: ${notification.Type}, isNew: ${isNew}, Rank: ${rankNumber || "N/A"}`
    );
  }, [isMobile]);

  const handleMarkViewed = () => {
    Log(
      "frontend",
      "info",
      "component",
      `User clicked 'Mark as Viewed' for notification ${notification.ID}`
    );
    onMarkViewed(notification.ID);
  };

  const typeColor = getTypeColor(notification.Type);

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: isNew ? "4px solid #1976d2" : "4px solid transparent",
        backgroundColor: isNew ? "#f0f7ff" : "#fff",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: isNew ? "#e3f2fd" : "#fafafa",
        },
      }}
    >
      <CardContent sx={{ padding: { xs: 1.5, md: 2 } }}>
        {/* Header Section - Type Chip and Badge (Responsive) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: { xs: 1, md: 1.5 },
            gap: { xs: 1, md: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
              width: { xs: "100%", md: "auto" },
            }}
          >
            {rankNumber && (
              <Typography
                variant={isMobile ? "body2" : "h6"}
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  minWidth: "30px",
                  fontSize: { xs: "0.875rem", md: "1.25rem" },
                }}
              >
                #{rankNumber}
              </Typography>
            )}
            <Chip
              label={notification.Type}
              color={typeColor}
              size={isMobile ? "small" : "medium"}
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
            {isNew && (
              <Badge
                badgeContent="NEW"
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    fontSize: { xs: "0.65rem", md: "0.7rem" },
                    fontWeight: 700,
                    padding: { xs: "1px 4px", md: "2px 6px" },
                    borderRadius: "4px",
                  },
                }}
              />
            )}
          </Box>
        </Box>

        {/* Message Section (Responsive) */}
        <Typography
          variant="body1"
          sx={{
            mb: { xs: 1, md: 1.5 },
            color: "#212121",
            lineHeight: 1.6,
            fontSize: { xs: "0.95rem", md: "1rem" },
            wordBreak: "break-word",
          }}
        >
          {notification.Message}
        </Typography>

        {/* Footer Section - Timestamp and Button (Responsive) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: { xs: 1.5, md: 0 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#757575",
              fontSize: { xs: "0.8rem", md: "0.85rem" },
              whiteSpace: "nowrap",
              order: { xs: 2, md: 1 },
            }}
          >
            {formatRelativeTime(notification.Timestamp)}
          </Typography>

          {isNew && (
            <Button
              size={isMobile ? "small" : "medium"}
              variant="outlined"
              onClick={handleMarkViewed}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                borderColor: "#1976d2",
                color: "#1976d2",
                width: { xs: "100%", md: "auto" },
                fontSize: { xs: "0.8rem", md: "0.875rem" },
                padding: { xs: "6px 12px", md: "8px 16px" },
                order: { xs: 1, md: 2 },
                "&:hover": {
                  backgroundColor: "#f0f7ff",
                  borderColor: "#1565c0",
                },
              }}
            >
              Mark as Viewed
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
