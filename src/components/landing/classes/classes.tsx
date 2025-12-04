import { Suspense } from 'react';
import { getOpenClasses } from '@/actions/server/class/get-open-classes';
import PublicClassCard from './public-class-card';
import NoClasses from './no-classes';
import PublicClassCardSkeleton from '@/components/skeletons/public-class-card-skeleton';

async function ClassesList() {
  const classes = await getOpenClasses();

  if (!classes || classes.length === 0) return <NoClasses />;

  return (

    <div className='flex flex-col w-full gap-6 items-center'>
      <h2 id='classes' className='text-sky-500 font-bold text-[2.5rem]'>
        Turmas Disponíveis
      </h2>
      <div className="flex flex-wrap w-full gap-6 h-[480px] justify-center">
        {classes.map(turma => <PublicClassCard key={turma.id} class={turma} />)}
      </div>
    </div>
  );
}

export default function ClassesSection() {
  return (
    <section>
      <Suspense fallback={<PublicClassCardSkeleton />}>
        <ClassesList />
      </Suspense>
    </section>
  );
}