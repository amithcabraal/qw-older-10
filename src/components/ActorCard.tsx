import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Info, Check, X } from 'lucide-react';
import { Actor } from '../types/actor';

interface ActorCardProps {
  actor: Actor;
  onClick: () => void;
  isRevealed: boolean;
  isCorrect?: boolean;
  isSelected?: boolean;
}

export const ActorCard: React.FC<ActorCardProps> = ({ 
  actor, 
  onClick, 
  isRevealed, 
  isCorrect,
  isSelected = false 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const borderColor = isRevealed && isSelected
    ? isCorrect
      ? 'border-green-500'
      : 'border-red-500'
    : 'border-transparent';

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      className={`relative w-full h-[40vh] landscape:h-[70vh] landscape:w-[40vw] max-w-[400px] max-h-[600px] rounded-xl overflow-hidden cursor-pointer border-4 ${borderColor} transition-colors`}
      whileHover={{ scale: isRevealed ? 1 : 1.02 }}
      onClick={() => !isRevealed && !isFlipped && onClick()}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
            alt={actor.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {isRevealed && isSelected && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {isCorrect ? (
                <div className="rounded-full bg-green-500/90 p-6">
                  <Check className="w-20 h-20 text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="rounded-full bg-red-500/90 p-6">
                  <X className="w-20 h-20 text-white" strokeWidth={3} />
                </div>
              )}
            </motion.div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-2">{actor.name}</h2>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1 md:space-y-2"
              >
                <p className="text-6xl md:text-8xl font-bold">{actor.age}</p>
                <p className="text-sm md:text-lg opacity-80">
                  Born: {format(new Date(actor.birthday), 'MMMM d, yyyy')}
                </p>
                {actor.deathday && (
                  <p className="text-sm md:text-lg opacity-80">
                    Died: {format(new Date(actor.deathday), 'MMMM d, yyyy')}
                  </p>
                )}
              </motion.div>
            )}
          </div>

          <button
            onClick={handleFlip}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        <div
          className="absolute inset-0 bg-gray-900 p-4 md:p-6 backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl md:text-2xl font-bold pr-12">{actor.name}'s Recent Movies</h2>
            <button
              onClick={handleFlip}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 overflow-auto max-h-[calc(100%-4rem)]">
            {actor.movies?.map((movie) => (
              <div key={movie.id} className="bg-white/5 rounded-lg p-3">
                <h3 className="font-semibold text-base md:text-lg">{movie.title}</h3>
                <p className="text-sm text-gray-300">as {movie.character}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(movie.release_date), 'yyyy')}
                </p>
              </div>
            ))}
            {(!actor.movies || actor.movies.length === 0) && (
              <p className="text-gray-400 text-center">No movie information available</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};