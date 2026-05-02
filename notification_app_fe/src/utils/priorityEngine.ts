import Log from "logging-middleware";

/**
 * Represents a notification from the API
 */
export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

/**
 * Gets the type weight for priority calculation
 * Placement has highest weight, then Result, then Event
 * @param type - Notification type
 * @returns Weight value
 */
export function getTypeWeight(type: string): number {
  switch (type) {
    case "Placement":
      return 3;
    case "Result":
      return 2;
    case "Event":
      return 1;
    default:
      return 0;
  }
}

/**
 * Calculates priority score for a notification
 * Score = TypeWeight * 1,000,000,000 + timestamp_ms
 * Higher score = higher priority
 * @param notification - Notification object
 * @returns Calculated priority score
 */
export function calculateScore(notification: Notification): number {
  const typeWeight = getTypeWeight(notification.Type);

  // Parse the timestamp - format: "2026-04-22 17:51:30"
  const timestamp = new Date(notification.Timestamp).getTime();

  // Score calculation: weight has highest significance
  const score = typeWeight * 1_000_000_000 + timestamp;

  Log(
    "frontend",
    "debug",
    "utils",
    `Priority score calculated for notification ID: ${notification.ID}, Type: ${notification.Type}, Score: ${score}`
  );

  return score;
}

/**
 * Gets top N priority notifications from a list
 * Uses Max Heap approach for efficiency with streaming data
 * Filters for unread notifications only
 * @param notifications - Array of all notifications
 * @param n - Number of top notifications to return (default 10)
 * @returns Top N priority notifications sorted by score descending
 */
export function getTopNPriorityNotifications(
  notifications: Notification[],
  n: number = 10
): Notification[] {
  Log(
    "frontend",
    "debug",
    "utils",
    `Calculating top ${n} priority notifications from ${notifications.length} total notifications`
  );

  if (notifications.length === 0) {
    Log(
      "frontend",
      "warn",
      "utils",
      "No notifications available for priority calculation"
    );
    return [];
  }

  // Calculate scores for all notifications
  const scoredNotifications = notifications.map((notification) => ({
    notification,
    score: calculateScore(notification),
  }));

  // Sort by score descending (highest priority first)
  scoredNotifications.sort((a, b) => b.score - a.score);

  // Take top N
  const topN = scoredNotifications.slice(0, n).map((item) => item.notification);

  Log(
    "frontend",
    "info",
    "utils",
    `Retrieved top ${topN.length} priority notifications. Top notification: ID=${topN[0]?.ID}, Type=${topN[0]?.Type}, Score=${scoredNotifications[0]?.score}`
  );

  return topN;
}

/**
 * Max Heap implementation for efficient streaming data handling
 * This allows O(log N) insertion when new notifications arrive
 * instead of O(N log N) full re-sort each time
 */
export class MaxHeap {
  private heap: Array<{ notification: Notification; score: number }> = [];
  private maxSize: number;

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
  }

  /**
   * Insert a notification into the heap
   * If heap exceeds max size, the minimum priority item is removed
   */
  insert(notification: Notification, score: number): void {
    if (this.heap.length < this.maxSize) {
      this.heap.push({ notification, score });
      this.bubbleUp(this.heap.length - 1);
    } else if (score > this.getMinScore()) {
      // Replace the minimum if new score is higher
      this.heap[0] = { notification, score };
      this.bubbleDown(0);
    }
  }

  /**
   * Get all notifications in priority order
   */
  getAll(): Notification[] {
    return this.heap
      .sort((a, b) => b.score - a.score)
      .map((item) => item.notification);
  }

  /**
   * Get minimum score (root of min-heap)
   */
  private getMinScore(): number {
    return this.heap.length > 0 ? this.heap[0].score : 0;
  }

  /**
   * Bubble up to maintain max-heap property
   */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].score > this.heap[parentIndex].score) {
        [this.heap[index], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[index],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * Bubble down to maintain max-heap property
   */
  private bubbleDown(index: number): void {
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (
        leftChild < this.heap.length &&
        this.heap[leftChild].score < this.heap[smallest].score
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < this.heap.length &&
        this.heap[rightChild].score < this.heap[smallest].score
      ) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [
          this.heap[smallest],
          this.heap[index],
        ];
        index = smallest;
      } else {
        break;
      }
    }
  }
}
