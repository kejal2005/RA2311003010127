import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | {
      notifications: any[];
    }
  | {
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
    if (!token) {
      return res.status(401).json({ error: "Auth token not configured" });
    }

    // Build query string from client request
    const queryParams = new URLSearchParams();
    if (req.query.limit) queryParams.append("limit", req.query.limit as string);
    if (req.query.page) queryParams.append("page", req.query.page as string);
    if (req.query.notification_type)
      queryParams.append("notification_type", req.query.notification_type as string);

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
      const errorText = await response.text();
      console.error(`API Error: ${response.status} ${errorText}`);
      return res
        .status(response.status)
        .json({ error: `API returned ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("API Proxy Error:", message);
    return res.status(500).json({ error: message });
  }
}
