import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, X, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  streak: number;
  isNewHighScore: boolean;
  bestStreak: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  onPlayAgain,
  streak,
  isNewHighScore,
  bestStreak,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = isNewHighScore
      ? `🎉 New High Score! I just got ${streak} correct in a row on QuizWordz Older!\nCan you beat my score?`
      : `🎮 I got ${streak} correct in a row on QuizWordz Older!\nCan you beat my score of ${bestStreak}?`;
    const url = window.location.href;
    const shareData = {
      title: 'QuizWordz Older',
      text,
      url,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handlePlayAgain = () => {
    onPlayAgain();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.4 }}
              className="w-[min(90vw,420px)] bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                {isNewHighScore ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      🎉 New High Score! 🎉
                    </h2>
                    <p className="text-2xl mb-8">You got {streak} correct in a row!</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-2xl font-bold mb-2">Game Over</h2>
                    <p className="text-xl mb-8">You got {streak} correct in a row!</p>
                  </motion.div>
                )}

                <div className="flex flex-col gap-4">
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={handleShare}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        <span className="font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        {navigator.share ? <Share2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                        <span className="font-medium">
                          {navigator.share ? 'Share Score' : 'Copy Score'}
                        </span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={handlePlayAgain}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    <span className="font-medium">Play Again</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};