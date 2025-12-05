// User statistics panel

import { UserStats } from '@/lib/types';
import { Card } from '../ui/Card';

interface StatsPanelProps {
  stats: UserStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const accuracy =
    stats.totalQuestionsAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestionsAnswered) * 100)
      : 0;

  return (
    <Card>
      <h2 className="text-xl font-semibold text-text-primary mb-4">Your Stats</h2>

      <div className="grid grid-cols-2 gap-4">
        <StatItem
          label="Quizzes Completed"
          value={stats.totalQuizzesCompleted.toString()}
        />
        <StatItem label="Current Streak" value={`${stats.currentStreak} days`} />
        <StatItem label="Accuracy" value={`${accuracy}%`} />
        <StatItem label="Best Streak" value={`${stats.longestStreak} days`} />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-text-secondary mb-3">
          Category Performance
        </h3>
        <div className="space-y-2">
          {Object.entries(stats.categoryStats).map(([category, categoryStats]) => {
            const categoryAccuracy =
              categoryStats.total > 0
                ? Math.round((categoryStats.correct / categoryStats.total) * 100)
                : 0;

            return (
              <div key={category} className="flex justify-between text-sm">
                <span className="text-text-primary">{category}</span>
                <span className="text-text-secondary">{categoryAccuracy}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      <div className="text-xs text-text-secondary mt-1">{label}</div>
    </div>
  );
}
