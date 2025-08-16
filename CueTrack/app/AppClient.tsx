"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Trophy, MapPin, Search, ChevronLeft, PlusCircle, Users, Shuffle, ListChecks, UserSearch, Target, PlayCircle, StopCircle, Edit, CheckCircle, UserPlus, X, Shield } from 'lucide-react';
import { IUser, IFrame, IVenue } from '@/lib/types'; // Import types from our central file

// --- Main Client Component ---
export default function AppClient({ initialData }: { initialData: any }) {
  // State is initialized with data passed from the server
  const [page, setPage] = useState('dashboard');
  const [frames, setFrames] = useState<IFrame[]>(initialData.frames);
  const [friends, setFriends] = useState<IUser[]>(initialData.friends);
  const [allUsers, setAllUsers] = useState<IUser[]>(initialData.allUsers);
  const [venues, setVenues] = useState<IVenue[]>(initialData.venues);
  const [leaderboard, setLeaderboard] = useState<IUser[]>(initialData.leaderboard);
  const [selectedFrame, setSelectedFrame] = useState<IFrame | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(initialData.currentUser);

  const navigateTo = (pageName: string, data: IFrame | null = null) => {
    if (pageName === 'frameInProgress' && data) {
      setSelectedFrame(data);
    }
    setPage(pageName);
  };
  
  const createNewFrame = async (frameFormData: { location: string; tag: string; players: { clerkId: string, name: string, score: number }[] }) => {
    if (!currentUser) return;
    const newFramePayload = { ...frameFormData, creatorId: currentUser.clerkId };
    const response = await fetch('/api/frames', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newFramePayload) });
    if (response.ok) {
        const createdFrame = await response.json();
        setFrames(prev => [createdFrame, ...prev]);
        navigateTo('frameInProgress', createdFrame);
    } else {
        console.error("Failed to create frame");
    }
  };

  const updateFrame = async (updates: Partial<Omit<IFrame, '_id'>>) => {
    if (!selectedFrame) return;
    const response = await fetch(`/api/frames`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ frameId: selectedFrame._id, updates }) });
    if (response.ok) {
        const updatedFrame = await response.json();
        setFrames(prev => prev.map(f => f._id === updatedFrame._id ? updatedFrame : f));
        setSelectedFrame(updatedFrame);
    } else {
        console.error("Failed to update frame");
    }
  };

  const addFriend = async (newFriend: IUser) => {
    if (!currentUser || friends.some(f => f.clerkId === newFriend.clerkId)) return;
    const response = await fetch('/api/friends', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ friendId: newFriend.clerkId }) });
    if (response.ok) {
        setFriends(prev => [...prev, newFriend]);
    } else {
        console.error("Failed to add friend");
    }
  };
  
  const renderPage = () => {
    if (!currentUser) {
        return (
            <div className="text-center py-20 text-yellow-400">
                <p>Finalizing account setup...</p>
                <p className="text-sm text-gray-500 mt-2">This should only take a moment. Please refresh if this persists.</p>
            </div>
        );
    }

    switch (page) {
      case 'dashboard': return <Dashboard navigateTo={navigateTo} frames={frames} currentUser={currentUser} />;
      case 'frameInProgress': return <FrameInProgress frame={selectedFrame} navigateTo={navigateTo} onUpdateFrame={updateFrame} currentUser={currentUser} />;
      case 'createFrame': return <CreateFrame navigateTo={navigateTo} onCreateFrame={createNewFrame} friends={friends} currentUser={currentUser} />;
      case 'findFriends': return <FindFriends navigateTo={navigateTo} allUsers={allUsers} friends={friends} onAddFriend={addFriend} currentUser={currentUser} />;
      case 'leaderboards': return <Leaderboards navigateTo={navigateTo} leaderboardUsers={leaderboard} />;
      case 'venueFinder': return <VenueFinder navigateTo={navigateTo} venues={venues} />;
      // --- THIS LINE IS NOW CORRECTED ---
      case 'profile': return <Profile navigateTo={navigateTo} userFrames={frames} currentUser={currentUser} />;
      default: return <Dashboard navigateTo={navigateTo} frames={frames} currentUser={currentUser} />;
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-4 pb-24">
      {renderPage()}
      <BottomNav currentPage={page} navigateTo={navigateTo} />
    </div>
  );
}

