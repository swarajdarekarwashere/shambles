import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/state/GameContext";
import Landing from "@/components/Landing";
import PlayerSetup from "@/components/PlayerSetup";
import GameDiscovery from "@/components/GameDiscovery";
import DrunkInLove from "@/components/games/DrunkInLove";
import SpicyStarters from "@/components/games/SpicyStarters";
import ComingSoon from "@/components/games/ComingSoon";
import SpinTheWheel from "@/components/games/SpinTheWheel";
import ScratchCards from "@/components/games/ScratchCards";
import ShotsAndLadders from "@/components/games/ShotsAndLadders";
import IntimacyCards from "@/components/games/IntimacyCards";
import WinnerScreen from "@/components/WinnerScreen";
import Scoreboard from "@/components/Scoreboard";

const variants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
};

export default function ScreenRouter() {
  const { 
    screen, 
    go, 
    user, 
    sessionCount, 
    hasActivePass, 
    recordSession, 
    players,
    setShowAuth,
    setShowPaywall 
  } = useGame();

  const handlePickGame = (gameId: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (screen.name === "discovery") {
      if (sessionCount === 0 || hasActivePass) {
        go({ name: "game", mode: screen.mode, gameId });
      } else {
        setShowPaywall(true);
      }
    }
  };

  const handleGameFinish = async () => {
    if (screen.name !== "game") return;
    
    const gameId = screen.gameId;
    const mode = screen.mode;
    const playersCount = players.length;

    // Record the session
    const isFirstGame = sessionCount === 0;
    await recordSession(gameId, mode, playersCount);

    // Go to winner screen
    go({ name: "winner", mode });

    // If it was the first free game and no pass, show paywall immediately
    if (isFirstGame && !hasActivePass) {
      setShowPaywall(true);
    }
  };

  const renderScreen = () => {
    switch (screen.name) {
      case "landing":
        return (
          <Landing
            onPickMode={(mode) => go({ name: "setup", mode })}
          />
        );
      case "setup":
        return (
          <PlayerSetup
            mode={screen.mode}
            onBack={() => go({ name: "landing" })}
            onContinue={() => go({ name: "discovery", mode: screen.mode })}
          />
        );
      case "discovery":
        return (
          <GameDiscovery
            mode={screen.mode}
            onBack={() => go({ name: "landing" })}
            onPickGame={handlePickGame}
          />
        );
      case "game": {
        const onExit = () => go({ name: "discovery", mode: screen.mode });
        const onFinish = handleGameFinish;
        if (screen.gameId === "drunk-in-love")
          return <DrunkInLove mode={screen.mode} onExit={onExit} onFinish={onFinish} />;
        if (screen.gameId === "spicy-starters")
          return <SpicyStarters onExit={onExit} onFinish={onFinish} />;
        if (screen.gameId === "wheel")
          return <SpinTheWheel onExit={onExit} onFinish={onFinish} />;
        if (screen.gameId === "scratch")
          return <ScratchCards onExit={onExit} onFinish={onFinish} />;
        if (screen.gameId === "dice")
          return <ShotsAndLadders onExit={onExit} onFinish={onFinish} />;
        if (screen.gameId === "intimacy")
          return <IntimacyCards onExit={onExit} onFinish={onFinish} />;
        return <ComingSoon gameId={screen.gameId} onExit={onExit} />;
      }
      case "winner":
        return (
          <WinnerScreen
            mode={screen.mode}
            onPlayAgain={() => {
              if (hasActivePass) {
                go({ name: "discovery", mode: screen.mode });
              } else {
                setShowPaywall(true);
              }
            }}
            onSwitchMode={() => go({ name: "landing" })}
          />
        );
    }
  };

  const showHud =
    screen.name === "game" || screen.name === "discovery";

  const isDiscovery = screen.name === "discovery";
  // Stable key for transition
  const transitionKey = screen.name === 'game' ? `game-${(screen as any).gameId}` : screen.name;

  return (
    <main className="relative w-full">
      {isDiscovery ? (
        <div key="discovery-screen" className="w-full">
          {renderScreen()}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={transitionKey}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-dvh w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      )}
      {showHud && <Scoreboard />}
    </main>
  );
}