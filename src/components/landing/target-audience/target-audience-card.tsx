import React from 'react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';

interface TargetAudienceCardProps {
  text: string;
  icon: IconName;
}

export default function TargetAudienceCard({
  text,
  icon,
}: TargetAudienceCardProps) {

  return (
    <div className='interval-card-reveal'>
      <div className='flex flex-col h-full p-5 border justify-center gap-5 bg-stone-50 rounded-lg hover:shadow-md hover:scale-105 transition-transform'>
        <div className="flex w-full h-1/2 justify-center items-center">
          <svg width="0" height="0">
            <defs>
              <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#7dd3fc" />
              </linearGradient>
            </defs>
          </svg>

          <DynamicIcon
            name={icon}
            className='size-20'
            strokeWidth={1.5}
            style={{ stroke: 'url(#icon-gradient)' }}
          />
        </div>
        <div className="flex h-1/3 w-full">
          <p className='text-gray-700 font-medium text-center'>
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}