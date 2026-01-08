import { getPreRegistrationById } from '@/server/pre-registration/get-pre-registration-by-id';
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { Mail } from 'lucide-react';
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
);

type SuccessPageProps = {
  params: Promise<{ classId: string }>
}

export default function SuccessPage({ params }: SuccessPageProps) {
  return (
    <Suspense fallback={<FallBack />}>
      <SuccessContent params={params} />
    </Suspense>
  )
}

async function SuccessContent({ params }: SuccessPageProps) {

  const { classId } = await params;

  if(!isValidUUID(classId)) notFound();

  const cookieStore = await cookies();
  const preRegistrationId = cookieStore.get('pre_registration_id')?.value;

  if (!preRegistrationId) redirect('/');

  const preRegistration = await getPreRegistrationById(preRegistrationId);

  if (!preRegistration.success) throw new Error("Erro ao acessar o pré-registro.");

  if (!preRegistration.data) redirect('/');

  if (preRegistration.data.class_id !== classId) notFound();

  // verifica se o pagamento foi confirmado
  if (preRegistration.data.status !== 'confirmed'){
    redirect(`/checkout/${preRegistration.data.class_id}`);
  } 

  const { name, email } = preRegistration.data;

  return (
    <div className='flex justify-center min-h-screen px-5 md:px-20 items-center md:items-start'>
      <div className="flex flex-col min-h-screen space-y-9 max-w-2xl justify-center">
        <Image
          alt="Logo"
          src={'/img/logo-secundary-fit.png'}
          width={200}
          height={200}
          priority
        />
        <div className='flex flex-col gap-3'>
          <h1 className='text-lg font-medium text-gray-800' >Parabéns, {name}!</h1>
          <h3 className='text-gray-800 text-2xl font-medium'>
            Seu pagamento foi processado com sucesso.
          </h3>
        </div>

        <div className="flex flex-col border p-6 bg-gray-50 items-center space-y-3">
          <Mail className='text-gray-600 size-7' />
          <span className='text-gray-700 font-bold'>{email}</span>
          <p className='text-gray-600 text-center font-medium'>
            Em breve você receberá um e-mail com seus ingressos para as aulas.
          </p>
          <div className='bg-accent border p-6 space-y-3 w-full'>
            <h4 className='font-semibold text-gray-800 text-base'>Próximos passos:</h4>
            <ul className='list-disc list-inside space-y-2 text-gray-700 text-sm'>
              <li>Verifique sua caixa de entrada (e spam) para ver seus ingressos.</li>
              <li>Apresente os ingressos nos dias de aula.</li>
              <li>Em caso de dúvidas, entre em contato através do WhatsApp: <span className='font-semibold'>119XXXX-XXXX</span>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
