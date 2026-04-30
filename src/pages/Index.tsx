import { GameProvider, useGame } from "@/state/GameContext";
import ScreenRouter from "@/components/ScreenRouter";
import AuthModal from "@/components/AuthModal";
import PaywallModal from "@/components/PaywallModal";

const AppContent = () => {
  const { showAuth, setShowAuth, showPaywall, user } = useGame();
  
  return (
    <>
      <ScreenRouter />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      {user && <PaywallModal isOpen={showPaywall} userId={user.id} />}
    </>
  );
};

const Index = () => (
  <GameProvider>
    <AppContent />
  </GameProvider>
);

export default Index;
