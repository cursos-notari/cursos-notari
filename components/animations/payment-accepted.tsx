"use client";

import { LottieAnimation } from '@/components/ui/lottie-animation';
import tickAnimation from '@/assets/animations/tick-market.json';

export default function SuccessAnimation() {
  return (
    <div className="flex flex-col items-center justify-center text-center max-h-[180px]">
      <LottieAnimation 
        animationData={tickAnimation}
        width={110}
        height={110}
        loop={false}
        autoplay={true}
      />
      <h1 className="text-xl font-bold text-green-600 mb-2">
        Pagamento Confirmado!
      </h1>
      <p className="text-gray-600 text-sm font-medium">
        Sua inscrição foi realizada com sucesso.
      </p>
    </div>
  );
}
