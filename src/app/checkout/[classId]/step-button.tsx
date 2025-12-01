import { LucideProps } from 'lucide-react';
import React, { DetailedHTMLProps, HTMLAttributes } from 'react'

interface StepButtonProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  text: string;
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  children?: React.ReactNode;
}

export default function StepButton({ text, icon: Icon, children, ...props }: StepButtonProps) {
  return (
    <div {...props}>
      <div className="flex items-center gap-2">
        {Icon && <Icon />}
        {text}
      </div>
      {children}
    </div>
  )
}