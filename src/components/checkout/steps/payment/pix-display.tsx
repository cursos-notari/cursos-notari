"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';
import { QrCode } from '@/types/interfaces/pagbank/order';

interface PixDisplayProps {
  qrCodeData: QrCode
}

// Função para calcular o tempo restante
const calculateTimeLeft = (expirationDate: string): string => {
  const expiration = new Date(expirationDate).getTime();
  const now = new Date().getTime();
  const distance = expiration - now;

  if (distance < 0) return "Expirado";

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const PixDisplay = React.memo(function PixDisplay({ qrCodeData }: PixDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Calcula o tempo inicial IMEDIATAMENTE (antes do useEffect)
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(qrCodeData.expiration_date)
  );

  // Memoização da URL da imagem do QR Code
  const qrCodeImageUrl = useMemo(() =>
    qrCodeData.links.find(link => link.rel === 'QRCODE.PNG')?.href,
    [qrCodeData.links]
  );

  // Função memoizada para copiar o código PIX
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(qrCodeData.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar código PIX:', error);

      // Fallback para browsers mais antigos
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

  // Efeito para atualizar o contador a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(qrCodeData.expiration_date);
      setTimeLeft(newTimeLeft);

      // Para o intervalo se expirou
      if (newTimeLeft === "Expirado") {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrCodeData.expiration_date]);

  if (!qrCodeImageUrl) {
    return <p>Erro ao carregar o QR Code.</p>;
  }

  return (
    <Card className="w-full gap-10 max-h-100 min-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className='text-gray-700'>Pague com PIX</CardTitle>
        <CardDescription className='font-medium'>
          Abra o app do seu banco e escaneie o código abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="p-4 border rounded-lg bg-white w-2/3 flex justify-center">
          <Image
            src={qrCodeImageUrl}
            alt="QR Code PIX"
            width={200}
            height={200}
            priority
          />
        </div>
        <div className='border-l border-gray-300 mx-6 h-55'></div>
        <div className="w-full space-y-2 text-center">
          <p className="text-sm font-medium">Ou use o PIX Copia e Cola:</p>
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
          {timeLeft && (
            <div className="text-center mt-10">
              <p className="text-sm text-gray-600">Este código expira em:</p>
              <p className="text-lg font-bold text-red-600">{timeLeft}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default PixDisplay;