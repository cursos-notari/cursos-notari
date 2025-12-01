export const PaymentMethodSelectorSkeleton = () => (
  <div className="flex flex-col space-y-4 mb-6 max-h-20">
    <div className="h-7 w-64 bg-gray-200 animate-pulse rounded-md mx-auto" />
    <div className="flex space-x-4">
      <div className="h-10 w-44 bg-gray-200 animate-pulse rounded-md" />
      <div className="h-10 w-28 bg-gray-200 animate-pulse rounded-md" />
      <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md" />
    </div>
  </div>
);