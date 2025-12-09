"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, AlertCircleIcon } from 'lucide-react';
import { QrCode } from '@/types/interfaces/payment/pagbank/order';
import { Spinner } from '@/components/ui/spinner';

interface PixDisplayProps {
  qrCodeData: QrCode
}

// função para calcular o tempo restante
const calculateTimeLeft = (expirationDate: string): string | boolean => {
  const expiration = new Date(expirationDate).getTime();
  const now = new Date().getTime();
  const distance = expiration - now;

  if (distance < 0) return false;

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const PixDisplay = React.memo(function PixDisplay({ qrCodeData }: PixDisplayProps) {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const [isCopied, setIsCopied] = useState(false);

  // calcula o tempo inicial
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(qrCodeData.expiration_date)
  );

  // memoização da URL da imagem do QR Code
  const qrCodeImageUrl = useMemo(() =>
    qrCodeData.links.find(link => link.rel === 'QRCODE.PNG')?.href,
    [qrCodeData.links]
  );

  // função memoizada para copiar o código PIX
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(qrCodeData.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar código PIX:', error);

      // fallback para browsers mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = qrCodeData.text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [qrCodeData.text]);

  // efeito para atualizar o contador a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(qrCodeData.expiration_date);
      setTimeLeft(newTimeLeft ?? 'Expirado');

      // para o intervalo se expirou
      if (!newTimeLeft) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrCodeData.expiration_date]);

  if (!qrCodeImageUrl) throw new Error("deu ruim");

  return (
    <Card className="gap-10 min-w-2xl max-w-2xl rounded-none border-none shadow-none py-0">
      <CardContent className="flex flex-col items-center gap-6 px-0!">
        {(isClient && timeLeft) ?
          <div className="w-full flex items-center bg-accent py-1 min-h-10 rounded-sm border justify-center gap-2 text-center">
            <AlertCircleIcon size={20} />
            <p className="text-sm font-semibold text-gray-600">Este código expira em:</p>
            <p className="text-lg text-gray-800 font-bold">{timeLeft}</p>
          </div>
          :
          <div className="w-full flex items-center bg-accent py-1 min-h-10 rounded-sm border justify-center gap-2 text-center">
            <Spinner />
          </div>
        }
        <div className='w-full flex gap-6'>
          <div className="flex justify-center">
            <Image
              src={qrCodeImageUrl}
              alt="QR Code PIX"
              width={200}
              height={200}
              priority
            />
          </div>
          <div className="flex flex-col flex-1 justify-between py-5">
            <h3 className='text-gray-800 font-medium'>
              Escaneie o QR Code ou copie o código Pix para pagar.
            </h3>
            <p className='text-gray-700 text-sm'>
              Após realizar o pagamento, você receberá um email com instruções e ingressos para as aulas.
            </p>
            {/* não pode renderizar no server side, porque até chegar no client side, vai dar mismatch */}
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={qrCodeData.text}
                className="text-xs truncate"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0 cursor-pointer"
              >
                {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default PixDisplay;