import { useEffect, useState } from "react";
import Log from "../lib/Log";
import { Notification } from "../api/notificationApi";
import { fetchAllNotifications, FetchNotificationsParams } from "../api/notificationApi";
import {
  getViewedIds,
  addViewedId as addViewedIdToState,
  isViewed as isViewedInState,
} from "../state/notificationState";

/**
 * Hook for managing all notifications
 * Fetches notifications, handles viewing state, and provides filtering
 */
export function useNotifications(params?: FetchNotificationsParams) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  /**
   * Initialize hook - fetch notifications and load viewed IDs
   */
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        setLoading(true);
        Log("frontend", "info", "hook", "useNotifications hook initialized");

        // Load viewed IDs from localStorage
        const loadedViewedIds = getViewedIds();
        setViewedIds(loadedViewedIds);
        Log(
          "frontend",
          "debug",
          "hook",
          `useNotifications: Loaded ${loadedViewedIds.size} previously viewed notifications from localStorage`
        );

        // Fetch all notifications
        const data = await fetchAllNotifications(params);
        setNotifications(data);
        Log(
          "frontend",
          "info",
          "hook",
          `useNotifications: Fetched and initialized ${data.length} notifications`
        );
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(
          err instanceof Error ? err : new Error(errorMessage)
        );
        Log(
          "frontend",
          "error",
          "hook",
          `useNotifications: Failed to fetch notifications - ${errorMessage}`
        );
      } finally {
        setLoading(false);
      }
    };

    initializeNotifications();
  }, []);

  /**
   * Mark a notification as viewed
   */
  const markAsViewed = (id: string) => {
    addViewedIdToState(id);
    setViewedIds((prev) => new Set([...prev, id]));
    Log(
      "frontend",
      "info",
      "hook",
      `useNotifications: markAsViewed called for notification ${id}`
    );
  };

  /**
   * Check if a notification is new (not yet viewed)
   */
  const isNew = (id: string): boolean => {
    return !viewedIds.has(id);
  };

  /**
   * Filter notifications by type
   */
  const filterByType = (
    type: "Placement" | "Result" | "Event" | "All"
  ): Notification[] => {
    const filtered =
      type === "All"
        ? notifications
        : notifications.filter((n) => n.Type === type);
    Log(
      "frontend",
      "debug",
      "hook",
      `useNotifications: Filtered notifications by type=${type}, returned ${filtered.length} results`
    );
    return filtered;
  };

  /**
   * Get count of notifications by type
   */
  const getCountByType = (
    type: "Placement" | "Result" | "Event" | "All"
  ): number => {
    return filterByType(type).length;
  };

  /**
   * Get count of unread notifications
   */
  const getUnreadCount = (): number => {
    const unread = notifications.filter((n) => isNew(n.ID)).length;
    return unread;
  };

  return {
    notifications,
    loading,
    error,
    viewedIds,
    markAsViewed,
    isNew,
    filterByType,
    getCountByType,
    getUnreadCount,
  };
}

/**
 * Hook for managing priority notifications
 * Fetches top N priority notifications with configurable N
 */
export function usePriorityNotifications() {
  const [priorityNotifications, setPriorityNotifications] = useState<
    Notification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [topN, setTopN] = useState(10);

  /**
   * Fetch and recalculate priority notifications
   */
  const recalculatePriorities = async () => {
    try {
      setLoading(true);
      Log(
        "frontend",
        "info",
        "hook",
        `usePriorityNotifications: Recalculating priorities for top ${topN}`
      );

      // Dynamically import to avoid issues
      const { fetchPriorityNotifications } = await import(
        "../api/notificationApi"
      );
      const data = await fetchPriorityNotifications(topN);
      setPriorityNotifications(data);
      Log(
        "frontend",
        "info",
        "hook",
        `usePriorityNotifications: Calculated and set top ${data.length} priority notifications`
      );
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(
        err instanceof Error ? err : new Error(errorMessage)
      );
      Log(
        "frontend",
        "error",
        "hook",
        `usePriorityNotifications: Failed to calculate priorities - ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize hook
   */
  useEffect(() => {
    Log("frontend", "info", "hook", "usePriorityNotifications hook initialized");
    recalculatePriorities();
  }, [topN]); // Recalculate when topN changes

  /**
   * Update the value of N
   */
  const setN = (n: number) => {
    if (n !== topN) {
      Log(
        "frontend",
        "info",
        "hook",
        `usePriorityNotifications: User changed topN from ${topN} to ${n}`
      );
      setTopN(n);
    }
  };

  return {
    priorityNotifications,
    loading,
    error,
    topN,
    setN,
    recalculatePriorities,
  };
}
