import type { LockedAchievement, UnlockedAchievement } from '../../types/achievement.types';

type AchievementItemProps = {
  achievement: LockedAchievement | UnlockedAchievement;
  unlocked?: boolean;
  onClick?: () => void;
};

const AchievementItem = ({
  achievement,
  unlocked = false,
  onClick,
}: AchievementItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        unlocked
          ? 'border-emerald-300 bg-emerald-50/80'
          : 'border-capy-secondary/30 bg-white/85'
      }`}
    >
      <p className="font-bold text-lg text-capy-dark">
        {achievement.icon} {achievement.name}
      </p>
      <p className="text-sm text-gray-600">{achievement.description}</p>
      {'progress' in achievement ? (
        <p className="mt-2 text-xs text-gray-500">
          Progresso: {achievement.progress.current}/{achievement.progress.target}{' '}
          ({Math.round(achievement.progress.percentage)}%)
        </p>
      ) : (
        <p className="mt-2 text-xs font-semibold text-emerald-700">+{achievement.points} pts • {achievement.rarity}</p>
      )}
    </button>
  );
};

export default AchievementItem;