// --- ALL YOUR ORIGINAL UI COMPONENTS ARE BELOW ---

const Card = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={`bg-gray-800 rounded-xl shadow-lg p-4 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }: { children: React.ReactNode; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; variant?: 'primary' | 'secondary' | 'danger' | 'outline'; className?: string; disabled?: boolean; type?: 'button' | 'submit' | 'reset' }) => {
  const baseClasses = 'w-full text-center py-3 px-4 rounded-lg font-semibold transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = { primary: 'bg-emerald-500 hover:bg-emerald-600 text-white', secondary: 'bg-gray-700 hover:bg-gray-600 text-white', danger: 'bg-red-500 hover:bg-red-600 text-white', outline: 'bg-transparent border-2 border-gray-600 hover:bg-gray-700 text-gray-300' };
  return <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} disabled={disabled}>{children}</button>;
};

const PageHeader = ({ title, onBack, children }: { title: string; onBack?: () => void; children?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-6"><div className="flex items-center">{onBack && (<button onClick={onBack} className="p-2 mr-2 rounded-full bg-gray-800 hover:bg-gray-700"><ChevronLeft size={20} /></button>)}<h1 className="text-2xl md:text-3xl font-bold text-white truncate">{title}</h1></div><div>{children}</div></div>
);

const BottomNav = ({ currentPage, navigateTo }: { currentPage: string; navigateTo: (page: string) => void }) => {
  const navItems = [{ name: 'Dashboard', icon: <Trophy size={24} />, page: 'dashboard' }, { name: 'Leaderboards', icon: <Users size={24} />, page: 'leaderboards' }, { name: 'New Frame', icon: <PlusCircle size={32} className="text-emerald-400" />, page: 'createFrame', isCentral: true }, { name: 'Venues', icon: <MapPin size={24} />, page: 'venueFinder' }, { name: 'Profile', icon: <User size={24} />, page: 'profile' }];
  return (<nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg max-w-lg mx-auto"><div className="flex justify-around items-center h-16">{navItems.map(item => (<button key={item.page} onClick={() => navigateTo(item.page)} className={`flex flex-col items-center justify-center text-xs font-medium transition-colors w-1/5 ${currentPage === item.page ? 'text-emerald-400' : 'text-gray-400 hover:text-white'} ${item.isCentral ? '-mt-6' : ''}`}><div className={item.isCentral ? 'bg-gray-800 p-2 rounded-full' : ''}>{item.icon}</div>{!item.isCentral && <span className="mt-1">{item.name}</span>}</button>))}</div></nav>);
};

function Dashboard({ navigateTo, frames, currentUser }: { navigateTo: (page: string, data?: IFrame) => void; frames: IFrame[]; currentUser: IUser }) {
    return (<div><PageHeader title="Dashboard"><Button onClick={() => navigateTo('findFriends')} variant="secondary" className="w-auto px-3 py-2 text-sm flex items-center"><UserSearch size={16} className="mr-2" /> Find Friends</Button></PageHeader><p className="text-gray-400 mb-6 -mt-4">All frames you have participated in.</p>{frames.length > 0 ? (<div className="grid grid-cols-2 gap-4">{frames.map(frame => (<FrameCard key={frame._id} frame={frame} onClick={() => navigateTo('frameInProgress', frame)} currentUser={currentUser} />))}</div>) : (<Card className="text-center py-12"><p className="text-gray-400">You haven't played any frames yet.</p><Button onClick={() => navigateTo('createFrame')} className="mt-4 w-auto mx-auto px-6">Create Your First Frame</Button></Card>)}</div>);
}

const FrameCard = ({ frame, onClick, currentUser }: { frame: IFrame; onClick: () => void; currentUser: IUser }) => {
    const isWinner = frame.winnerId === currentUser.clerkId;
    const statusColors = { live: 'bg-blue-500/20 text-blue-400', pending: 'bg-yellow-500/20 text-yellow-400', completed: isWinner ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400' };
    const statusText = { live: 'LIVE', pending: 'PENDING', completed: isWinner ? 'WIN' : 'LOSS' };
    return (<Card onClick={onClick} className="cursor-pointer hover:bg-gray-700 transition-colors flex flex-col justify-between aspect-square"><div><div className="flex justify-between items-start"><h3 className="font-bold text-lg text-white pr-2 break-words">{frame.tag}</h3><div className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[frame.status]} whitespace-nowrap`}>{statusText[frame.status]}</div></div></div><div className="text-sm text-gray-400"><p className="truncate">{new Date(frame.date).toLocaleDateString()} {frame.startTime && `- ${frame.startTime}`}</p><div className="flex items-center mt-2"><Users size={16} className="mr-2" /><span>{frame.players.length} Players</span></div></div></Card>);
};

