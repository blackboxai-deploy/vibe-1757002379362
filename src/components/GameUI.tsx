"use client";

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface GameState {
  level: number;
  lives: number;
  deaths: number;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  levelComplete: boolean;
}

interface GameUIProps {
  gameState: GameState;
  onRestart: () => void;
}

export default function GameUI({ gameState, onRestart }: GameUIProps) {
  return (
    <Card className="bg-gradient-to-r from-slate-800 to-purple-900 border-purple-500 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Game Stats */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Level */}
          <Badge variant="outline" className="border-purple-400 text-purple-200">
            Level {gameState.level}
          </Badge>
          
          {/* Lives */}
          <div className="flex items-center space-x-1">
            <span className="text-sm text-purple-300">Lives:</span>
            <div className="flex space-x-1">
              {[...Array(Math.max(0, gameState.lives))].map((_, i) => (
                <span key={i} className="text-red-500 text-sm">❤️</span>
              ))}
              {[...Array(Math.max(0, 3 - gameState.lives))].map((_, i) => (
                <span key={`empty-${i}`} className="text-gray-500 text-sm">🤍</span>
              ))}
            </div>
          </div>
          
          {/* Deaths */}
          <Badge variant="destructive" className="bg-red-900/50 border-red-600">
            Deaths: {gameState.deaths}
          </Badge>
          
          {/* Score */}
          <Badge variant="outline" className="border-green-400 text-green-200">
            Score: {gameState.score.toLocaleString()}
          </Badge>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="border-purple-500 text-purple-300 hover:bg-purple-900/20"
          >
            🔄 Restart
          </Button>
          
          <div className="hidden md:block text-xs text-purple-400">
            Press R to restart • ESC to pause
          </div>
        </div>
      </div>
      
      {/* Game Status Messages */}
      {gameState.isPaused && (
        <div className="mt-2 text-center">
          <Badge variant="outline" className="border-yellow-500 text-yellow-300">
            ⏸ Game Paused
          </Badge>
        </div>
      )}
      
      {gameState.isGameOver && (
        <div className="mt-2 text-center">
          <Badge variant="destructive" className="bg-red-900 border-red-600 text-red-100">
            💀 Game Over
          </Badge>
        </div>
      )}
      
      {gameState.levelComplete && (
        <div className="mt-2 text-center">
          <Badge variant="outline" className="border-green-500 text-green-300">
            🎉 Level Complete!
          </Badge>
        </div>
      )}
    </Card>
  );
}