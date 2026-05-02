import React, { useEffect } from "react";
import { Box, Alert, CircularProgress, Container } from "@mui/material";
import { Notification } from "../api/notificationApi";
import NotificationCard from "./NotificationCard";
import Log from "logging-middleware";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkViewed: (id: string) => void;
  isNew: (id: string) => boolean;
}

/**
 * NotificationList Component
 * Maps and displays notification cards, handles empty/loading states
 */
const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  onMarkViewed,
  isNew,
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
