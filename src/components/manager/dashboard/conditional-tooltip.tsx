import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function ConditionalTooltip({
  children,
  showTooltip,
  message,
  side
}: {
  children: React.ReactNode;
  showTooltip: boolean;
  message: string;
  side?: "top" | "bottom" | "left" | "right";
}) {

  if (!showTooltip) return <>{children}</>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{children}</div>
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}