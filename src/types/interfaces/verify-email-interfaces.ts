export interface StorageState extends Omit<VerificationState, 'code' | 'isVerifying' | 'isResending'> {
  timerStartTime?: number;
}

export interface VerificationState {
  code: string;
  isVerifying: boolean;
  isResending: boolean;
  error: string;
  resendTimer: number;
  canResend: boolean;
  maxAttemptsExceeded: boolean;
  maxResendAttemptsExceeded: boolean;
  isVerified: boolean;
}

export interface EmailVerificationParams {
  name: string
  email: string;
  classId: string;
  className: string;
  resetState: boolean;
}