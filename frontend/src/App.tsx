import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBreathingSession } from './hooks/useBreathingSession';
import Navbar from './components/Navbar';
import BreathingCircle from './components/BreathingCircle';
import BreathCounter from './components/BreathCounter';
import Timer from './components/Timer';
import { getMyAchievements } from './api/achievementApi';
import { createSession } from './api/sessionApi';
import { getApiErrorMessage } from './api/apiError';
import { useAuthContext } from './features/auth/AuthProvider';
import {
  MENSAGENS,
  TEMPO_EXPIRACAO,
  TEMPO_INSPIRACAO,
  TEMPO_RECUPERACAO,
} from './constants/breathing.constants';
import { saveAnonymousSession } from './utils/localSessionStorage';
import type { SessionCreateRequest } from './types/session.types';
import type { UnlockedAchievement } from './types/achievement.types';

function App() {
  const {
    fase,
    roundAtual,
    totalRounds,
    retencoesPorRound,
    respiracaoAtual,
    totalRespiracoes,
    tempoRetencao,
    tempoRetencaoFinal,
    pausada,
    isInhaling,
    iniciarSessao,
    togglePausa,
    pararSessao,
    proximaFase,
  } = useBreathingSession();
  const { isAuthenticated, showToast } = useAuthContext();
  const [savingSession, setSavingSession] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [sessionSavedLocally, setSessionSavedLocally] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<UnlockedAchievement[]>([]);
  const handledFinalizationRef = useRef(false);

  const sessionPayloads = useMemo<SessionCreateRequest[]>(() => {
    if (fase !== 'finalizada' || retencoesPorRound.length === 0) {
      return [];
    }

    const breathingDurationSeconds =
      totalRespiracoes * ((TEMPO_INSPIRACAO + TEMPO_EXPIRACAO) / 1000);

    return retencoesPorRound
      .filter(retencao => retencao > 0)
      .map(retencao => ({
        breaths_count: totalRespiracoes,
        retention_time: retencao,
        recovery_time: TEMPO_RECUPERACAO / 1000,
        duration_seconds:
          breathingDurationSeconds + retencao + TEMPO_RECUPERACAO / 1000,
        technique_variant: 'standard',
      }));
  }, [fase, retencoesPorRound, totalRespiracoes]);

  useEffect(() => {
    if (fase !== 'finalizada') {
      handledFinalizationRef.current = false;
      setSavingSession(false);
      return;
    }

    if (!sessionPayloads.length || handledFinalizationRef.current) {
      return;
    }

    handledFinalizationRef.current = true;

    const persistSession = async () => {
      setSavingSession(true);
      setSessionError(null);
      setSessionSaved(false);
      setSessionSavedLocally(false);
      setNewAchievements([]);

      if (!isAuthenticated) {
        sessionPayloads.forEach(payload => saveAnonymousSession(payload));
        setSessionSavedLocally(true);
        setSavingSession(false);
        showToast('Sessão salva temporariamente neste dispositivo.', 'info');
        return;
      }

      try {
        const before = await getMyAchievements();
        const previousIds = new Set(before.unlocked.map(item => item.id));

        await Promise.all(sessionPayloads.map(payload => createSession(payload)));

        const after = await getMyAchievements();
        const unlockedNow = after.unlocked.filter(item => !previousIds.has(item.id));

        setSessionSaved(true);
        setNewAchievements(unlockedNow);
        showToast('Sessão salva no seu histórico!', 'success');
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          'Não foi possível salvar sua sessão agora.'
        );
        setSessionError(message);
        showToast(message, 'error');
      } finally {
        setSavingSession(false);
      }
    };

    void persistSession();
  }, [fase, isAuthenticated, sessionPayloads, showToast]);

  const handleStartSession = () => {
    setSessionSaved(false);
    setSessionSavedLocally(false);
    setSessionError(null);
    setNewAchievements([]);
    iniciarSessao();
  };

  // Renderiza tela inicial (antes de começar)
  if (fase === 'inicio') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-capy-secondary to-capy-accent flex flex-col">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🦫 CapyBreath
          </h1>
          <p className="text-xl text-white/90 mb-12">
            Respiração Consciente e Tranquila
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Como Funciona
            </h2>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-start">
                <span className="mr-3">1️⃣</span>
                <span>30 respirações profundas (inspirar e expirar)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">2️⃣</span>
                <span>Retenção: segure até não aguentar mais</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">3️⃣</span>
                <span>Recuperação: inspire fundo e segure 15s</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🔁</span>
                <span>3 rounds por sessão (padrão)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleStartSession}
            className="px-12 py-5 bg-white text-capy-primary font-bold text-2xl rounded-full hover:bg-white/90 hover:scale-105 transition-all shadow-2xl active:scale-95"
          >
            ▶ Iniciar Sessão
          </button>
        </div>
      </div>
    );
  }

  // Renderiza tela de sessão ativa
  return (
    <div className="min-h-screen bg-gradient-to-b from-capy-secondary to-capy-accent flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          🦫 CapyBreath
        </h1>
        <p className="text-white/80 text-lg">{MENSAGENS[fase]}</p>
        {fase !== 'finalizada' && (
          <p className="text-white/70 text-sm mt-2">
            Round {roundAtual} de {totalRounds}
          </p>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 w-full max-w-2xl">
        {fase === 'respiracao' && (
          <>
            <BreathCounter atual={respiracaoAtual} total={totalRespiracoes} />
            <BreathingCircle isInhaling={isInhaling} fase={fase} />
          </>
        )}

        {fase === 'retencao' && (
          <>
            <Timer segundos={tempoRetencao} label="Tempo de Retenção" />
            <BreathingCircle isInhaling={false} fase={fase} />
            <button
              onClick={proximaFase}
              className="mt-8 px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-bold text-xl rounded-full hover:bg-white/30 transition-all"
            >
              Terminar Retenção →
            </button>
          </>
        )}

        {fase === 'recuperacao' && (
          <>
            <Timer segundos={tempoRetencao} label="Recuperação" />
            <BreathingCircle isInhaling={true} fase={fase} />
            <p className="text-white/80 text-lg">Inspire fundo e segure...</p>
          </>
        )}

        {fase === 'finalizada' && (
          <div className="text-center space-y-6 w-full">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Sessão Concluída!
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-white/70 text-sm uppercase tracking-wide mb-2">
                Tempo de Retenção
              </p>
              <Timer segundos={tempoRetencaoFinal} />
            </div>

            {retencoesPorRound.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left max-w-xl mx-auto">
                <h3 className="text-white font-semibold mb-3">Retenção por round</h3>
                <ul className="space-y-2">
                  {retencoesPorRound.map((valor, index) => (
                    <li key={`round-${index + 1}`} className="flex justify-between text-white/90">
                      <span>Round {index + 1}</span>
                      <span className="font-bold">{valor}s</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-left text-white shadow-lg max-w-xl mx-auto">
              <h3 className="text-xl font-bold mb-3">Resumo da sessão</h3>

              {savingSession && (
                <p className="text-white/90">Salvando sua sessão...</p>
              )}

              {!savingSession && sessionSaved && (
                <p className="text-emerald-200 font-medium">
                  Sessão salva no seu histórico com sucesso.
                </p>
              )}

              {!savingSession && sessionSavedLocally && (
                <div className="space-y-3">
                  <p className="text-amber-100 font-medium">
                    Sessão salva temporariamente neste dispositivo.
                  </p>
                  <p className="text-white/80 text-sm">
                    Faça login ou crie sua conta para migrar essa sessão automaticamente e manter seu histórico.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      to="/login"
                      className="rounded-full bg-white px-4 py-2 text-capy-primary font-semibold hover:bg-white/90 transition"
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-full border border-white/50 px-4 py-2 text-white font-semibold hover:bg-white/10 transition"
                    >
                      Criar conta
                    </Link>
                  </div>
                </div>
              )}

              {!savingSession && sessionError && (
                <p className="text-red-200 font-medium">{sessionError}</p>
              )}

              {!savingSession && isAuthenticated && newAchievements.length > 0 && (
                <div className="mt-4 rounded-xl bg-emerald-500/20 border border-emerald-300/30 p-4">
                  <p className="font-bold text-emerald-100 mb-3">
                    🏆 Novas conquistas desbloqueadas
                  </p>
                  <ul className="space-y-2">
                    {newAchievements.map(achievement => (
                      <li key={achievement.id} className="rounded-lg bg-black/10 p-3">
                        <div className="font-semibold">
                          {achievement.icon} {achievement.name}
                        </div>
                        <div className="text-sm text-white/80">
                          {achievement.description}
                        </div>
                        <div className="text-xs text-emerald-100 mt-1">
                          +{achievement.points} pts • {achievement.rarity}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/achievements"
                    className="inline-flex mt-4 rounded-full bg-white px-4 py-2 text-capy-primary font-semibold hover:bg-white/90 transition"
                  >
                    Ver conquistas
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={handleStartSession}
              className="mt-4 px-10 py-4 bg-white text-capy-primary font-bold text-xl rounded-full hover:bg-white/90 hover:scale-105 transition-all shadow-lg"
            >
              🔄 Nova Sessão
            </button>
          </div>
        )}
      </div>

      {fase !== 'finalizada' && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={togglePausa}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/30 transition-all"
          >
            {pausada ? '▶ Retomar' : '⏸ Pausar'}
          </button>
          <button
            onClick={pararSessao}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/30 transition-all"
          >
            ⏹ Parar
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
