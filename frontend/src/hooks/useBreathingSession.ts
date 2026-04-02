import { useState, useEffect, useCallback } from 'react';
import type { FaseSessao } from '../types/breathing.types';
import {
  RESPIRACOES_PADRAO,
  TEMPO_INSPIRACAO,
  TEMPO_EXPIRACAO,
  TEMPO_RECUPERACAO,
} from '../constants/breathing.constants';

/**
 * Custom Hook para gerenciar uma sessão de respiração Wim Hof
 *
 * Fluxo:
 * 1. RESPIRAÇÃO: 30 ciclos de inspirar (2s) + expirar (2s)
 * 2. RETENÇÃO: Segurar respiração até o usuário decidir parar
 * 3. RECUPERAÇÃO: Inspirar e segurar por 15s
 * 4. FINALIZADA: Mostra resultado
 */
export function useBreathingSession() {
  const [fase, setFase] = useState<FaseSessao>('inicio');
  const [respiracaoAtual, setRespiracaoAtual] = useState(0);
  const [tempoRetencao, setTempoRetencao] = useState(0);
  const [tempoRetencaoFinal, setTempoRetencaoFinal] = useState(0);
  const [pausada, setPausada] = useState(false);
  const [isInhaling, setIsInhaling] = useState(false);
  const [aguardandoRetencao, setAguardandoRetencao] = useState(false);

  const tempoCicloRespiracao = TEMPO_INSPIRACAO + TEMPO_EXPIRACAO;

  useEffect(() => {
    if (fase !== 'respiracao' || pausada || aguardandoRetencao) return;

    const animationTimer = setInterval(() => {
      setIsInhaling(prev => !prev);
    }, TEMPO_INSPIRACAO);

    const countTimer = setInterval(() => {
      setRespiracaoAtual(prev => {
        const { proxima, deveIrParaRetencao } = calcularProximaRespiracao(
          prev,
          RESPIRACOES_PADRAO
        );

        if (deveIrParaRetencao) {
          setIsInhaling(false);
          setAguardandoRetencao(true);
        }

        return proxima;
      });
    }, tempoCicloRespiracao);

    return () => {
      clearInterval(animationTimer);
      clearInterval(countTimer);
    };
  }, [fase, pausada, tempoCicloRespiracao, aguardandoRetencao]);

  useEffect(() => {
    if (fase !== 'respiracao' || !aguardandoRetencao || pausada) return;

    const transitionTimer = setTimeout(() => {
      setFase('retencao');
      setAguardandoRetencao(false);
    }, TEMPO_EXPIRACAO);

    return () => clearTimeout(transitionTimer);
  }, [fase, aguardandoRetencao, pausada]);

  useEffect(() => {
    if (fase !== 'retencao' || pausada) return;

    const timer = setInterval(() => {
      setTempoRetencao(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [fase, pausada]);

  useEffect(() => {
    if (fase !== 'recuperacao' || pausada) return;

    let tempoRestante = TEMPO_RECUPERACAO / 1000;

    const timer = setInterval(() => {
      tempoRestante -= 1;
      setTempoRetencao(tempoRestante);

      if (tempoRestante <= 0) {
        setFase('finalizada');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [fase, pausada]);

  const iniciarSessao = useCallback(() => {
    setFase('respiracao');
    setRespiracaoAtual(0);
    setTempoRetencao(0);
    setTempoRetencaoFinal(0);
    setPausada(false);
    setIsInhaling(false);
    setAguardandoRetencao(false);
  }, []);

  const togglePausa = useCallback(() => {
    setPausada(prev => !prev);
  }, []);

  const pararSessao = useCallback(() => {
    setFase('inicio');
    setRespiracaoAtual(0);
    setTempoRetencao(0);
    setTempoRetencaoFinal(0);
    setPausada(false);
    setIsInhaling(false);
    setAguardandoRetencao(false);
  }, []);

  const proximaFase = useCallback(() => {
    if (fase === 'retencao') {
      setTempoRetencaoFinal(tempoRetencao);
      setTempoRetencao(TEMPO_RECUPERACAO / 1000);
      setFase('recuperacao');
      setIsInhaling(true);
    }
  }, [fase, tempoRetencao]);

  return {
    fase,
    respiracaoAtual,
    totalRespiracoes: RESPIRACOES_PADRAO,
    tempoRetencao,
    tempoRetencaoFinal,
    pausada,
    isInhaling,

    // Funções de controle
    iniciarSessao,
    togglePausa,
    pararSessao,
    proximaFase,
  };
}

export function calcularProximaRespiracao(
  respiracaoAtual: number,
  totalRespiracoes: number
) {
  const proxima = Math.min(respiracaoAtual + 1, totalRespiracoes);

  return {
    proxima,
    deveIrParaRetencao: proxima === totalRespiracoes,
  };
}