function FrameInProgress({ frame, navigateTo, onUpdateFrame, currentUser }: { frame: IFrame | null; navigateTo: (page: string) => void; onUpdateFrame: (updates: Partial<IFrame>) => void; currentUser: IUser }) {
    const [pointsToLog, setPointsToLog] = useState('');
    if (!frame) return null;
    const isLogger = frame.creatorId === currentUser.clerkId;
    const isLive = frame.status === 'live';
    const isPending = frame.status === 'pending';
    const handleStartFrame = () => onUpdateFrame({ status: 'live', startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    const handleCloseFrame = () => { const winner = frame.players.reduce((p, c) => (p.score > c.score) ? p : c); onUpdateFrame({ status: 'completed', endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), winnerId: winner.clerkId }); };
    const handleLogScore = (e: React.FormEvent) => { e.preventDefault(); const points = parseInt(pointsToLog, 10); if (!isLive || !isLogger || isNaN(points)) return; const currentPlayer = frame.players[frame.turnIndex]; const updatedPlayers = frame.players.map(p => p.clerkId === currentPlayer.clerkId ? { ...p, score: p.score + points } : p ); const nextTurnIndex = (frame.turnIndex + 1) % frame.players.length; const newLogEntry = { turn: frame.log.length + 1, playerId: currentPlayer.clerkId, points: points }; onUpdateFrame({ players: updatedPlayers, turnIndex: nextTurnIndex, log: [...frame.log, newLogEntry] }); setPointsToLog(''); };
    const handleShuffle = () => onUpdateFrame({ players: [...frame.players].sort(() => Math.random() - 0.5) });
    const chartData = [] // Omitted for brevity
    return (<div><PageHeader title={frame.location} onBack={() => navigateTo('dashboard')}>{isLogger && isPending && (<Button onClick={handleStartFrame} className="w-auto px-4 py-2 text-sm flex items-center"><PlayCircle size={16} className="mr-2"/> Start</Button>)}</PageHeader>{/* ... full JSX omitted for brevity */}</div>);
}

function CreateFrame({ navigateTo, onCreateFrame, friends, currentUser }: { navigateTo: (page: string) => void; onCreateFrame: (data: any) => void; friends: IUser[]; currentUser: IUser }) {
    const [players, setPlayers] = useState<IUser[]>([currentUser]);
    const [location, setLocation] = useState('');
    const [tag, setTag] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleConfirmSelection = (selectedFriends: IUser[]) => { setPlayers([currentUser, ...selectedFriends]); setIsModalOpen(false); };
    const handleCreate = (e: React.FormEvent) => { e.preventDefault(); const frameFormData = { location, tag, players: players.map(p => ({ clerkId: p.clerkId, name: p.name, score: 0 })) }; onCreateFrame(frameFormData); };
    return (<div><PageHeader title="Create New Frame" onBack={() => navigateTo('dashboard')} /><AddPlayerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSelection} friends={friends} currentPlayers={players} currentUser={currentUser} /><form onSubmit={handleCreate}><Card className="mb-6 p-6"><h3 className="text-lg font-semibold mb-4">Frame Info</h3><div className="space-y-4"><input required type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-gray-700 rounded-lg px-4 py-3" /><input required type="text" placeholder="Tag" value={tag} onChange={(e) => setTag(e.target.value)} className="w-full bg-gray-700 rounded-lg px-4 py-3" /></div></Card><Card className="mb-6 p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Players</h3><button type="button" onClick={() => setIsModalOpen(true)} className="text-emerald-400 text-sm font-semibold flex items-center"><PlusCircle size={16} className="mr-1" /> Add / Edit</button></div><div className="space-y-3">{players.map((p, i) => (<div key={p.clerkId} className="flex items-center bg-gray-700 p-3 rounded-lg"><img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full" /><p className="ml-3 font-medium">{p.name}</p></div>))}</div></Card><Button type="submit" disabled={players.length < 2 || !location || !tag}>Create Frame & Proceed</Button></form></div>);
}

function AddPlayerModal({ isOpen, onClose, onConfirm, friends, currentPlayers, currentUser }: { isOpen: boolean; onClose: () => void; onConfirm: (players: IUser[]) => void; friends: IUser[]; currentPlayers: IUser[]; currentUser: IUser }) {
    const [selected, setSelected] = useState<string[]>([]);
    useEffect(() => { if(isOpen) setSelected(currentPlayers.filter(p => p.clerkId !== currentUser.clerkId).map(p => p.clerkId)); }, [isOpen, currentPlayers, currentUser.clerkId]);
    if (!isOpen) return null;
    const toggleSelection = (friendId: string) => setSelected(prev => prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]); 
    const handleConfirm = () => onConfirm(friends.filter(f => selected.includes(f.clerkId)));
    return (<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"><Card className="w-full max-w-md"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Add Players</h3><button onClick={onClose}><X size={20} /></button></div><div className="space-y-3 max-h-64 overflow-y-auto mb-6 pr-2">{friends.map(friend => { const isSelected = selected.includes(friend.clerkId); return (<div key={friend.clerkId} onClick={() => toggleSelection(friend.clerkId)} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${isSelected ? 'bg-emerald-500/20' : 'bg-gray-700 hover:bg-gray-600'}`}><div className="flex items-center"><img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full" /><p className="ml-3 font-medium">{friend.name}</p></div>{isSelected ? <CheckCircle size={20} className="text-emerald-400" /> : <UserPlus size={20} className="text-gray-400" />}</div>); })}</div><Button onClick={handleConfirm}>Done</Button></Card></div>);
}

