// Progress indicator showing current question

interface ProgressBarProps {
  current: number; // 1-based index
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm text-text-secondary">
        <span>
          Question {current} of {total}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>

      <div className="w-full bg-bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className="bg-accent-primary h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
