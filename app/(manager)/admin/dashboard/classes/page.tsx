import { Suspense } from 'react';
import { getAllClassesWithSchedules } from "@/server/class/get-all-classes-with-schedules";
import { DashboardSkeleton } from '@/components/skeletons';
import Classes from './classes';

export default function Page() {

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Suspense fallback={<DashboardSkeleton />}>
        <Classes classes={getAllClassesWithSchedules()} />
      </Suspense>
    </div>
  )
}