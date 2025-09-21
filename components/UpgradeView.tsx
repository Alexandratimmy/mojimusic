import React from 'react';
import type { User } from '../types';
import { CheckIcon } from './icons';

interface UpgradeViewProps {
  user: User;
  onUpgrade: (plan: 'Pro' | 'Premium', credits: number) => void;
  onOpenBuyCreditsModal: () => void;
}

const planFeatures = [
    'Access to latest and most advanced model',
    'Commercial use rights for songs made while subscribed',
    'Add new vocals or instrumentals to songs',
    'Early access to new features',
    'Ability to purchase add-on credits',
    'Priority queue, up to 10 songs at once',
];

const plans = {
    free: {
        name: 'Free',
        price: 0,
        credits: '50 credits (up to 10 songs), one-time',
        features: [
            'Basic model access',
            'Non-commercial use',
            'Standard queue',
        ]
    },
    pro: {
        name: 'Pro',
        price: 10,
        credits: '3000 credits (up to 500 songs), refreshes monthly',
        creditsAmount: 3000,
        features: planFeatures,
    },
    premium: {
        name: 'Premium',
        price: 30,
        credits: '6000 credits (up to 1000 songs), refreshes monthly',
        creditsAmount: 6000,
        features: planFeatures,
    }
}

const UpgradeView: React.FC<UpgradeViewProps> = ({ user, onUpgrade, onOpenBuyCreditsModal }) => {
  return (
    <div className="flex-1 flex flex-col bg-zinc-900 overflow-hidden">
      <div className="p-4 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 shrink-0">
        <h1 className="text-lg font-semibold text-center">Upgrade Plan</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-zinc-400 mb-8 flex items-center justify-center gap-4">
            <span>Your current credits: <span className="text-white font-bold">{user.credits.toLocaleString()}</span></span>
            <button onClick={onOpenBuyCreditsModal} className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-purple-700 transition-colors">
              Buy Credits
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className={`p-6 rounded-xl border-2 ${user.plan === 'Free' ? 'border-purple-500' : 'border-zinc-700'} bg-zinc-800/50`}>
              <h2 className="text-2xl font-bold text-white">{plans.free.name}</h2>
              <p className="text-zinc-400 mt-2">Free Forever</p>
              <p className="text-4xl font-extrabold my-6">$0</p>
              <button
                disabled={user.plan === 'Free'}
                className="w-full py-2 rounded-full font-semibold bg-zinc-700 text-zinc-400 cursor-default"
              >
                Current Plan
              </button>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 mt-0.5 text-purple-400 shrink-0" />
                  <span>{plans.free.credits}</span>
                </li>
                {plans.free.features.map(feature => (
                     <li key={feature} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 mt-0.5 text-purple-400 shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
             <div className={`p-6 rounded-xl border-2 ${user.plan === 'Pro' ? 'border-purple-500' : 'border-zinc-700'} bg-zinc-800/50 relative`}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                <h2 className="text-2xl font-bold text-white">{plans.pro.name}</h2>
                <p className="text-zinc-400 mt-2">For creators and enthusiasts</p>
                <p className="text-4xl font-extrabold my-6">${plans.pro.price}<span className="text-base font-normal text-zinc-400">/mo</span></p>
                <button
                    onClick={() => onUpgrade('Pro', plans.pro.creditsAmount)}
                    disabled={user.plan === 'Pro'}
                    className="w-full py-2 rounded-full font-semibold bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-default transition-colors"
                >
                    {user.plan === 'Pro' ? 'Current Plan' : 'Subscribe'}
                </button>
                 <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 mt-0.5 text-purple-400 shrink-0" />
                        <span><strong>{plans.pro.credits}</strong></span>
                    </li>
                    {plans.pro.features.map(feature => (
                        <li key={feature} className="flex items-start gap-3">
                            <CheckIcon className="w-5 h-5 mt-0.5 text-purple-400 shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Premium Plan */}
            <div className={`p-6 rounded-xl border-2 ${user.plan === 'Premium' ? 'border-purple-500' : 'border-zinc-700'} bg-zinc-800/50`}>
              <h2 className="text-2xl font-bold text-white">{plans.premium.name}</h2>
              <p className="text-zinc-400 mt-2">For power users and pros</p>
              <p className="text-4xl font-extrabold my-6">${plans.premium.price}<span className="text-base font-normal text-zinc-400">/mo</span></p>
              <button
                onClick={() => onUpgrade('Premium', plans.premium.creditsAmount)}
                disabled={user.plan === 'Premium'}
                className="w-full py-2 rounded-full font-semibold bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-default transition-colors"
              >
                 {user.plan === 'Premium' ? 'Current Plan' : 'Subscribe'}
              </button>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 mt-0.5 text-purple-400 shrink-0" />
                    <span><strong>{plans.premium.credits}</strong></span>
                </li>
                {plans.premium.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 mt-0.5 text-purple-400 shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeView;
