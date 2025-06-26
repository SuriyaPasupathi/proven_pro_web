import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { decrementTimer, decrementResendCooldown } from '@/store/Slice/RegisterSlice';

export const useOTPTimer = () => {
  const dispatch = useAppDispatch();
  const { otpTimer, otpExpired, resendCooldown, verified } = useAppSelector(
    (state) => state.register
  );

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format time helper
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    // Clear existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Start new timer if needed
    if (otpTimer > 0 && !verified) {
      timerIntervalRef.current = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [otpTimer, verified, dispatch]);

  // Resend cooldown effect
  useEffect(() => {
    // Clear existing cooldown timer
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = null;
    }

    // Start new cooldown timer if needed
    if (resendCooldown > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        dispatch(decrementResendCooldown());
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
        cooldownIntervalRef.current = null;
      }
    };
  }, [resendCooldown, dispatch]);

  return {
    otpTimer,
    otpExpired,
    resendCooldown,
    formatTime,
    isTimerActive: otpTimer > 0 && !verified,
    isCooldownActive: resendCooldown > 0,
  };
}; 