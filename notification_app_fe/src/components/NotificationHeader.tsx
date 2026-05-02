import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  ButtonGroup,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import Log from "logging-middleware";

interface NotificationHeaderProps {
  activeFilter: "All" | "Placement" | "Result" | "Event";
  onFilterChange: (filter: "All" | "Placement" | "Result" | "Event") => void;
  counts: {
    all: number;
    placement: number;
    result: number;
    event: number;
  };
}

/**
 * NotificationHeader Component
 * Displays app bar with filter buttons and navigation
 */
const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleFilterChange = (filter: "All" | "Placement" | "Result" | "Event") => {
    Log(
      "frontend",
      "info",
      "component",
      `User changed notification filter from ${activeFilter} to ${filter}`
    );
    onFilterChange(filter);
  };

  const handleNavigateToPriority = () => {
    Log(
      "frontend",
      "info",
      "component",
      "User navigated to Priority Inbox page from All Notifications"
    );
    router.push("/priority");
  };

  return (
    <AppBar position="sticky" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
          }}
        >
          📬 Notifications Hub
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
            <Button
              size="small"
              variant={activeFilter === "All" ? "contained" : "outlined"}
              onClick={() => handleFilterChange("All")}
              sx={{
                color: activeFilter === "All" ? "#fff" : "#fff",
                borderColor: "#fff",
                backgroundColor: activeFilter === "All" ? "rgba(255,255,255,0.3)" : "transparent",
              }}
            >
              All
              <Chip
                label={counts.all}
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: activeFilter === "All" ? "#fff" : "rgba(255,255,255,0.3)",
                  color: "#1976d2",
                  fontWeight: 700,
                  height: "20px",
                }}
              />
            </Button>

            <Button
              size="small"
              variant={activeFilter === "Placement" ? "contained" : "outlined"}
              onClick={() => handleFilterChange("Placement")}
              sx={{
                color: "#fff",
                borderColor: "#fff",
                backgroundColor: activeFilter === "Placement" ? "rgba(255,255,255,0.3)" : "transparent",
              }}
            >
              Placement
              <Chip
                label={counts.placement}
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: activeFilter === "Placement" ? "#fff" : "rgba(255,255,255,0.3)",
                  color: "#1976d2",
                  fontWeight: 700,
                  height: "20px",
                }}
              />
            </Button>

            <Button
              size="small"
              variant={activeFilter === "Result" ? "contained" : "outlined"}
              onClick={() => handleFilterChange("Result")}
              sx={{
                color: "#fff",
                borderColor: "#fff",
                backgroundColor: activeFilter === "Result" ? "rgba(255,255,255,0.3)" : "transparent",
              }}
            >
              Result
              <Chip
                label={counts.result}
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: activeFilter === "Result" ? "#fff" : "rgba(255,255,255,0.3)",
                  color: "#2e7d32",
                  fontWeight: 700,
                  height: "20px",
                }}
              />
            </Button>

            <Button
              size="small"
              variant={activeFilter === "Event" ? "contained" : "outlined"}
              onClick={() => handleFilterChange("Event")}
              sx={{
                color: "#fff",
                borderColor: "#fff",
                backgroundColor: activeFilter === "Event" ? "rgba(255,255,255,0.3)" : "transparent",
              }}
            >
              Event
              <Chip
                label={counts.event}
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: activeFilter === "Event" ? "#fff" : "rgba(255,255,255,0.3)",
                  color: "#ed6c02",
                  fontWeight: 700,
                  height: "20px",
                }}
              />
            </Button>
          </Box>
        )}

        <Button
          variant="contained"
          size="small"
          onClick={handleNavigateToPriority}
          sx={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "#fff",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.3)",
            },
          }}
        >
          {isMobile ? "Priority" : "⭐ Priority Inbox"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NotificationHeader;
