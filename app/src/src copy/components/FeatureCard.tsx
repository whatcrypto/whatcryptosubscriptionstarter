import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  iconBgColor: string;
}

export function FeatureCard({ icon: Icon, title, description, iconColor, iconBgColor }: FeatureCardProps) {
  return (
    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
      <div className={`${iconBgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}