import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Box, Container } from "@mui/material";
import NotificationHeader from "../components/NotificationHeader";
import NotificationList from "../components/NotificationList";
import { useNotifications } from "../hooks/useNotifications";
import Log from "../lib/Log";

/**
 * All Notifications Page
 * Displays all notifications with filtering and pagination support
 * URL: http://localhost:3000
 */
const AllNotificationsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Placement" | "Result" | "Event"
  >("All");

  const {
    notifications,
    loading,
    error,
    markAsViewed,
    isNew,
    filterByType,
    getCountByType,
  } = useNotifications();

  // Log on mount
  useEffect(() => {
    Log(
      "frontend",
      "info",
      "page",
      `All Notifications page loaded, fetched ${notifications.length} notifications successfully`
    );
  }, [notifications.length]);

  // Handle filter change
  const handleFilterChange = (
    filter: "All" | "Placement" | "Result" | "Event"
  ) => {
    setActiveFilter(filter);
  };

  const filteredNotifications = filterByType(activeFilter);

  // Handle mark as viewed with automatic logging
  const handleMarkViewed = (id: string) => {
    markAsViewed(id);
  };

  // Display error if there is one
  if (error && notifications.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <NotificationHeader
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          counts={{
            all: 0,
            placement: 0,
            result: 0,
            event: 0,
          }}
        />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <div style={{ color: "red" }}>
            Error loading notifications: {error.message}
          </div>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>All Notifications - Campus Hiring</title>
        <meta name="description" content="View all your notifications" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <NotificationHeader
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          counts={{
            all: notifications.length,
            placement: getCountByType("Placement"),
            result: getCountByType("Result"),
            event: getCountByType("Event"),
          }}
        />

        <NotificationList
          notifications={filteredNotifications}
          isLoading={loading}
          onMarkViewed={handleMarkViewed}
          isNew={isNew}
        />
      </Box>
    </>
  );
};

export default AllNotificationsPage;

/**
 * Server-side data fetching (optional)
 * Could be used for API prefetching
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
    revalidate: 60, // ISR - revalidate every 60 seconds
  };
};
