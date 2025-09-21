import React, { useEffect } from 'react';
import { CloseIcon, SparklesIcon } from './icons';

interface BuyCreditsModalProps {
  onClose: () => void;
  onPurchase: (amount: number) => void;
}

const creditPacks = [
    { amount: 500, price: 5, popular: false },
    { amount: 1200, price: 10, popular: true },
    { amount: 3000, price: 20, popular: false },
];

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ onClose, onPurchase }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-lg border border-zinc-700 transform transition-all flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <SparklesIcon className="text-purple-400" />
                    Buy More Credits
                </h2>
                <button onClick={onClose} className="text-zinc-400 hover:text-white">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
                <p className="text-center text-zinc-400 mb-6 text-sm">Select a credit pack to add to your account. This is a placeholder for a real payment flow.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {creditPacks.map(pack => (
                        <div key={pack.amount} className={`p-4 rounded-lg border-2 ${pack.popular ? 'border-purple-500' : 'border-zinc-700'} bg-zinc-800/50 flex flex-col items-center text-center relative`}>
                           {pack.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>}
                            <p className="text-2xl font-bold text-white">{pack.amount.toLocaleString()}</p>
                            <p className="text-sm text-zinc-300 mb-4">Credits</p>
                            <button 
                                onClick={() => onPurchase(pack.amount)}
                                className="w-full mt-auto py-2 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors text-sm"
                            >
                                Buy for ${pack.price}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
    );
};

export default BuyCreditsModal;
