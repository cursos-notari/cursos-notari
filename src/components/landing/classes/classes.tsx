import { Suspense } from 'react';
import PublicClassCardSkeleton from '@/components/skeletons/public-class-card-skeleton';
import { getOpenClasses } from '@/actions/server/class/get-open';
import NoClasses from './no-classes';
import PublicClassCard from './public-class-card';

export default async function ClassesSection() {

  const classes = await getOpenClasses();

  if (!classes || classes.length === 0) return <NoClasses />;

  return (
    <section>
      <Suspense fallback={<PublicClassCardSkeleton />}>
        <div className='flex flex-col w-full gap-6 items-center'>
          <h2 id='classes' className='text-sky-500 font-bold text-[2.5rem]'>
            Turmas Disponíveis
          </h2>
          <div className="flex flex-wrap w-full gap-6 h-[480px] justify-center">
            {classes.map(turma => <PublicClassCard key={turma.id} class={turma} />)}
          </div>
        </div>
      </Suspense>
    </section>
  );
}