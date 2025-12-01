import { Metadata } from "next";
import { getClassById } from "@/actions/server/class/get-by-id";
import OrderReview from "@/components/checkout/steps/payment/order-review";
import { createServiceClient } from "@/supabase/service-client";
import CheckoutSteps from "./checkout-steps";
import Image from "next/image";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: 'Checkout | Cursos Notari',
  description: 'Finalize sua matrícula e escolha a forma de pagamento.',
}

export default async function CheckoutPage({ params }: { params: Promise<{ classId: string }> }) {

  const { classId } = await params;

  const supabase = createServiceClient();

  if (!supabase) throw new Error('Supabase client not found');

  // busca dados da turma
  const classData = await getClassById(supabase, classId);

  if (!classData.success) throw new Error(classData.message);

  if (!classData.data) notFound();

  const { id, name, registration_fee, schedules } = classData.data!;

  return (
    <div className='bg-accent min-h-screen flex flex-col px-5 md:px-20 space-y-10 py-10 items-center md:items-start'>
      <Image
        alt="Logo"
        src={'/img/logo-secundary-fit.png'}
        width={200}
        height={200}
      />
      <div className="flex flex-col-reverse gap-10 md:flex-row w-full justify-between">
        <CheckoutSteps
          classData={{
            id,
            name,
            registration_fee
          }}
        />
        <OrderReview
          classInfo={{
            name,
            registration_fee,
            schedules
          }}
        />
      </div>
    </div>
  );
}