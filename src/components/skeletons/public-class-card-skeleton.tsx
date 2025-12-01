import clsx from 'clsx';

const ClassCardSkeleton = () => <div className="w-full max-w-md min-h-[480px] bg-gray-200 rounded-lg shadow-md animate-pulse" />;

export default function PublicClassCardSkeleton() {
  return (
    <div className='flex flex-col w-full gap-6 items-center'>
      <h2 id='classes' className='text-sky-500 font-bold text-[2.5rem]'>
        Turmas Disponíveis
      </h2>
      <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        <ClassCardSkeleton />
        <ClassCardSkeleton />
        <ClassCardSkeleton />
      </div>
    </div>
  );
}