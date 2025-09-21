import type { Status } from "../../types";

export function getPreviousStatus(status: Status): Status | null {
  if (status === "finished") return "started";
  if (status === "started") return "unstarted";
  return null;
}

export function getNextStatus(status: Status): Status | null {
  if (status === "unstarted") return "started";
  if (status === "started") return "finished";
  return null;
}
