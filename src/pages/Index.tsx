import { GameProvider } from "@/state/GameContext";
import ScreenRouter from "@/components/ScreenRouter";

const Index = () => (
  <GameProvider>
    <ScreenRouter />
  </GameProvider>
);

export default Index;
