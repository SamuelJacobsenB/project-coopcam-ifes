import { ScannedUser } from "@/types";

export function validateScannedUser(user: ScannedUser): boolean {
  const userNameRegex = /^[a-zA-Z0-9\s]+$/;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!user.userName || !userNameRegex.test(user.userName.trim())) {
    return false;
  }

  if (!user.userId || !uuidRegex.test(user.userId.trim())) {
    return false;
  }

  return true;
}
