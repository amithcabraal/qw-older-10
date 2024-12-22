import React, { createContext, useContext, useState, useEffect } from 'react';
import { parse, compareAsc, differenceInYears } from 'date-fns';
import { Actor } from '../types/actor';
import { fetchActorPool, fetchActorDetails } from '../services/tmdb';
import { GameOverModal } from '../components/GameOverModal';

interface GameContextType {
  actors: Actor[];
  streak: number;
  bestStreak: number;
  isRevealed: boolean;
  isLoading: boolean;
  error: Error | null;
  selectedActorId: number | null;
  handleChoice: (actorId: number) => void;
  handlePlayAgain: () => void;
  gameOver: boolean;
  loadNewRound: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const ACTOR_POOL_SIZE = 100;
const PAGES_TO_FETCH = 10;
const MIN_VALID_ACTORS = 10;
const MAX_AGE_GAP = 12;
const REVEAL_DURATION = 2000;
const GAME_OVER_DELAY = 1500;

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [actorPool, setActorPool] = useState<Actor[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [usedActorIds, setUsedActorIds] = useState<Set<number>>(new Set());
  const [showGameOver, setShowGameOver] = useState(false);
  const [lastStreak, setLastStreak] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [selectedActorId, setSelectedActorId] = useState<number | null>(null);
  const [canAdvance, setCanAdvance] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [currentActorIds, setCurrentActorIds] = useState<Set<number>>(new Set());

  const getRandomActors = (count: number, pool: Actor[]): Actor[] => {
    const availableActors = pool.filter(actor => 
      !usedActorIds.has(actor.id) && !currentActorIds.has(actor.id)
    );

    if (availableActors.length < count) {
      setUsedActorIds(new Set());
      setCurrentActorIds(new Set());
      return getRandomActors(count, pool);
    }

    const selectedActors: Actor[] = [];
    const tempPool = [...availableActors];

    while (selectedActors.length < count && tempPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * tempPool.length);
      const [actor] = tempPool.splice(randomIndex, 1);
      
      if (selectedActors.length === 0) {
        selectedActors.push(actor);
      } else {
        const ageDiff = Math.abs(actor.age - selectedActors[0].age);
        if (ageDiff > MAX_AGE_GAP) {
          continue;
        }
        selectedActors.push(actor);
      }
    }

    return selectedActors.length === count ? selectedActors : getRandomActors(count, pool);
  };

  const loadNewRound = async () => {
    if (!canAdvance) return;
    
    try {
      const newActors = getRandomActors(2, actorPool);
      if (Math.random() > 0.5) {
        newActors.reverse();
      }

      setActors(newActors);
      setSelectedActorId(null);
      setCurrentActorIds(new Set(newActors.map(actor => actor.id)));
      newActors.forEach(actor => {
        setUsedActorIds(prev => new Set(prev).add(actor.id));
      });
    } catch (err) {
      setError(new Error('Failed to load new round. Please try again.'));
    }
  };

  const initializeActorPool = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const popularActors = await fetchActorPool(PAGES_TO_FETCH);
      const validActorsPromises = popularActors
        .filter(actor => !usedActorIds.has(actor.id))
        .slice(0, ACTOR_POOL_SIZE)
        .map(actor => fetchActorDetails(actor.id));

      const actorDetails = await Promise.all(validActorsPromises);
      const validActors = actorDetails.filter((actor): actor is Actor => actor !== null);

      if (validActors.length < MIN_VALID_ACTORS) {
        throw new Error('Not enough valid actors found. Please try again.');
      }

      setActorPool(validActors);
      
      const initialActors = getRandomActors(2, validActors);
      setActors(initialActors);
      setCurrentActorIds(new Set(initialActors.map(actor => actor.id)));
      initialActors.forEach(actor => {
        setUsedActorIds(prev => new Set(prev).add(actor.id));
      });
      
      setIsLoading(false);
    } catch (err) {
      setError(new Error('Failed to initialize actor pool. Please try again.'));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeActorPool();
  }, []);

  useEffect(() => {
    const savedBestStreak = localStorage.getItem('bestStreak');
    if (savedBestStreak) {
      setBestStreak(parseInt(savedBestStreak));
    }
  }, []);

  const handlePlayAgain = () => {
    setShowGameOver(false);
    setGameOver(false);
    setCanAdvance(true);
    setIsRevealed(false);
    setSelectedActorId(null);
    setStreak(0);
    setLastStreak(0);
    setIsNewHighScore(false);
    
    const newActors = getRandomActors(2, actorPool);
    setActors(newActors);
    setCurrentActorIds(new Set(newActors.map(actor => actor.id)));
  };

  const handleChoice = (actorId: number) => {
    setSelectedActorId(actorId);
    setIsRevealed(true);

    const actor1Date = parse(actors[0].birthday, 'yyyy-MM-dd', new Date());
    const actor2Date = parse(actors[1].birthday, 'yyyy-MM-dd', new Date());

    const actor1Age = actors[0].deathday 
      ? differenceInYears(parse(actors[0].deathday, 'yyyy-MM-dd', new Date()), actor1Date)
      : actors[0].age;
    const actor2Age = actors[1].deathday 
      ? differenceInYears(parse(actors[1].deathday, 'yyyy-MM-dd', new Date()), actor2Date)
      : actors[1].age;
    
    const dateComparison = compareAsc(actor1Date, actor2Date);
    
    const isCorrect = dateComparison === 0 || 
      (actor1Age > actor2Age ? actorId === actors[0].id : actorId === actors[1].id);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        localStorage.setItem('bestStreak', newStreak.toString());
        setIsNewHighScore(true);
      }
      
      setTimeout(() => {
        setIsRevealed(false);
        loadNewRound();
      }, REVEAL_DURATION);
    } else {
      setLastStreak(streak);
      setStreak(0);
      setCanAdvance(false);
      setGameOver(true);
      
      setTimeout(() => {
        setShowGameOver(true);
      }, GAME_OVER_DELAY);
    }
  };

  const handleModalClose = () => {
    setShowGameOver(false);
    setIsNewHighScore(false);
    setCanAdvance(true);
    setIsRevealed(false);
    loadNewRound();
  };

  return (
    <GameContext.Provider value={{
      actors,
      streak,
      bestStreak,
      isRevealed,
      isLoading,
      error,
      selectedActorId,
      handleChoice,
      handlePlayAgain,
      gameOver,
      loadNewRound,
    }}>
      {children}
      <GameOverModal
        isOpen={showGameOver}
        onClose={handleModalClose}
        onPlayAgain={handlePlayAgain}
        streak={lastStreak}
        isNewHighScore={isNewHighScore}
        bestStreak={bestStreak}
      />
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
