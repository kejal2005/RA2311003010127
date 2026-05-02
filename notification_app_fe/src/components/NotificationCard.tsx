import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  Badge,
} from "@mui/material";
import { Notification } from "../api/notificationApi";
import Log from "logging-middleware";

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
 */
const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isNew,
  onMarkViewed,
  rankNumber,
}) => {
  // Log on mount
  useEffect(() => {
    Log(
      "frontend",
      "info",
      "component",
      `NotificationCard rendered - ID: ${notification.ID}, Type: ${notification.Type}, isNew: ${isNew}, Rank: ${rankNumber || "N/A"}`
    );
  }, []);

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
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {rankNumber && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  minWidth: "30px",
                }}
              >
                #{rankNumber}
              </Typography>
            )}
            <Chip
              label={notification.Type}
              color={typeColor}
              size="small"
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
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "4px",
                  },
                }}
              />
            )}
          </Box>
        </Box>

        <Typography
          variant="body1"
          sx={{
            mb: 1.5,
            color: "#212121",
            lineHeight: 1.6,
          }}
        >
          {notification.Message}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#757575",
              fontSize: "0.85rem",
            }}
          >
            {formatRelativeTime(notification.Timestamp)}
          </Typography>

          {isNew && (
            <Button
              size="small"
              variant="outlined"
              onClick={handleMarkViewed}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                borderColor: "#1976d2",
                color: "#1976d2",
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
