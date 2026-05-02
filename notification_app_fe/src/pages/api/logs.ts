import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
    if (!token) {
      return res.status(401).json({ success: false, message: "Auth token not configured" });
    }

    const logData = req.body;

    const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      console.error(`Logging API Error: ${response.status}`);
      // Don't throw error for logging failures - logging should never crash the app
      return res.status(200).json({ success: true, message: "Logged (with error)" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Logging API Proxy Error:", message);
    // Don't throw error for logging failures - logging should never crash the app
    return res.status(200).json({ success: true, message: "Logged (with error)" });
  }
}
