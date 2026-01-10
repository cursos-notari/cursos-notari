import { Skeleton } from "@/components/ui/skeleton";

export function ClassDialogSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background relative grid w-full max-w-[calc(100%-2rem)] min-h-[80vh] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-[50vw]">
        <div className="flex flex-col gap-2 text-left">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-7 py-5">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex justify-between">
            <div className="grid gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-[280px]" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-[280px]" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}