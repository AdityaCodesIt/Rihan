import React from 'react';
import { getDepartmentById } from '../../data/departments';
import { useStore } from '../../store/useStore';
import {
  Hammer,
  Trash2,
  Droplets,
  Waves,
  Zap,
  Activity,
  Building2,
  Trees,
  Compass,
  PawPrint
} from 'lucide-react';

interface DepartmentChipProps {
  departmentId: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Hammer,
  Trash2,
  Droplets,
  Waves,
  Zap,
  Activity,
  Building2,
  Trees,
  Compass,
  PawPrint
};

export const DepartmentChip: React.FC<DepartmentChipProps> = ({
  departmentId,
  size = 'md',
  showIcon = true
}) => {
  const language = useStore((state) => state.language);
  const dept = getDepartmentById(departmentId);
  const IconComponent = ICON_MAP[dept.icon] || Hammer;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg border backdrop-blur-md transition-all ${sizeStyles}`}
      style={{
        backgroundColor: `${dept.color}15`,
        borderColor: `${dept.color}35`,
        color: dept.color
      }}
    >
      {showIcon && <IconComponent className={iconSizes} />}
      <span className="truncate">{dept.name[language] || dept.name.en}</span>
    </span>
  );
};
