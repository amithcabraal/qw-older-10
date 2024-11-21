import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Share2, Copy, Check } from 'lucide-react';

interface MenuItem {
  label: string;
  content: React.ReactNode;
}

const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = "🎮 Check out QuizWordz Older - Can you guess which actor is older?";
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

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Copied!
        </>
      ) : (
        <>
          {navigator.share ? <Share2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
          {navigator.share ? 'Share Game' : 'Copy Link'}
        </>
      )}
    </button>
  );
};

const menuItems: MenuItem[] = [
  {
    label: "How to Play",
    content: (
      <div className="space-y-4">
        <p>Choose which actor you think is older! Build your streak by making correct guesses.</p>
        <p>Click the flip icon to see the actor's recent movies.</p>
        <p>The longer your streak, the higher your score. Can you beat your best streak?</p>
      </div>
    )
  },
  {
    label: "Share",
    content: (
      <div className="space-y-4">
        <p>Share QuizWordz Older with your friends!</p>
        <ShareButton />
      </div>
    )
  },
  {
    label: "Privacy",
    content: (
      <div className="space-y-4">
        <p>We don't collect any personal information. Your high score is stored locally on your device.</p>
        <p>This game uses The Movie Database (TMDB) API to fetch actor information.</p>
      </div>
    )
  },
  {
    label: "Contact",
    content: (
      <div className="space-y-4">
        <p>Have feedback or found a bug? Contact us at:</p>
        <a href="mailto:contact@quizwordz.com" className="text-blue-400 hover:text-blue-300">
          contact@quizwordz.com
        </a>
      </div>
    )
  },
  {
    label: "Credits",
    content: (
      <div className="space-y-4">
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        <a 
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src="https://www.themoviedb.org/assets/2/v4/logo/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
            alt="TMDB Logo"
            className="h-6"
          />
        </a>
      </div>
    )
  }
];

export const BurgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute left-0 top-0 h-full w-full max-w-sm bg-gray-900 shadow-xl z-[201]"
            >
              <div className="p-4 bg-gray-900">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="mt-8">
                  {selectedItem ? (
                    <div>
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="mb-4 text-sm text-gray-400 hover:text-white"
                      >
                        ← Back
                      </button>
                      <h2 className="text-xl font-bold mb-4">{selectedItem.label}</h2>
                      {selectedItem.content}
                    </div>
                  ) : (
                    <nav className="space-y-2">
                      {menuItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => setSelectedItem(item)}
                          className="block w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};