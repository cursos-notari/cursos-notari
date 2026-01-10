import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { IconCirclePlus } from "@tabler/icons-react";
import { ClassCardSkeleton } from "./class-card-skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="grid auto-rows-[minmax(17rem,_auto)] gap-4 md:grid-cols-3 lg:grid-cols-4">
      <Card className='h-full'>
        <CardHeader>&nbsp;</CardHeader>
        <CardContent className="flex flex-grow flex-col items-center justify-center gap-2">
          <span>Criar turma</span>
          <IconCirclePlus />
        </CardContent>
        <CardFooter>&nbsp;</CardFooter>
      </Card>

      {Array.from({ length: 7 }).map((_, index) => (
        <ClassCardSkeleton key={index} />
      ))}
    </div>
  );
}