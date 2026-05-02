import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Box, Container, Button } from "@mui/material";
import { useRouter } from "next/router";
import PriorityInbox from "../components/PriorityInbox";
import { usePriorityNotifications } from "../hooks/useNotifications";
import Log from "logging-middleware";

/**
 * Priority Inbox Page
 * Displays top N priority notifications ranked by type weight and recency
 * URL: http://localhost:3000/priority
 */
const PriorityPage: React.FC = () => {
  const router = useRouter();
  const {
    priorityNotifications,
    loading,
    error,
    topN,
    setN,
    recalculatePriorities,
  } = usePriorityNotifications();

  // Log on mount
  useEffect(() => {
    Log(
      "frontend",
      "info",
      "page",
      `Priority Inbox page loaded, showing top ${topN} of ${priorityNotifications.length} unread notifications`
    );
  }, [priorityNotifications.length, topN]);

  const handleGoBack = () => {
    Log(
      "frontend",
      "info",
      "page",
      "User clicked back button to return to All Notifications page"
    );
    router.push("/");
  };

  const handleMarkViewed = (id: string) => {
    // In a full implementation, this would mark the notification as viewed
    // and potentially refresh the priority list
    Log(
      "frontend",
      "info",
      "page",
      `User marked notification ${id} as viewed on priority page`
    );
  };

  // Display error if there is one
  if (error && priorityNotifications.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Button
            variant="contained"
            onClick={handleGoBack}
            sx={{ mb: 2 }}
          >
            ← Back to All Notifications
          </Button>
          <div style={{ color: "red" }}>
            Error loading priority notifications: {error.message}
          </div>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Priority Inbox - Campus Hiring</title>
        <meta name="description" content="Your priority notifications" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Button
            variant="outlined"
            onClick={handleGoBack}
            sx={{
              mb: 2,
              fontWeight: 600,
            }}
          >
            ← Back to All Notifications
          </Button>

          <Box
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: "#e3f2fd",
              borderRadius: 1,
              borderLeft: "4px solid #1976d2",
            }}
          >
            <h1 style={{ margin: "0 0 8px 0", color: "#1976d2" }}>
              ⭐ Priority Inbox
            </h1>
            <p style={{ margin: 0, color: "#555" }}>
              Top {topN} notifications ranked by importance (Placement {">"}
              Result {">"}
              Event) and recency
            </p>
          </Box>

          <PriorityInbox
            priorityNotifications={priorityNotifications}
            isLoading={loading}
            topN={topN}
            onTopNChange={setN}
            onRefresh={recalculatePriorities}
            onMarkViewed={handleMarkViewed}
          />
        </Container>
      </Box>
    </>
  );
};

export default PriorityPage;

/**
 * Server-side data fetching (optional)
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
    revalidate: 60,
  };
};
