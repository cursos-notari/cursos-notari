import { ShoppingBag, CircleUserRound, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutSkeleton() {
  
  const steps = [
    { icon: ShoppingBag, text: 'Meus itens' },
    { icon: CircleUserRound, text: 'Meus dados' },
    { icon: CreditCard, text: 'Informações de pagamento' }
  ];

  return (
    <div className="flex flex-col-reverse gap-10 md:flex-row w-full justify-between">
      {/* Steps Column */}
      <div className="flex w-full max-w-2xl gap-10">
        <div className="flex flex-col gap-8 w-full">
          {steps.map((step, index) => (
            <div className="w-full" key={index}>
              <div className="flex items-center w-full text-gray-700 font-semibold transition-colors shadow-sm border gap-2 py-5 pl-5 bg-background justify-between pr-5">
                <div className="flex items-center gap-2">
                  <step.icon />
                  <span className="text-gray-700">{step.text}</span>
                </div>
              </div>

              {/* Skeleton content for first step */}
              {index === 0 && (
                <div className="space-y-4">
                  {/* Course info skeleton */}
                  <div className="border border-t-0 p-6 bg-background space-y-4">
                    <div className="flex justify-between">
                      <div className="w-7/10 space-y-4">
                        <div className="h-5 bg-gray-200 animate-pulse rounded w-1/2"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-2/10"></div>
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-4/10 ml-5"></div>
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-5/10 ml-5"></div>
                        </div>
                        <div className="pt-4 space-y-2">
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-2/10"></div>
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/10 ml-5"></div>
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-5/10 ml-5"></div>
                        </div>
                      </div>
                      {/* Price skeleton */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="h-3 bg-gray-200 animate-pulse rounded w-20"></div>
                        <div className="h-5 bg-gray-200 animate-pulse rounded w-24"></div>
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-28"></div>
                      </div>
                    </div>

                    <div className="h-8 bg-gray-200 animate-pulse rounded w-22 ml-auto"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Review Sidebar */}
      <aside className='md:sticky top-10 flex flex-col w-full self-start md:max-w-md h-fit'>
        <Card className='rounded-none'>
          <CardHeader>
            <CardTitle className='h-5 bg-gray-200 rounded w-1/3 animate-pulse'></CardTitle>
            <CardDescription className='h-3 bg-gray-200 rounded w-2/3 animate-pulse'></CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col text-sm border space-y-6 py-4 px-4'>
              {/* Course info */}
              <div className='flex justify-between'>
                <div className='flex flex-col space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-50 animate-pulse'></div>
                  <div className='h-3 bg-gray-200 rounded w-16 animate-pulse'></div>
                </div>
                <div className='flex flex-col items-end space-y-2'>
                  <div className='h-5 bg-gray-200 rounded w-25 animate-pulse'></div>
                  <div className='h-3 bg-gray-200 rounded w-12 animate-pulse'></div>
                </div>
              </div>

              {/* Schedule */}
              <div className='flex flex-col justify-between space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse'></div>
                <div className='space-y-2 ml-7'>
                  <div className='h-4 bg-gray-200 rounded w-5/6 animate-pulse'></div>
                  <div className='h-4 bg-gray-200 rounded w-5/6 animate-pulse'></div>
                </div>
              </div>

              {/* Info box */}
              <div className='flex bg-muted p-3 space-x-2 text-center'>
                <div className='w-4 h-4 bg-gray-300 rounded-full mt-0.5 shrink-0 animate-pulse'></div>
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-gray-300 rounded w-full animate-pulse'></div>
                  <div className='h-4 bg-gray-300 rounded w-4/5 animate-pulse'></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}