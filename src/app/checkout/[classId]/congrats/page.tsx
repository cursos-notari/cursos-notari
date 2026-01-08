import { getPreRegistrationById } from '@/server/pre-registration/get-pre-registration-by-id';
import PixDisplay from '@/components/checkout/steps/payment/pix-display';
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { isValidUUID } from '@/utils/is-valid-UUID';

const FallBack = () => (
  <div className='w-screen h-screen flex items-center justify-center'>
    <div className="animate-float">
      <Image
        alt="Logo"
        src={'/img/icon.png'}
        width={100}
        height={100}
        priority
      />
    </div>
  </div>
)

type CongratsPageProps = {
  params: Promise<{ classId: string }>
}

export default async function CongratsPage({ params }: CongratsPageProps) {
  return (
    <Suspense fallback={<FallBack />}>
      <CongratsContent params={params} />
    </Suspense>
  )
}

async function CongratsContent({ params }: CongratsPageProps) {

  const { classId } = await params;

  if(!isValidUUID(classId)) notFound();

  const cookieStore = await cookies();
  const preRegistrationId = cookieStore.get('pre_registration_id')?.value;

  if (!preRegistrationId) redirect('/');

  const preRegistration = await getPreRegistrationById(preRegistrationId);

  if (!preRegistration.success) throw new Error("Erro ao acessar o pré-registro.");

  if (!preRegistration.data) redirect('/');

  if (preRegistration.data.class_id !== classId) notFound();

  // Se já foi confirmado, redireciona para success
  if (preRegistration.data.status === 'confirmed') {
    redirect(`/checkout/${preRegistration.data.class_id}/success`);
  }

  const { name, pagbank_order_data } = preRegistration.data;

  const qrCode = pagbank_order_data?.qr_codes?.[0]!;

  return (
    <div className='flex justify-center min-h-screen px-5 md:px-20 space-y-10 items-center md:items-start'>
      <div className="flex flex-col min-h-screen space-y-10 max-w-2xl justify-center">
        <Image
          alt="Logo"
          src={'/img/logo-secundary-fit.png'}
          width={200}
          height={200}
          priority
        />
        <div className='flex flex-col gap-3'>
          <h1 className='text-xl font-medium text-gray-800' >Parabéns, {name}!</h1>
          <h3 className='text-gray-800 text-3xl font-medium'>
            Seu pagamento está sendo processado.
          </h3>
        </div>
        <PixDisplay qrCodeData={qrCode} />
      </div>
    </div>
  )
}