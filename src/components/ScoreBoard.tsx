import React from 'react';
import { Trophy, Flame } from 'lucide-react';

interface ScoreBoardProps {
  streak: number;
  bestStreak: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ streak, bestStreak }) => {
  return (
    <div className="flex items-center gap-4 md:gap-6">
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
        <span className="text-lg md:text-xl font-bold">{streak}</span>
      </div>
      <div className="w-px h-6 md:h-8 bg-gray-300/20" />
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
        <span className="text-lg md:text-xl font-bold">{bestStreak}</span>
      </div>
    </div>
  );
};