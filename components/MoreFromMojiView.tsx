import React from 'react';
import { DiscordIcon, XIcon, TikTokIcon, ArrowUpRightIcon, BookOpenIcon, ShoppingBagIcon } from './icons';

const InfoCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    linkText: string;
    href: string;
    gradient: string;
}> = ({ icon, title, description, linkText, href, gradient }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`relative block p-6 rounded-xl overflow-hidden group transition-transform hover:scale-[1.02] ${gradient}`}
    >
        <div className="relative z-10">
            <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-zinc-200 mt-2 text-sm">{description}</p>
            <div className="flex items-center gap-2 mt-6 font-semibold text-white group-hover:underline">
                <span>{linkText}</span>
                <ArrowUpRightIcon />
            </div>
        </div>
    </a>
);

const MoreFromMojiView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-zinc-900 overflow-hidden">
        <div className="p-4 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 shrink-0">
            <h1 className="text-lg font-semibold text-center">More from Moji</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-white">Join the Moji Universe</h2>
                    <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
                        Connect with fellow creators, get the latest news, and explore everything Moji has to offer.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Community */}
                    <InfoCard 
                        icon={<DiscordIcon className="w-6 h-6 text-white" />}
                        title="Join our Discord"
                        description="Chat with the community, share your work, and get support from the Moji team."
                        linkText="Join Server"
                        href="#"
                        gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                    />
                     <InfoCard 
                        icon={<XIcon className="w-6 h-6 text-white" />}
                        title="Follow on X"
                        description="Get real-time updates, feature announcements, and see community highlights."
                        linkText="Follow @MojiAI"
                        href="#"
                        gradient="bg-gradient-to-br from-zinc-700 to-zinc-800"
                    />
                     <InfoCard 
                        icon={<TikTokIcon className="w-6 h-6 text-white" />}
                        title="Watch on TikTok"
                        description="Discover viral trends, tutorials, and creative uses of Moji from our community."
                        linkText="Check out our TikTok"
                        href="#"
                        gradient="bg-gradient-to-br from-pink-500 to-rose-500"
                    />
                    
                    {/* Resources */}
                     <InfoCard 
                        icon={<BookOpenIcon className="w-6 h-6 text-white" />}
                        title="Official Blog"
                        description="In-depth articles, artist spotlights, and tips to get the most out of Moji."
                        linkText="Read the blog"
                        href="#"
                        gradient="bg-gradient-to-br from-green-500 to-teal-600"
                    />
                     <InfoCard 
                        icon={<ShoppingBagIcon className="w-6 h-6 text-white" />}
                        title="Moji Merch Store"
                        description="Rep your favorite AI music tool with our exclusive collection of apparel and gear."
                        linkText="Shop now"
                        href="#"
                        gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                    />

                    {/* About */}
                     <div className="md:col-span-2 lg:col-span-1 p-6 rounded-xl bg-zinc-800 border border-zinc-700 flex flex-col">
                        <h3 className="text-xl font-bold text-white">Our Mission</h3>
                        <p className="text-zinc-300 mt-2 text-sm flex-1">
                            To empower human creativity by building intuitive, powerful, and accessible tools that push the boundaries of artistic expression.
                        </p>
                        <a href="#" className="flex items-center gap-2 mt-6 font-semibold text-purple-400 hover:underline text-sm">
                            <span>Learn more about us</span>
                            <ArrowUpRightIcon />
                        </a>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default MoreFromMojiView;
