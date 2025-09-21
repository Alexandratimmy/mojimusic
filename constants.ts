import type { Song, Creator, FeaturedItem, RadioStation, User, Notification, UpdatePost } from './types';

export const currentUser: User = {
    id: 'user1',
    name: 'AI Music Generator',
    handle: '@samuelteamey',
    followers: 1024,
    following: 128,
    imageUrl: 'https://picsum.photos/seed/user/50',
    credits: 2480,
    isFollowing: false,
    plan: 'Free',
};

export const whatsNewPosts: UpdatePost[] = [
    {
        id: '2024-07-28',
        version: 'v1.3.0',
        date: 'July 28, 2024',
        title: 'Profile Editing & What\'s New Page',
        description: `We've rolled out some exciting new features to give you more control and keep you in the loop!
*   **Editable Profiles:** You can now edit your profile name directly from your profile page. Your new name will be reflected across all your creations.
*   **What's New Changelog:** This very page! We've added a dedicated space to announce new features, updates, and bug fixes.
*   **Dynamic Update Badge:** The "What's new?" link in the sidebar will now show a badge with a count of unread updates.`
    },
    {
        id: '2024-07-25',
        version: 'v1.2.0',
        date: 'July 25, 2024',
        title: 'Full-Screen Player & Visualizer',
        description: `Immerse yourself in the music with our brand new full-screen player experience.
*   **Audio Visualizer:** A dynamic, circular visualizer that reacts to the music, surrounding the album art.
*   **Synced Lyrics:** For songs with timed lyrics, the words now scroll in sync with the song, karaoke-style!
*   **Improved Layout:** All your player controls are beautifully laid out for an immersive listening session.`
    },
    {
        id: '2024-07-22',
        version: 'v1.1.0',
        date: 'July 22, 2024',
        title: 'Gemini-Powered Lyric Generation',
        description: `Songwriting just got a whole lot easier. We've integrated the Gemini API to help you craft the perfect lyrics.
*   **Generate Lyrics:** Stuck on a verse? Click the "Generate Lyrics" button in the Create view to get AI-powered lyrical suggestions based on your chosen style.
*   **Improved Song Details:** Gemini now helps generate more vivid and detailed descriptions for all your new creations.`
    },
];


export const initialSongs: Song[] = [
    {
        id: '1',
        title: 'I Am the CHANGE that I Desire',
        description: 'A pop-soul song in D major at 105 BPM opens with soft piano and warm string pads for reflective verses...',
        style: 'Pop, Soul',
        duration: 289,
        albumArtUrl: 'https://picsum.photos/seed/change/200',
        version: 'v4.5+',
        audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/I_Am_the_CHANGE_that_I_Desire.mp3',
        artist: 'AI Music Generator',
        plays: '12100',
        likes: '1100',
        comments: '98',
        lyrics: [
            { time: 15, text: '(Verse 1)' },
            { time: 18, text: 'Woke up this morning, feeling the sun on my face' },
            { time: 24, text: 'A new day is dawning, a brand new time and place' },
            { time: 30, text: 'Got this fire inside me, a burning, deep desire' },
            { time: 36, text: 'To be the one I\'m meant to be, and set my soul on fire' },
            { time: 42, text: '' },
            { time: 45, text: '(Chorus)' },
            { time: 48, text: 'I am the change that I desire, I am the author of my fate' },
            { time: 54, text: 'I\'m reaching higher and higher, before it gets too late' },
            { time: 60, text: 'With every step I\'m taking, a new world I create' },
            { time: 66, text: 'I am the change that I desire, yeah, I am great' },
        ],
    },
    {
        id: '2',
        title: 'I Am the AUTHOR of My Life',
        description: 'Relentless, heavy bass powers the intro over bright, explosive synths and rapid-fire drum & bass breaks.',
        style: 'Drum & Bass, Electronic',
        duration: 175,
        albumArtUrl: 'https://picsum.photos/seed/author/200',
        version: 'v4.5+',
        audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/I_Am_the_AUTHOR_of_My_Life.mp3',
        artist: 'AI Music Generator',
        plays: '8700',
        likes: '980',
        comments: '72',
        lyrics: [
            { time: 5, text: '(Intro)' },
            { time: 8, text: 'Bass drops, synths explode' },
            { time: 12, text: 'The city sleeps, but my story\'s told' },
            { time: 16, text: 'In neon lights and code that flows' },
            { time: 20, text: 'This is the life that I have chose' },
            { time: 24, text: '' },
            { time: 26, text: '(Verse 1)' },
            { time: 29, text: 'Fingers on the keys, the world at my command' },
            { time: 33, text: 'Building empires in a digital land' },
            { time: 37, text: 'They see the glory, don\'t understand the fight' },
            { time: 41, text: 'Turning shadows into blinding light' },
            { time: 45, text: '' },
            { time: 48, text: '(Chorus)' },
            { time: 51, text: 'I am the author of my life, every single line I write' },
            { time: 56, text: 'In the chaos and the strife, I am my own guiding light' },
            { time: 61, text: 'No one else can hold the pen, it\'s my story \'til the end' },
            { time: 66, text: 'I am the author of my life, again and again' },
        ],
    },
    {
        id: '3',
        title: 'you will be great',
        description: 'A slow build with spacious synth pads and subtle guitar lines forms the intro, leading into a steady rhythm section.',
        style: 'Ambient, Rock',
        duration: 194,
        albumArtUrl: 'https://picsum.photos/seed/great/200',
        version: 'v4.5+',
        audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/you_will_be_great.mp3',
        artist: 'AI Music Generator',
        plays: '25300',
        likes: '2400',
        comments: '150',
        lyrics: [
            { time: 10, text: '(Instrumental Intro)' },
            { time: 20, text: '' },
            { time: 22, text: '(Verse 1)' },
            { time: 25, text: 'Little star, shining so bright' },
            { time: 30, text: 'Don\'t you ever lose your light' },
            { time: 35, text: 'The world is vast, the road is long' },
            { time: 40, text: 'But in your heart, you are so strong' },
            { time: 45, text: '' },
            { time: 48, text: '(Chorus)' },
            { time: 51, text: 'And you will be great, just you wait and see' },
            { time: 56, text: 'You\'ll move the mountains, you\'ll calm the sea' },
            { time: 61, text: 'Just hold on tight to who you are' },
            { time: 66, text: 'You\'re gonna be a shining star' },
            { time: 71, text: 'You will be great' },
        ],
    },
];

