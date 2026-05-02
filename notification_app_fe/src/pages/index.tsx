import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Pagination, Stack } from "@mui/material";
import NotificationHeader from "../components/NotificationHeader";
import NotificationList from "../components/NotificationList";
import { fetchAllNotifications } from "../api/notificationApi";
import {
  getViewedIds,
  addViewedId as addViewedIdToState,
  isViewed as isViewedInState,
} from "../state/notificationState";
import Log from "../lib/Log";
import type { Notification } from "../api/notificationApi";

/**
 * All Notifications Page
 * Displays all notifications with filtering and pagination support
 * URL: http://localhost:3000
 */
const AllNotificationsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Placement" | "Result" | "Event"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // Initialize - load viewed IDs and fetch initial notifications
  useEffect(() => {
    const loadViewedIds = async () => {
      const loaded = getViewedIds();
      setViewedIds(loaded);
      Log(
        "frontend",
        "debug",
        "page",
        `Loaded ${loaded.size} previously viewed notifications`
      );
    };
    loadViewedIds();
  }, []);

  // Fetch notifications when page or filter changes
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        Log(
          "frontend",
          "info",
          "page",
          `Fetching notifications - page ${currentPage}, filter ${activeFilter}, limit ${ITEMS_PER_PAGE}`
        );

        const notificationType =
          activeFilter === "All" ? undefined : activeFilter;

        const data = await fetchAllNotifications({
          limit: ITEMS_PER_PAGE,
          page: currentPage,
          notification_type:
            notificationType as
              | "Placement"
              | "Result"
              | "Event"
              | undefined,
        });

        setNotifications(data);

        // Calculate total pages (assuming API returns all matching records)
        // This is a simple calculation - adjust if API provides this info
        const estimatedTotal = Math.max(
          ITEMS_PER_PAGE * currentPage,
          data.length
        );
        const pages = Math.ceil(estimatedTotal / ITEMS_PER_PAGE) || 1;
        setTotalPages(pages);

        Log(
          "frontend",
          "info",
          "page",
          `Successfully fetched ${data.length} notifications for page ${currentPage}`
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setNotifications([]);

        Log(
          "frontend",
          "error",
          "page",
          `Failed to fetch notifications: ${errorMessage}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentPage, activeFilter]);

  // Handle filter change
  const handleFilterChange = (
    filter: "All" | "Placement" | "Result" | "Event"
  ) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
    Log(
      "frontend",
      "info",
      "page",
      `User changed filter to ${filter}, resetting to page 1`
    );
  };

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    Log(
      "frontend",
      "info",
      "page",
      `User navigated to page ${page}`
    );
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter notifications by type (in case API doesn't fully support filtering)
  const filteredNotifications =
    activeFilter === "All"
      ? notifications
      : notifications.filter((n) => n.Type === activeFilter);

  // Count notifications by type
  const getCountByType = (type: string): number => {
    return notifications.filter((n) => n.Type === type).length;
  };

  // Mark notification as viewed
  const handleMarkViewed = (id: string) => {
    addViewedIdToState(id);
    setViewedIds((prev) => new Set([...prev, id]));
    Log(
      "frontend",
      "info",
      "page",
      `User marked notification ${id} as viewed`
    );
  };

  // Check if notification is new (not viewed)
  const isNew = (id: string): boolean => {
    return !viewedIds.has(id);
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
            Error loading notifications: {error}
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

        <Container maxWidth="md" sx={{ py: 4 }}>
          <NotificationList
            notifications={filteredNotifications}
            isLoading={loading}
            onMarkViewed={handleMarkViewed}
            isNew={isNew}
          />

          {/* Pagination Component */}
          {!loading && notifications.length > 0 && (
            <Stack
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
                mb: 2,
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Stack>
          )}
        </Container>
      </Box>
    </>
  );
};

export default AllNotificationsPage;


