import { useEffect, useMemo, useState } from 'react';
import { checkAchievements, getMyAchievements } from '../../api/achievementApi';
import { getApiErrorMessage } from '../../api/apiError';
import type {
  LockedAchievement,
  UnlockedAchievement,
} from '../../types/achievement.types';

const AchievementList = () => {
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([]);
  const [locked, setLocked] = useState<LockedAchievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const completion = useMemo(() => {
    const total = unlocked.length + locked.length;
    if (!total) return 0;
    return Math.round((unlocked.length / total) * 100);
  }, [locked.length, unlocked.length]);

  useEffect(() => {
    async function fetchAchievements() {
      setLoading(true);
      try {
        const data = await getMyAchievements();
        setUnlocked(data.unlocked);
        setLocked(data.locked);
        setTotalPoints(data.total_points);
      } catch (error) {
        console.error(
          getApiErrorMessage(error, 'Erro ao carregar conquistas.')
        );
      } finally {
        setLoading(false);
      }
    }
    void fetchAchievements();
  }, []);

  const handleCheckAchievements = async () => {
    setChecking(true);
    try {
      await checkAchievements();
      const data = await getMyAchievements();
      setUnlocked(data.unlocked);
      setLocked(data.locked);
      setTotalPoints(data.total_points);
    } catch (error) {
      console.error(getApiErrorMessage(error, 'Erro ao verificar conquistas.'));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="flex flex-col gap-2 mb-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Conquistas</h1>
        <button
          type="button"
          onClick={handleCheckAchievements}
          disabled={checking}
          className="bg-capy-primary text-white px-4 py-2 rounded hover:bg-capy-primary/90 disabled:opacity-50"
        >
          {checking ? 'Verificando...' : 'Verificar novas conquistas'}
        </button>
      </div>

      {loading ? (
        <div>Carregando conquistas...</div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Pontos</p>
              <p className="text-xl font-bold">{totalPoints}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Desbloqueadas</p>
              <p className="text-xl font-bold">{unlocked.length}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">Conclusão</p>
              <p className="text-xl font-bold">{completion}%</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-3">Desbloqueadas</h2>
          {unlocked.length === 0 ? (
            <div className="mb-8 text-gray-600">
              Nenhuma conquista desbloqueada ainda.
            </div>
          ) : (
            <ul className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlocked.map(a => (
                <li
                  key={a.id}
                  className="p-4 rounded border-2 border-green-500 bg-green-50"
                >
                  <p className="font-bold text-lg">
                    {a.icon} {a.name}
                  </p>
                  <p className="text-sm text-gray-600">{a.description}</p>
                  <p className="text-xs text-green-700 mt-2">
                    +{a.points} pts • {a.rarity}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <h2 className="text-xl font-semibold mb-3">Em progresso</h2>
          {locked.length === 0 ? (
            <div className="text-gray-600">
              Parabéns! Você concluiu todas as conquistas.
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locked.map(a => (
                <li key={a.id} className="p-4 rounded border bg-gray-50">
                  <p className="font-bold text-lg">
                    {a.icon} {a.name}
                  </p>
                  <p className="text-sm text-gray-600">{a.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Progresso: {a.progress.current}/{a.progress.target} (
                    {Math.round(a.progress.percentage)}%)
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default AchievementList;
