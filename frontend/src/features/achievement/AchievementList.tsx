import React, { useEffect, useState } from 'react';
import { getAchievements } from '../../api/achievementApi';
import type { Achievement } from '../../types/achievement.types';

const AchievementList = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      setLoading(true);
      try {
        const data = await getAchievements();
        setAchievements(data);
      } catch (err) {
        // erro silencioso
      } finally {
        setLoading(false);
      }
    }
    fetchAchievements();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4">Conquistas</h1>
      {loading ? (
        <div>Carregando conquistas...</div>
      ) : achievements.length === 0 ? (
        <div>Nenhuma conquista encontrada.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(a => (
            <li
              key={a.id}
              className={`p-4 rounded shadow flex flex-col gap-2 border-2 ${a.unlocked ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}
            >
              <span className="font-bold text-lg">{a.name}</span>
              <span className="text-gray-600 text-sm">{a.description}</span>
              {a.unlocked && (
                <span className="text-green-600 font-semibold">
                  Desbloqueada!
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AchievementList;
