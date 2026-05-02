import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Mode, Player, PLAYER_COLORS, Screen, Tone } from "@/lib/gameTypes";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const STORAGE_KEY = "tc-game-state-v1";

type Persisted = {
  screen: Screen;
  players: Player[];
  tone?: Tone;
  gameState?: any;
};

type Ctx = {
  screen: Screen;
  players: Player[];
  user: User | null;
  sessionCount: number;
  hasActivePass: boolean;
  passExpiry: Date | null;
  isLoadingStats: boolean;
  showAuth: boolean;
  showPaywall: boolean;
  tone: Tone;
  gameState: any;
  setShowAuth: (v: boolean) => void;
  setShowPaywall: (v: boolean) => void;
  setTone: (tone: Tone) => void;
  setGameState: (state: any) => void;
  toggleTone: () => void;
  go: (s: Screen) => void;
  setPlayersFromNames: (names: string[], opts?: { couples?: boolean }) => void;
  addScore: (playerId: string, delta: number) => void;
  resetScores: () => void;
  resetAll: () => void;
  recordSession: (gameId: string, mode: Mode, playersCount: number) => Promise<void>;
  refreshStats: () => Promise<void>;
  logout: () => Promise<void>;
};

const GameContext = createContext<Ctx | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function load(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const initial = load();
  const [screen, setScreen] = useState<Screen>(initial?.screen ?? { name: "landing" });
  const [players, setPlayers] = useState<Player[]>(initial?.players ?? []);
  const [user, setUser] = useState<User | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [hasActivePass, setHasActivePass] = useState(false);
  const [passExpiry, setPassExpiry] = useState<Date | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [tone, setTone] = useState<Tone>(initial?.tone ?? "normal");
  const [gameState, setGameState] = useState<any>(initial?.gameState ?? null);

  // Close paywall automatically if pass becomes active
  useEffect(() => {
    if (hasActivePass) {
      setShowPaywall(false);
    }
  }, [hasActivePass]);

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Session Count & Active Pass
  const refreshStats = useCallback(async () => {
    if (!user) {
      setSessionCount(0);
      setHasActivePass(false);
      setPassExpiry(null);
      setIsLoadingStats(false);
      return;
    }

    setIsLoadingStats(true);
    try {
      // 1. Check completed sessions
      const { count } = await supabase
        .from('game_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);
      
      setSessionCount(count || 0);

      // 2. Check active day pass
      const { data: passes } = await supabase
        .from('day_passes')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false })
        .limit(1);

      const active = (passes && passes.length > 0) || false;
      setHasActivePass(active);
      setPassExpiry(active ? new Date(passes![0].expires_at) : null);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, [user]);

  useEffect(() => {
    refreshStats();
  }, [user, refreshStats]);

  // Realtime listener for day_passes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'day_passes',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newPass = payload.new as { status?: string; expires_at?: string };
          if (newPass.status === 'active' && new Date(newPass.expires_at!) > new Date()) {
            setHasActivePass(true);
            setPassExpiry(new Date(newPass.expires_at!));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, players, tone, gameState }));
    } catch {
      /* ignore */
    }
  }, [screen, players, tone, gameState]);

  const go = useCallback((s: Screen) => {
    setScreen(s);
    // If moving AWAY from a game (to landing/discovery/setup), clear game state
    if (s.name !== 'game') {
      setGameState(null);
    }
  }, []);

  const toggleTone = useCallback(
    () => setTone((current) => (current === "normal" ? "adult" : "normal")),
    []
  );

  const setPlayersFromNames = useCallback(
    (names: string[], opts?: { couples?: boolean }) => {
      const cleaned = names.map((n) => n.trim()).filter(Boolean);
      setPlayers(
        cleaned.map((name, i) => ({
          id: uid(),
          name,
          color: PLAYER_COLORS[i % PLAYER_COLORS.length],
          score: 0,
          coupleId: opts?.couples ? Math.floor(i / 2) : undefined,
        }))
      );
    },
    []
  );

  const addScore = useCallback((playerId: string, delta: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, score: p.score + delta } : p))
    );
  }, []);

  const resetScores = useCallback(() => {
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
  }, []);

  const resetAll = useCallback(() => {
    setPlayers([]);
    setScreen({ name: "landing" });
    setGameState(null);
  }, []);

  const recordSession = useCallback(async (gameId: string, mode: Mode, playersCount: number) => {
    if (!user) return;

    const isFirstGame = sessionCount === 0;

    const { error } = await supabase.from('game_sessions').insert({
      user_id: user.id,
      game_id: gameId,
      mode: mode,
      players_count: playersCount,
      completed_at: new Date().toISOString(),
      was_free: isFirstGame
    });

    if (!error) {
      setSessionCount(prev => prev + 1);
    } else {
      console.error("Error recording session:", error);
    }
  }, [user, sessionCount]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    resetAll();
  }, [resetAll]);

  const value = useMemo(
    () => ({ 
      screen, 
      players, 
      user,
      sessionCount,
      hasActivePass,
      passExpiry,
      isLoadingStats,
      showAuth,
      showPaywall,
      tone,
      gameState,
      setShowAuth,
      setShowPaywall,
      setTone,
      setGameState,
      toggleTone,
      go, 
      setPlayersFromNames, 
      addScore, 
      resetScores, 
      resetAll,
      recordSession,
      refreshStats,
      logout
    }),
    [screen, players, user, sessionCount, hasActivePass, passExpiry, isLoadingStats, showAuth, showPaywall, tone, gameState, go, setPlayersFromNames, addScore, resetScores, resetAll, recordSession, refreshStats, toggleTone, logout]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export function useCurrentMode(): Mode | null {
  const { screen } = useGame();
  if ("mode" in screen) return screen.mode;
  return null;
}