export const suggestedCreators: Creator[] = [
    { id: 'sc1', name: 'fearless lion', handle: '@raretwostep4658', followers: 9, imageUrl: 'https://picsum.photos/seed/lion/50', isFollowing: false },
    { id: 'sc2', name: 'RareFilmScore3053', handle: '@rarefilmscore3053', followers: 7, imageUrl: 'https://picsum.photos/seed/film/50', isFollowing: true },
    { id: 'sc3', name: 'prettypify057', handle: '@prettypify057', followers: 5, imageUrl: 'https://picsum.photos/seed/pretty/50', isFollowing: false },
    { id: 'sc4', name: 'hausa', handle: '@funkv30261', followers: 11, imageUrl: 'https://picsum.photos/seed/hausa/50', isFollowing: false },
    { id: 'sc5', name: 'successfulmogul', handle: '@successfulmogul', followers: 6, imageUrl: 'https://picsum.photos/seed/mogul/50', isFollowing: true },
];

export const mockNotifications: Notification[] = [
    { 
        id: 'n1',
        type: 'new_follower',
        message: 'fearless lion started following you.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
        from: { name: 'fearless lion', imageUrl: 'https://picsum.photos/seed/lion/50' }
    },
    {
        id: 'n2',
        type: 'song_liked',
        message: 'Jaccuse liked your song "The Ink-Dark Feather".',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false,
        from: { name: 'Jaccuse', imageUrl: 'https://picsum.photos/seed/feather/50' }
    },
    {
        id: 'n3',
        type: 'new_release',
        message: 'RareFilmScore3053 released a new album "Cinematic Dreams".',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true,
        from: { name: 'RareFilmScore3053', imageUrl: 'https://picsum.photos/seed/film/50' }
    },
    {
        id: 'n4',
        type: 'new_follower',
        message: 'hausa started following you.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        read: true,
        from: { name: 'hausa', imageUrl: 'https://picsum.photos/seed/hausa/50' }
    }
];

