import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConfig } from "../lib/config";
import { logout, refreshToken } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store/store";
import { useToast } from "./use-toast";

const { sessionWarningTimeMs, inactivityTimeoutMs, gracePeriodMs } = getConfig();

export const useSessionManager = () => {
  const dispatch: AppDispatch = useDispatch();
  const { accessToken, expiryTime } = useSelector(
    (state: RootState) => state.auth
  );
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isInactive, setInactive] = useState(false);
  const { toast } = useToast();

  const logoutUser = useCallback(() => {
    dispatch(logout());
    toast({
      title: "Logged out",
      description: "You have been logged out.",
      status: "info",
    });
  }, [dispatch, toast]);

  const refreshUserToken = useCallback(async () => {
    const token = localStorage.getItem("refreshToken");
    try {
      await dispatch(refreshToken(token));
      toast({
        title: "Session Extended",
        description: "Your session has been extended.",
        status: "success",
      });
      setDialogVisible(false);
      setInactive(false);
    } catch {
      logoutUser();
    }
  }, [dispatch, toast, logoutUser]);

  // Watch token expiry
  useEffect(() => {
    if (!accessToken || !expiryTime) return;

    const now = Date.now();
    const timeToExpiry = expiryTime - now;

    if (timeToExpiry <= 0) {
      logoutUser();
      return;
    }

    const warningTimeout = setTimeout(() => {
      // Case 1: Active user → ask confirmation
      // Case 2: Inactive user → auto prompt
      setDialogVisible(true);
    }, timeToExpiry - sessionWarningTimeMs);

    const expiryTimeout = setTimeout(() => {
      // If no confirmation and token actually expires → logout
      logoutUser();
    }, timeToExpiry);

    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(expiryTimeout);
    };
  }, [accessToken, expiryTime, logoutUser]);

  // Track inactivity
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      setInactive(false);
      inactivityTimer = setTimeout(() => {
        setInactive(true); // User became inactive
        setDialogVisible(true); // Case 2 → show dialog
      }, inactivityTimeoutMs);
    };

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, []);

  // Grace period auto logout if inactive
  useEffect(() => {
    if (isInactive) {
      const graceTimeout = setTimeout(() => {
        logoutUser(); // Case 3
      }, gracePeriodMs);

      return () => clearTimeout(graceTimeout);
    }
  }, [isInactive, logoutUser]);

  return {
    isDialogVisible,
    isInactive,
    onConfirm: refreshUserToken, // "Continue session"
    onCancel: logoutUser, // "Logout"
  };
};
