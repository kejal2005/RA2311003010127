import Log from "logging-middleware";

const VIEWED_NOTIFICATIONS_KEY = "viewed_notifications";

/**
 * Loads viewed notification IDs from localStorage
 * @returns Set of viewed notification IDs
 */
export function getViewedIds(): Set<string> {
  try {
    const stored = localStorage.getItem(VIEWED_NOTIFICATIONS_KEY);
    const ids = stored ? JSON.parse(stored) : [];
    Log(
      "frontend",
      "debug",
      "state",
      `Loaded ${ids.length} viewed notification IDs from localStorage`
    );
    return new Set(ids);
  } catch (error) {
    Log(
      "frontend",
      "warn",
      "state",
      "Failed to parse viewed notifications from localStorage, starting with empty set"
    );
    return new Set();
  }
}

/**
 * Checks if a notification ID has been viewed
 * @param id - Notification ID
 * @returns True if the notification has been viewed
 */
export function isViewed(id: string): boolean {
  const viewedIds = getViewedIds();
  const viewed = viewedIds.has(id);
  return viewed;
}

/**
 * Marks a notification as viewed and persists to localStorage
 * @param id - Notification ID
 */
export function addViewedId(id: string): void {
  try {
    const viewedIds = getViewedIds();
    viewedIds.add(id);

    // Convert Set to Array for JSON serialization
    const idsArray = Array.from(viewedIds);
    localStorage.setItem(VIEWED_NOTIFICATIONS_KEY, JSON.stringify(idsArray));

    Log(
      "frontend",
      "info",
      "state",
      `User marked notification ${id} as viewed, total viewed: ${idsArray.length}`
    );
  } catch (error) {
    Log(
      "frontend",
      "error",
      "state",
      `Failed to save viewed notification ID ${id} to localStorage`
    );
  }
}

/**
 * Gets all viewed notification IDs as an array
 * @returns Array of viewed notification IDs
 */
export function getAllViewedIds(): string[] {
  return Array.from(getViewedIds());
}

/**
 * Clears all viewed notifications from localStorage
 * Useful for testing
 */
export function clearViewedIds(): void {
  try {
    localStorage.removeItem(VIEWED_NOTIFICATIONS_KEY);
    Log("frontend", "info", "state", "Cleared all viewed notification IDs");
  } catch (error) {
    Log("frontend", "error", "state", "Failed to clear viewed notification IDs");
  }
}
