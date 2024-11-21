import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import { ActorCard } from './components/ActorCard';
import { ScoreBoard } from './components/ScoreBoard';
import { GameTutorial } from './components/GameTutorial';
import { BurgerMenu } from './components/BurgerMenu';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useGame } from './context/GameContext';
import { AlertTriangle, Play } from 'lucide-react';

function Game() {
  const { actors, streak, bestStreak, isRevealed, isLoading, error, handleChoice, selectedActorId, gameOver, handlePlayAgain } = useGame();

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-300 mb-4 text-sm md:text-base">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm md:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || actors.length < 2) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-gray-900/90 backdrop-blur-md z-50 border-b border-white/10">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BurgerMenu />
            <h1 className="text-xl md:text-2xl font-bold">Who's Older?</h1>
          </div>
          <ScoreBoard streak={streak} bestStreak={bestStreak} />
        </div>
      </header>
      
      <div className="h-full flex flex-col justify-center px-4 pt-16 md:pt-20">
        <div className="flex flex-col landscape:flex-row items-center justify-center gap-4 md:gap-8 h-[calc(100%-4rem)] relative">
          <AnimatePresence mode="wait">
            {actors.map((actor) => (
              <ActorCard
                key={actor.id}
                actor={actor}
                onClick={() => handleChoice(actor.id)}
                isRevealed={isRevealed}
                isSelected={selectedActorId === actor.id}
                isCorrect={isRevealed && actor.age > (actor.id === actors[0].id ? actors[1].age : actors[0].age)}
              />
            ))}
          </AnimatePresence>

          {gameOver && !isRevealed && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition-colors z-10"
              onClick={handlePlayAgain}
            >
              <Play className="w-12 h-12" />
            </motion.button>
          )}
        </div>
      </div>

      <GameTutorial />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <Game />
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;