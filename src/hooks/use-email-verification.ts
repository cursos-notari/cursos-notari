'use client'

import { useCallback, useState, useTransition, useEffect, useRef } from "react";
import { EmailVerificationFormProps } from "@/components/email-verification/email-verification-form";
import { resendVerificationCode } from "@/actions/server/email/resend-verification-code";
import { verifyEmailCode } from "@/actions/server/email/verify-email-code";
import { toast } from "sonner";
import { notFound } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UseEmailVerificationParams extends EmailVerificationFormProps {
  router: AppRouterInstance;
}

type ErrorState = {
  message: string;
  type: 'verification' | 'resend' | null;
}

type BlockState = {
  verification: boolean;
  resend: boolean;
}

// utils sessionStorage
const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Erro ao salvar no sessionStorage:', error);
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  }
};

export function useEmailVerification({ preRegistration, classData, router }: UseEmailVerificationParams) {

  const { email, name, token } = preRegistration;

  const { id: classId, name: className } = classData;

  const [code, setCode] = useState('');

  const [error, setError] = useState<ErrorState>({ message: '', type: null });

  const [blocked, setBlocked] = useState<BlockState>({
    verification: false,
    resend: false
  });

  const [resendTimer, setResendTimer] = useState(0);

  const [isHydrated, setIsHydrated] = useState(false);

  const [isVerified, setIsVerified] = useState(false);

  const [isVerifying, startVerificationTransition] = useTransition();
  const [isResending, startResendingTransition] = useTransition();

  const canVerify = !blocked.verification && !isVerifying && code.length === 6;
  const canResend = !blocked.resend && !isResending && resendTimer === 0;

  if (!router) {
    console.error('O hook useRouter não foi recebido');
    return null;
  }

  if (!email || !classId || !className || !name) {
    console.error('Dados incompletos no hook');
    return null;
  }

  const clearStorage = useCallback(() => {
    storage.remove(`${token}_blocked`);
    storage.remove(`${token}_timer`);
    storage.remove(`${token}_initialized`);
    storage.remove(token!);
  }, [token]);

  useEffect(() => {

    const wasInitialized = storage.get(`${token}_initialized`);

    if (wasInitialized) {
      const savedBlocked = storage.get(`${token}_blocked`);

      if (savedBlocked) {
        setBlocked(savedBlocked);
      } else {
        setBlocked({ verification: false, resend: false });
      }

      const savedTimer = storage.get(`${token}_timer`);

      if (savedTimer) {
        const elapsed = Math.floor((Date.now() - savedTimer.savedAt) / 1000);
        const remaining = Math.max(0, savedTimer.value - elapsed);
        if (remaining > 0) setResendTimer(remaining);
      }
    } else {
      const attemptsReset = sessionStorage.getItem(`${token}_attempts_reset`);

      if (attemptsReset === 'false') {
        const savedBlocked = storage.get(`${token}_blocked`);

        if (savedBlocked) {
          setBlocked(savedBlocked);
        } else {
          setBlocked({ verification: false, resend: false });
        }

        const savedTimer = storage.get(`${token}_timer`);
        if (savedTimer) {
          const elapsed = Math.floor((Date.now() - savedTimer.savedAt) / 1000);
          const remaining = Math.max(0, savedTimer.value - elapsed);
          if (remaining > 0) setResendTimer(remaining);
        }
      } else {
        clearStorage();
        setBlocked({ verification: false, resend: false });
        setResendTimer(0);
      }

      storage.set(`${token}_initialized`, true);
    }

    setIsHydrated(true);
  }, [token]);

  useEffect(() => {
    if (!isHydrated) return;
    storage.set(`${token}_blocked`, blocked);
  }, [blocked, token, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    if (resendTimer > 0) {
      storage.set(`${token}_timer`, {
        value: resendTimer,
        savedAt: Date.now()
      });
    } else {
      storage.remove(`${token}_timer`);
    }
  }, [resendTimer, token, isHydrated]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleError = useCallback((code: string, type: 'verification' | 'resend') => {
    const errorMessages: Record<string, { message: string; action?: () => void }> = {
      class_not_found: {
        message: '',
        action: () => notFound()
      },
      email_not_found_for_class: {
        message: 'Email não encontrado para esta turma.',
        action: () => {
          clearStorage();
          router.replace(`/enrollment/${classId}`);
        }
      },
      already_verified: {
        message: '',
        action: () => {
          clearStorage();
          router.replace(`/checkout/${token}`);
        }
      },
      code_expired: {
        message: 'O código de verificação expirou.\nPor favor, solicite um novo.',
        action: () => {
          setCode('');
          setBlocked({ verification: false, resend: false });
        }
      },
      max_attempts_exceeded: {
        message: 'Você excedeu o número máximo de tentativas. Solicite um novo código.',
        action: () => setBlocked((prev) => ({ ...prev, verification: true }))
      },
      code_invalid: {
        message: 'Código incorreto. Tente novamente.'
      },
      REGISTRATION_NOT_FOUND: {
        message: 'Pré-registro não encontrado.',
        action: () => {
          clearStorage();
          toast.error('Pré-registro não encontrado.', { position: 'top-center' });
          setTimeout(() => router.replace(`/enrollment/${classId}`), 2000);
        }
      },
      EMAIL_ALREADY_VERIFIED: {
        message: '',
        action: () => {
          clearStorage();
          toast.info('Este email já foi verificado.', { position: 'top-center' });
          router.replace(`/checkout/${token}`);
        }
      },
      MAX_RESEND_ATTEMPTS_EXCEEDED: {
        message: 'Você atingiu o número máximo de reenvios. Entre em contato com o suporte.',
        action: () => setBlocked(prev => ({ ...prev, resend: true }))
      },
      TOO_MANY_REQUESTS: {
        message: 'Aguarde um momento antes de solicitar um novo código.',
        action: () => setResendTimer(30)
      },
      INVALID_INPUT: {
        message: 'Dados inválidos. Verifique o código e tente novamente.'
      }
    };

    const errorConfig = errorMessages[code] || {
      message: type === 'verification'
        ? 'Não foi possível verificar o código. Tente novamente.'
        : 'Não foi possível reenviar o código. Tente novamente.'
    };

    if (errorConfig.message) {
      setError({ message: errorConfig.message, type });
    }

    errorConfig.action?.();
  }, [classId, token, router, clearStorage]);

  const verifyCode = useCallback(async (code: string, e: React.FormEvent) => {
    return new Promise((resolve) => {
      startVerificationTransition(async () => {
        e.preventDefault();
        setError({ message: '', type: null });

        try {
          const res = await verifyEmailCode({
            email: email!,
            classId: classId!,
            verificationCode: code
          });

          if (!res.success) {
            handleError(res.code, 'verification');
            resolve(false);
            return;
          }

          // Marca como verificado para mostrar a tela de sucesso
          setIsVerified(true);

          resolve(true);

        } catch (error: any) {
          console.error('Erro ao verificar código:', error);
          setError({
            message: 'Erro interno ao verificar código. Tente novamente.',
            type: 'verification'
          });
          toast.error('Erro inesperado ao verificar código', {
            position: 'top-center'
          });
          resolve(false);
        }
      });
    });
  }, [email, classId, handleError, clearStorage]);

  const resendCode = useCallback(async () => {
    return new Promise((resolve) => {
      startResendingTransition(async () => {
        setError({ message: '', type: null });

        try {
          const res = await resendVerificationCode({
            name: name!,
            email: email!,
            classId: classId!,
            className: className!,
          });

          if (!res.success && res.code) {
            handleError(res.code, 'resend');
            resolve(false);
            return;
          }

          toast.success('Novo código enviado para seu email!', {
            position: 'top-center'
          });

          // reset dos estados
          setCode('');
          setBlocked({ verification: false, resend: false });
          setResendTimer(30);

          resolve(true);

        } catch (error: any) {
          console.error('Erro ao reenviar código:', error);
          setError({
            message: 'Erro inesperado ao reenviar código. Tente novamente.',
            type: 'resend'
          });
          resolve(false);
        }
      });
    });
  }, [name, email, classId, className, handleError]);

  return {
    code,
    setCode,
    error,
    setError: (msg: string) => setError({ message: msg, type: null }),
    verifyCode,
    resendCode,
    isVerifying,
    isResending,
    canVerify,
    canResend,
    resendTimer,
    isBlocked: blocked.verification || blocked.resend,
    blockedStates: blocked,
    clearStorage,
    isVerified,
  };
}