export const trendingSongs: Song[] = [
    { id: 't1', title: 'Afterglow', artist: 'JinSeo', description: 'K-pop, dance-pop, rap, dream pop', style: 'K-pop, Dance', duration: 210, albumArtUrl: 'https://picsum.photos/seed/afterglow/200', version: 'v4.5+', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/I_Am_the_CHANGE_that_I_Desire.mp3', plays: '322', likes: '201', comments: '16' },
    { id: 't2', title: 'The Button-Eyed Serenade', artist: 'NifumeSou...', description: 'glitch opera, industrial, cyberpunk', style: 'Industrial, Cyberpunk', duration: 185, albumArtUrl: 'https://picsum.photos/seed/button/200', version: 'v4.5+', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/I_Am_the_AUTHOR_of_My_Life.mp3', plays: '385', likes: '139', comments: '11' },
    { id: 't3', title: 'You&Me', artist: 'J....e basta', description: 'folk, acoustic, singer-songwriter', style: 'Folk, Acoustic', duration: 150, albumArtUrl: 'https://picsum.photos/seed/youme/200', version: 'v4.5+', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/you_will_be_great.mp3', plays: '199', likes: '138', comments: '7' },
    { id: 't4', title: 'Losing Myself', artist: 'ComaToastedFX', description: 'synth-driven with pulsing basslines', style: 'Synthwave', duration: 240, albumArtUrl: 'https://picsum.photos/seed/losing/200', version: 'v4.5+', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/I_Am_the_CHANGE_that_I_Desire.mp3', plays: '168', likes: '120', comments: '6' },
    { id: 't5', title: 'The Ink-Dark Feather', artist: 'Jaccuse', description: 'Acoustic Folk, Singer-Songwriter', style: 'Acoustic, Folk', duration: 195, albumArtUrl: 'https://picsum.photos/seed/feather/200', version: 'v4.5+', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/I_Am_the_AUTHOR_of_My_Life.mp3', plays: '506', likes: '226', comments: '26' },
];

export const featuredItems: FeaturedItem[] = [
    { id: 'f1', title: 'This is Mona Lisa', subtitle: 'Mona Lisa', imageUrl: 'https://picsum.photos/seed/monalisa/400', songs: 9, gradient: 'from-purple-500 to-pink-500' },
    { id: 'f2', title: 'More From Trending Creators', subtitle: '', imageUrl: 'https://picsum.photos/seed/trendingcreators/400', songs: 15, gradient: 'from-green-400 to-blue-500' },
    { id: 'f3', title: 'v4.5 faves', subtitle: 'the best of v4.5 currently in rotation', imageUrl: 'https://picsum.photos/seed/faves/400', songs: 21, plays: '210K', likes: '103', gradient: 'from-red-500 to-yellow-500' },
];

export const staffPicks: Song[] = [
    { id: 'sp1', title: 'Chocolate Caliente', artist: 'Plahtnaum Records', description: 'Kizomba', style: 'Kizomba', duration: 172, albumArtUrl: 'https://picsum.photos/seed/caliente/200', version: 'v4.5+', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/you_will_be_great.mp3', plays: '5400', likes: '320', comments: '25' },
    { id: 'sp2', title: 'Acknowledgment', artist: 'Will Eason', description: 'hip-hop, synth-driven, atmo...', style: 'Hip-hop', duration: 140, albumArtUrl: 'https://picsum.photos/seed/ack/200', version: 'v4.0', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/I_Am_the_CHANGE_that_I_Desire.mp3', plays: '7800', likes: '550', comments: '40' },
    { id: 'sp3', title: 'Lo-fi Chill Café', artist: 'AREN', description: 'lofi, chillout, downtempo', style: 'Lofi, Chillout', duration: 145, albumArtUrl: 'https://picsum.photos/seed/lofi/200', version: 'v4.5+', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/I_Am_the_AUTHOR_of_My_Life.mp3', plays: '15200', likes: '1200', comments: '88' },
    { id: 'sp4', title: '文字化けしたラブ...', artist: 'imaesan K', description: 'vaporwave, bossa nova, lo-...', style: 'Vaporwave', duration: 219, albumArtUrl: 'https://picsum.photos/seed/vapor/200', version: 'v4.5+', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/you_will_be_great.mp3', plays: '9100', likes: '750', comments: '61' },
    { id: 'sp5', title: 'Abstract', artist: 'BeccasMelodies', description: 'indie, ambient, dream pop', style: 'Indie, Ambient', duration: 358, albumArtUrl: 'https://picsum.photos/seed/abstract/200', version: 'v4.0', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/I_Am_the_CHANGE_that_I_Desire.mp3', plays: '11000', likes: '900', comments: '75' },
    { id: 'sp6', title: 'Addicted to hooks', artist: 'Airin', description: 'Funk, r&b', style: 'Funk, R&B', duration: 197, albumArtUrl: 'https://picsum.photos/seed/hooks/200', version: 'v4.0', audioUrl: 'https://storage.googleapis.com/aidevs/project-canvas/music/I_Am_the_AUTHOR_of_My_Life.mp3', plays: '6500', likes: '480', comments: '32' },
];

export const radioStations: RadioStation[] = [
    {
        id: 'r1',
        name: 'Pop Powerhouse',
        description: 'The biggest pop hits from today and yesterday.',
        imageUrl: 'https://picsum.photos/seed/popradio/300'
    },
    {
        id: 'r2',
        name: 'Indie Chill',
        description: 'Laid-back tracks from the best independent artists.',
        imageUrl: 'https://picsum.photos/seed/indieradio/300'
    },
    {
        id: 'r3',
        name: 'Hip-Hop Heat',
        description: 'From old school classics to the latest bangers.',
        imageUrl: 'https://picsum.photos/seed/hiphopradio/300'
    },
    {
        id: 'r4',
        name: 'Electronic Escape',
        description: 'Ambient, house, and techno to get lost in.',
        imageUrl: 'https://picsum.photos/seed/electronicradio/300'
    },
    {
        id: 'r5',
        name: 'Rock Anthems',
        description: 'All the stadium-sized rock hits you know and love.',
        imageUrl: 'https://picsum.photos/seed/rockradio/300'
    },
    {
        id: 'r6',
        name: 'Global Grooves',
        description: 'Discover incredible music from around the world.',
        imageUrl: 'https://picsum.photos/seed/globalradio/300'
    }
];

export const allSongs: Song[] = [...initialSongs, ...trendingSongs, ...staffPicks];
