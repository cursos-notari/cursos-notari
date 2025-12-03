import { Metadata } from "next";
import { getClassById } from "@/actions/server/class/get-by-id";
import OrderReview from "@/components/checkout/steps/payment/order-review";
import { createServiceClient } from "@/supabase/service-client";
import CheckoutSteps from "./checkout-steps";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CheckoutProvider } from "@/contexts/class-data-context";

export const metadata: Metadata = {
  title: 'Checkout | Cursos Notari',
  description: 'Finalize sua matrícula e escolha a forma de pagamento.',
}

export default function CheckoutPage({ params }: { params: Promise<{ classId: string }> }) {
  return (
    <div className='bg-accent min-h-screen flex flex-col px-5 md:px-20 space-y-10 py-10 items-center md:items-start'>
      <Image
        alt="Logo"
        src={'/img/logo-secundary-fit.png'}
        width={200}
        height={200}
        priority
      />

      {/* // TODO: CRIAR SKELETON DESCENTE */}
      <Suspense fallback={<>Carregando...</>}>
        <CheckoutContent params={params} />
      </Suspense>
    </div>
  );
}

async function CheckoutContent({ params }: { params: Promise<{ classId: string }> }) {

  const { classId } = await params;

  const res = await getClassById(classId);

  if (!res.success) throw new Error(res.message);

  if (!res.data) notFound();

  const classData = res.data;

  return (
    <CheckoutProvider classData={res.data}>
      <div className="flex flex-col-reverse gap-10 md:flex-row w-full justify-between">
        <CheckoutSteps />
        <OrderReview />
      </div>
    </CheckoutProvider>
  )
}