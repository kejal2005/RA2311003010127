import React, { useEffect } from "react";
import {
  Box,
  Container,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";
import { Notification } from "../api/notificationApi";
import NotificationCard from "./NotificationCard";
import Log from "logging-middleware";

interface PriorityInboxProps {
  priorityNotifications: Notification[];
  isLoading: boolean;
  topN: number;
  onTopNChange: (n: number) => void;
  onRefresh: () => void;
  onMarkViewed?: (id: string) => void;
}

/**
 * PriorityInbox Component
 * Displays ranked list of top N priority notifications
 */
const PriorityInbox: React.FC<PriorityInboxProps> = ({
  priorityNotifications,
  isLoading,
  topN,
  onTopNChange,
  onRefresh,
  onMarkViewed = () => {},
}) => {
  // Log on render
  useEffect(() => {
    Log(
      "frontend",
      "info",
      "component",
      `PriorityInbox rendered with ${priorityNotifications.length} notifications for topN=${topN}`
    );
  }, [priorityNotifications.length, topN]);

  const handleTopNChange = (event: any) => {
    const newValue = event.target.value;
    Log(
      "frontend",
      "info",
      "component",
      `User changed topN selector from ${topN} to ${newValue}`
    );
    onTopNChange(newValue);
  };

  const handleRefresh = () => {
    Log(
      "frontend",
      "info",
      "component",
      `User clicked refresh button for priority notifications`
    );
    onRefresh();
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Top N Selector and Refresh Button */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Show Top N Notifications</InputLabel>
          <Select
            value={topN}
            onChange={handleTopNChange}
            label="Show Top N Notifications"
          >
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          sx={{
            fontWeight: 600,
          }}
        >
          🔄 Refresh
        </Button>
      </Paper>

      {/* Empty State */}
      {priorityNotifications.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          ✨ No unread notifications in your priority inbox. Great job staying updated!
        </Alert>
      ) : (
        /* Ranked Notifications */
        <Box sx={{ mt: 2 }}>
          {priorityNotifications.map((notification, index) => (
            <NotificationCard
              key={notification.ID}
              notification={notification}
              isNew={false}
              onMarkViewed={onMarkViewed}
              rankNumber={index + 1}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default PriorityInbox;
