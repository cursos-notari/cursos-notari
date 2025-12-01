import { Suspense } from 'react';
import Dashboard from "./dashboard";
import { getAllClassesWithSchedules } from "@/actions/server/class/get-all";
import { createClient } from "@/supabase/server-client";
import { DashboardSkeleton } from '@/components/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Gerencia as turmas',
}

export default function Page() {
  const classesPromise = async () => {
    const supabase = await createClient();
    return getAllClassesWithSchedules(supabase);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard classes={classesPromise()} />
      </Suspense>
    </div>
  )
}