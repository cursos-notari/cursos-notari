"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field';
import { useEmailVerification } from '@/hooks/use-email-verification';
import { VerificationSuccess } from './verification-success';
import { PreRegistration } from '@/types/database/pre-registration';
import { PublicClass } from '@/types/database/class';
import { useRouter, useSearchParams } from 'next/navigation';

export interface EmailVerificationFormProps {
  preRegistration: Partial<PreRegistration>;
  classData: Partial<PublicClass>;
}

export function EmailVerificationForm({
  preRegistration,
  classData,
}: EmailVerificationFormProps) {

  const router = useRouter();

  const {
    code, setCode,
    error,
    setError,
    verifyCode, resendCode,
    isVerifying, isResending,
    canVerify, canResend,
    resendTimer,
    blockedStates,
    isVerified
  } = useEmailVerification({ preRegistration, classData, router })!;

  if (isVerified) return <VerificationSuccess email={preRegistration.email!} checkoutToken={preRegistration.token!} />;

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-sky-100 rounded-full">
            <Mail className="w-8 h-8 text-sky-500" />
          </div>
          <CardTitle>Verificar Email</CardTitle>
          <CardDescription>
            Digite o código de 6 dígitos enviado para <strong>{preRegistration.email}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={(e) => verifyCode(code, e)}>
            <FieldGroup>
              <Field className='justify-center'>
                <FieldLabel htmlFor='otp' className='sr-only'>
                  Código de verificação
                </FieldLabel>
                <InputOTP
                  id='otp'
                  value={code}
                  onChange={(value) => {
                    value = value.replace(/\D/g, '');
                    setCode(value);
                    // Limpa o erro ao digitar
                    if (error.message) setError('');
                  }}
                  maxLength={6}
                  minLength={6}
                  required
                  disabled={blockedStates.verification}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className='text-center'>
                  {blockedStates.verification
                    ? (blockedStates.resend
                      ? 'Você atingiu o número máximo de reenvios de código.'
                      : 'Solicite um novo código para continuar'
                    )
                    : 'Digite o código de 6 dígitos enviado para o seu email.'}
                </FieldDescription>
              </Field>

              {error.type === 'verification' && error.message && (
                <div className="flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-top-1 duration-300">
                  <p className={`text-sm text-center ${blockedStates.verification || blockedStates.resend ? 'text-red-600 font-medium' : 'text-red-600'}`}>
                    {error.message}
                  </p>
                </div>
              )}

              <Button
                type='submit'
                disabled={!canVerify}
                className="w-full cursor-pointer bg-sky-500 hover:bg-sky-500/80"
                size="lg"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar código'
                )}
              </Button>

              <div className="text-center space-y-4">
                {!blockedStates.resend && (
                  <p className="text-sm text-muted-foreground">
                    Não recebeu o código?
                  </p>
                )}

                <Button
                  type='button'
                  onClick={resendCode}
                  disabled={!canResend}
                  variant="outline"
                  className="cursor-pointer"
                  size="sm"
                >
                  {isResending && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                  {resendTimer > 0
                    ? `Reenviar em ${resendTimer}s`
                    : 'Reenviar código'
                  }
                </Button>

                {error.type === 'resend' && error.message && (
                  <div className="flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    <p className={`text-sm text-center ${blockedStates.verification || blockedStates.resend ? 'text-red-600 font-medium' : 'text-red-600'}`}>
                      {error.message}
                    </p>
                  </div>
                )}
              </div>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className='text-center justify-center'>
          <p className="text-xs text-muted-foreground space-y-1">
            Verifique sua caixa de spam<br />
            Solicite um novo código se exceder as tentativas
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}