import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const GameTutorial: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (hasSeenTutorial) {
      setIsVisible(false);
    }

    const timer = setTimeout(() => {
      handleDismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            onClick={handleDismiss}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[90] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.4 }}
              className="w-[min(90vw,420px)] bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Close tutorial"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold mb-4">How to Play</h3>
              <p className="text-gray-300">
                Choose which actor you think is older! Build your streak by making correct guesses.
                The longer your streak, the higher your score. Can you beat your best streak?
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};