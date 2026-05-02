import React, { useEffect } from "react";
import { Box, Alert, CircularProgress, Container, Button, AlertTitle } from "@mui/material";
import { Notification } from "../api/notificationApi";
import NotificationCard from "./NotificationCard";
import Log from "../lib/Log";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkViewed: (id: string) => void;
  isNew: (id: string) => boolean;
  error?: string | null;
  onRetry?: () => void;
}

/**
 * NotificationList Component
 * Maps and displays notification cards, handles empty/loading states
 * Shows error alert with retry button if API call fails
 */
const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  onMarkViewed,
  isNew,
  error,
  onRetry,
}) => {
  // Log on render
  useEffect(() => {
    Log(
      "frontend",
      "info",
      "component",
      `NotificationList rendered with ${notifications.length} notifications`
    );
  }, [notifications.length]);

  // Log error when it occurs
  useEffect(() => {
    if (error) {
      Log(
        "frontend",
        "error",
        "component",
        `NotificationList failed to render - API error: ${error}`
      );
    }
  }, [error]);

  // Show error alert if there's an error and no notifications loaded yet
  if (error && notifications.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          action={
            onRetry && (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  Log(
                    "frontend",
                    "info",
                    "component",
                    "User clicked Retry button in NotificationList error alert"
                  );
                  onRetry();
                }}
              >
                RETRY
              </Button>
            )
          }
        >
          <AlertTitle>Error</AlertTitle>
          Failed to load notifications. Please try again.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (notifications.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mt: 2 }}>
          ✨ No notifications at the moment. Check back soon!
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ mt: 2 }}>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.ID}
            notification={notification}
            isNew={isNew(notification.ID)}
            onMarkViewed={onMarkViewed}
          />
        ))}
      </Box>
    </Container>
  );
};

export default NotificationList;
