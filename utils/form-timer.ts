export const calculateRemainingTime = (startTime: number, RESEND_TIMEOUT = 30): number => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  return Math.max(0, RESEND_TIMEOUT - elapsed);
};