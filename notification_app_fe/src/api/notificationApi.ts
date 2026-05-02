import Log from "../lib/Log";
import {
  Notification,
  getTopNPriorityNotifications,
} from "../utils/priorityEngine";

/**
 * API parameters for fetching notifications
 */
export interface FetchNotificationsParams {
  limit?: number;
  page?: number;
  notification_type?: "Placement" | "Result" | "Event";
}

/**
 * API response format for notifications
 */
export interface NotificationsResponse {
  notifications: Notification[];
}

/**
 * Fetches all notifications from the API
 * Supports filtering by type and pagination
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Array of notifications
 * @throws Error if request fails
 */
export async function fetchAllNotifications(
  params?: FetchNotificationsParams
): Promise<Notification[]> {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  Log(
    "frontend",
    "debug",
    "api",
    `Fetching notifications with params: limit=${params?.limit || "all"}, page=${params?.page || 1}, notification_type=${params?.notification_type || "all"}`
  );

  try {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.notification_type)
      queryParams.append("notification_type", params.notification_type);

    const queryString = queryParams.toString();
    const url = `http://20.207.122.201/evaluation-service/notifications${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `Failed to fetch notifications - status ${response.status} ${response.statusText}`;
      Log("frontend", "error", "api", errorMessage);
      throw new Error(errorMessage);
    }

    const data: NotificationsResponse = await response.json();
    const notificationCount = data.notifications?.length || 0;

    Log(
      "frontend",
      "info",
      "api",
      `Successfully fetched ${notificationCount} notifications from API`
    );

    return data.notifications || [];
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    Log(
      "frontend",
      "error",
      "api",
      `Error fetching notifications: ${errorMessage}`
    );
    throw error;
  }
}

/**
 * Fetches top N priority notifications
 * Calls fetchAllNotifications and applies priority algorithm
 *
 * @param n - Number of top priority notifications to return (default 10)
 * @param params - Optional filtering parameters
 * @returns Array of top N priority notifications
 */
export async function fetchPriorityNotifications(
  n: number = 10,
  params?: FetchNotificationsParams
): Promise<Notification[]> {
  Log(
    "frontend",
    "debug",
    "api",
    `Fetching priority notifications for top ${n}`
  );

  try {
    // First, fetch all notifications
    const allNotifications = await fetchAllNotifications(params);

    // Apply priority engine to get top N
    const priorityNotifications = getTopNPriorityNotifications(
      allNotifications,
      n
    );

    Log(
      "frontend",
      "info",
      "api",
      `Priority notifications calculated: returning top ${priorityNotifications.length} out of ${allNotifications.length} notifications`
    );

    return priorityNotifications;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    Log(
      "frontend",
      "error",
      "api",
      `Error fetching priority notifications: ${errorMessage}`
    );
    throw error;
  }
}
