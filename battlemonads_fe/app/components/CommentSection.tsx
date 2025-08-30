'use client';

import React, { useState } from 'react';
import { useSupabase } from '../providers/SupabaseProvider';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface Comment {
  id: string;
  user: string;
  userAvatar?: string;
  userName?: string;
  message: string;
  timestamp: Date;
  type: 'comment' | 'attack';
  target?: 'ETH' | 'BTC';
  damage?: number;
}

interface CommentSectionProps {
  battleId?: string;
  onSubmitComment: (message: string, type: 'comment' | 'attack', target?: 'ETH' | 'BTC') => void;
  userAddress?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  battleId,
  onSubmitComment,
  userAddress,
}) => {
  const { user } = useSupabase();
  const [newComment, setNewComment] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<'ETH' | 'BTC' | null>(null);
  
  // Mock comments data with Discord profiles
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      user: '0x1234...5678',
      userName: 'CryptoKnight',
      userAvatar: 'https://cdn.discordapp.com/avatars/123456789/avatar1.png',
      message: 'ETH monster looking strong! 🦄',
      timestamp: new Date(Date.now() - 300000),
      type: 'comment',
    },
    {
      id: '2',
      user: '0x9876...4321',
      userName: 'DragonSlayer',
      userAvatar: 'https://cdn.discordapp.com/avatars/987654321/avatar2.png',
      message: 'attack',
      timestamp: new Date(Date.now() - 240000),
      type: 'attack',
      target: 'BTC',
      damage: 15,
    },
    {
      id: '3',
      user: '0xabcd...efgh',
      userName: 'MonsterTamer',
      userAvatar: 'https://cdn.discordapp.com/avatars/111222333/avatar3.png',
      message: 'BTC is recovering! Weather bonus helping 🌧️',
      timestamp: new Date(Date.now() - 180000),
      type: 'comment',
    },
    {
      id: '4',
      user: '0x5555...9999',
      userName: 'BattleMaster',
      userAvatar: 'https://cdn.discordapp.com/avatars/555666777/avatar4.png',
      message: 'attack',
      timestamp: new Date(Date.now() - 120000),
      type: 'attack',
      target: 'ETH',
      damage: 22,
    },
    {
      id: '5',
      user: '0x1111...2222',
      userName: 'PriceWatcher',
      userAvatar: 'https://cdn.discordapp.com/avatars/888999000/avatar5.png',
      message: 'This battle is intense! Price movements affecting HP in real-time',
      timestamp: new Date(Date.now() - 60000),
      type: 'comment',
    },
  ]);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    const isAttack = newComment.toLowerCase() === 'attack';
    
    if (isAttack && selectedTarget) {
      onSubmitComment(newComment, 'attack', selectedTarget);
    } else if (!isAttack) {
      onSubmitComment(newComment, 'comment');
    }
    
    setNewComment('');
    setSelectedTarget(null);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const isAttackCommand = newComment.toLowerCase() === 'attack';

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Battle Comments</h3>
        <Badge variant="info" size="sm">
          {comments.length} comments
        </Badge>
      </div>
      
      {/* Comment Input */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Comment or type "attack" to damage monsters...'
            className="flex-1 bg-[#121619] border border-[#2A3238] rounded-lg px-4 py-3 text-white placeholder-[#5A6269] focus:outline-none focus:border-[#5AD8CC] text-base"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button onClick={handleSubmit} disabled={!newComment.trim()} size="lg">
            {isAttackCommand ? 'Attack' : 'Send'}
          </Button>
        </div>
        
        {/* Attack Target Selection */}
        {isAttackCommand && (
          <div className="flex gap-3 items-center p-4 bg-[#121619] rounded-lg border border-[#2A3238]">
            <span className="text-sm text-[#8B9299] font-medium">Select target:</span>
            <button
              onClick={() => setSelectedTarget('ETH')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTarget === 'ETH' 
                  ? 'bg-[#627EEA]/20 text-[#627EEA] border border-[#627EEA]'
                  : 'bg-[#1a1f24] text-[#8B9299] border border-[#2A3238] hover:border-[#627EEA]/50'
              }`}
            >
              🦄 ETH Monster
            </button>
            <button
              onClick={() => setSelectedTarget('BTC')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTarget === 'BTC' 
                  ? 'bg-[#F7931A]/20 text-[#F7931A] border border-[#F7931A]'
                  : 'bg-[#1a1f24] text-[#8B9299] border border-[#2A3238] hover:border-[#F7931A]/50'
              }`}
            >
              🦁 BTC Monster
            </button>
          </div>
        )}
        
        {!user && (
          <div className="mt-4 p-4 bg-[#F87171]/10 border border-[#F87171]/30 rounded-lg">
            <p className="text-sm text-[#F87171] font-medium">
              💡 Login with Discord to participate in battle comments and attacks
            </p>
          </div>
        )}
      </div>
      
      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-[#121619] rounded-lg p-4 border border-[#2A3238]">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {comment.userAvatar && (
                    <img 
                      src={comment.userAvatar} 
                      alt={comment.userName || 'User'} 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    {comment.userName && (
                      <p className="text-sm font-medium text-[#5AD8CC]">{comment.userName}</p>
                    )}
                    <p className="text-xs font-mono text-[#8B9299]">
                      {comment.user.slice(0, 6)}...{comment.user.slice(-4)}
                    </p>
                  </div>
                </div>
                {comment.type === 'attack' && (
                  <Badge 
                    variant={comment.target === 'ETH' ? 'eth' : 'btc'} 
                    size="sm"
                  >
                    ⚔️ Attack {comment.target}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-[#8B9299] font-medium">
                {formatTime(comment.timestamp)}
              </span>
            </div>
            
            {comment.type === 'attack' ? (
              <div className="flex items-center gap-3">
                <span className="text-base text-[#F87171]">⚔️ {comment.message}</span>
                {comment.damage && (
                  <Badge variant="error" size="sm">
                    -{comment.damage} HP
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-base text-[#B8BFC6] leading-relaxed">{comment.message}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-[#2A3238]">
        <div className="flex justify-between items-center text-sm text-[#8B9299]">
          <span>💡 Type "attack" and select target to damage monsters</span>
          <span>⚡ Comments update in real-time</span>
        </div>
      </div>
    </Card>
  );
};