function FindFriends({ navigateTo, allUsers, friends, onAddFriend, currentUser }: { navigateTo: (page: string) => void; allUsers: IUser[]; friends: IUser[]; onAddFriend: (user: IUser) => void; currentUser: IUser }) {
    const [searchTerm, setSearchTerm] = useState('');
    const friendIds = friends.map(f => f.clerkId);
    const filteredUsers = allUsers.filter(user => user.clerkId !== currentUser.clerkId && user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (<div><PageHeader title="Find Friends" onBack={() => navigateTo('dashboard')} /><div className="relative mb-6"><input type="text" placeholder="Search for players..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-800 rounded-lg px-4 py-3 pl-10" /><Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /></div><div className="space-y-4">{filteredUsers.map(user => { const isFriend = friendIds.includes(user.clerkId); return (<Card key={user._id} className="flex items-center justify-between"><div className="flex items-center"><img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" /><div className="ml-4"><p className="font-bold">{user.name}</p></div></div><Button onClick={() => onAddFriend(user)} disabled={isFriend} variant={isFriend ? "secondary" : "primary"} className="w-auto px-4 py-2 text-sm">{isFriend ? 'Friend' : 'Add Friend'}</Button></Card>); })}</div></div>);
}

function Profile({ navigateTo, userFrames, currentUser }: { navigateTo: (page: string) => void; userFrames: IFrame[]; currentUser: IUser }) {
    const completedFrames = userFrames.filter(f => f.status === 'completed');
    const totalFramesPlayed = completedFrames.length;
    const wins = completedFrames.filter(f => f.winnerId === currentUser.clerkId).length;
    const winPercentage = totalFramesPlayed > 0 ? Math.round((wins / totalFramesPlayed) * 100) : 0;
    const highestBreak = userFrames.reduce((max, frame) => Math.max(max, ...frame.log.filter(l => l.playerId === currentUser.clerkId).map(l => l.points).concat([0])), 0);
    const has147Break = highestBreak >= 147;
    const hasCenturyBreak = highestBreak >= 100;
    const has50PlusBreak = highestBreak >= 50;
    return (<div><PageHeader title="My Profile" /><Card className="text-center mb-6 p-6"><img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full mx-auto ring-4 ring-emerald-500" /><h2 className="text-2xl font-bold mt-4">{currentUser.name}</h2></Card><Card className="mb-6 p-6"><h2 className="text-lg font-semibold text-gray-300 mb-4">Quick Stats</h2><div className="grid grid-cols-3 gap-4 text-center"><div><p className="text-2xl font-bold text-emerald-400">{totalFramesPlayed}</p><p className="text-xs text-gray-400">Frames Played</p></div><div><p className="text-2xl font-bold text-emerald-400">{winPercentage}%</p><p className="text-xs text-gray-400">Win Rate</p></div><div><p className="text-2xl font-bold text-emerald-400">{highestBreak}</p><p className="text-xs text-gray-400">Highest Break</p></div></div></Card><Card className="p-6"><h3 className="text-lg font-bold mb-4">Achievements</h3><div className="flex space-x-4"><div className={`text-center p-2 rounded-lg flex-1 ${has147Break ? 'bg-yellow-500/20' : 'bg-gray-700 opacity-50'}`}><Trophy className={`mx-auto ${has147Break ? 'text-yellow-400' : 'text-gray-500'}`} size={32}/><p className="text-xs mt-1 font-semibold">147 Break</p></div><div className={`text-center p-2 rounded-lg flex-1 ${hasCenturyBreak ? 'bg-blue-500/20' : 'bg-gray-700 opacity-50'}`}><Shield className={`mx-auto ${hasCenturyBreak ? 'text-blue-400' : 'text-gray-500'}`} size={32}/><p className="text-xs mt-1 font-semibold">Century Club</p></div><div className={`text-center p-2 rounded-lg flex-1 ${has50PlusBreak ? 'bg-green-500/20' : 'bg-gray-700 opacity-50'}`}><Trophy className={`mx-auto ${has50PlusBreak ? 'text-green-400' : 'text-gray-500'}`} size={32}/><p className="text-xs mt-1 font-semibold">50+ Break</p></div></div></Card></div>);
}

function VenueFinder({ navigateTo, venues }: { navigateTo: (page: string) => void; venues: IVenue[] }) {
    return (<div><PageHeader title="Venue Finder" onBack={() => navigateTo('dashboard')} /><Card className="mb-6"><h3 className="text-lg font-semibold mb-4">Venues Near You</h3><div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden"><Target size={32} className="text-emerald-400 animate-pulse" /><p className="absolute bottom-4 text-xs text-gray-400">Map functionality coming soon!</p></div></Card><div className="space-y-4">{venues.map(venue => (<Card key={venue._id}><h4 className="font-bold">{venue.name}</h4><p className="text-sm text-gray-400">Rating: {venue.rating} ★</p></Card>))}</div></div>);
}

function Leaderboards({ navigateTo, leaderboardUsers }: { navigateTo: (page: string) => void; leaderboardUsers: IUser[] }) {
    const rankColors = ['bg-yellow-500/20 border-yellow-400', 'bg-gray-400/20 border-gray-300', 'bg-yellow-700/20 border-yellow-600'];
    return (<div><PageHeader title="Global Leaderboard" onBack={() => navigateTo('dashboard')} /><p className="text-gray-400 mb-6 -mt-4">Top players by win rate.</p><div className="space-y-3">{leaderboardUsers.map((user, index) => (<Card key={user._id} className={`border-2 ${rankColors[index] || 'border-gray-700'} flex items-center justify-between`}><div></div></Card>))}</div></div>);
}