'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MailCheck } from 'lucide-react';

interface VerificationSuccessProps {
  email: string;
  message?: string;
  checkoutToken: string;
}

export function VerificationSuccess({ email, message = "Email verificado com sucesso!", checkoutToken }: VerificationSuccessProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(`/checkout/${checkoutToken}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, checkoutToken]);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full">
            <MailCheck className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-green-700">Verificação Concluída</CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            O email <strong>{email}</strong> foi verificado com sucesso.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecionando para o checkout...
          </p>

          {/* indicator de loading */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}