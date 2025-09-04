"use client";

import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface GameState {
  level: number;
  lives: number;
  deaths: number;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  levelComplete: boolean;
}

interface GameOverModalProps {
  gameState: GameState;
  onRestart: () => void;
  onMenu: () => void;
}

export default function GameOverModal({ gameState, onRestart, onMenu }: GameOverModalProps) {
  if (!gameState.isGameOver) return null;

  const isAllLevelsComplete = gameState.level > 5; // Assuming 5 levels total

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-slate-800 to-red-900 p-8 rounded-lg border-2 border-red-500 max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-6">
          {isAllLevelsComplete ? (
            <>
              <h2 className="text-4xl font-bold text-green-400 mb-2">🎉 CONGRATULATIONS! 🎉</h2>
              <p className="text-xl text-green-300">You Beat Level Devil!</p>
              <p className="text-sm text-purple-300 mt-2">
                You survived all the devilish tricks and traps!
              </p>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-red-400 mb-2">💀 GAME OVER 💀</h2>
              <p className="text-xl text-red-300">The Devil Claims Another Soul</p>
              <p className="text-sm text-purple-300 mt-2">
                Don't give up! Every death teaches you something new.
              </p>
            </>
          )}
        </div>

        {/* Statistics */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Levels Reached:</span>
            <Badge variant="outline" className="border-purple-400 text-purple-200">
              {gameState.level} / 5
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Total Deaths:</span>
            <Badge variant="destructive" className="bg-red-900/50 border-red-600">
              {gameState.deaths}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Final Score:</span>
            <Badge variant="outline" className="border-green-400 text-green-200">
              {gameState.score.toLocaleString()}
            </Badge>
          </div>
          
          {/* Performance Rating */}
          <div className="border-t border-purple-700 pt-3">
            <div className="text-sm text-purple-300 mb-2">Performance Rating:</div>
            {(() => {
              const deathsPerLevel = gameState.deaths / gameState.level;
              if (deathsPerLevel <= 5) {
                return <Badge className="bg-green-900 border-green-600 text-green-200">🏆 Legendary</Badge>;
              } else if (deathsPerLevel <= 10) {
                return <Badge className="bg-blue-900 border-blue-600 text-blue-200">⭐ Expert</Badge>;
              } else if (deathsPerLevel <= 20) {
                return <Badge className="bg-yellow-900 border-yellow-600 text-yellow-200">👍 Good</Badge>;
              } else if (deathsPerLevel <= 30) {
                return <Badge className="bg-orange-900 border-orange-600 text-orange-200">😅 Learning</Badge>;
              } else {
                return <Badge className="bg-red-900 border-red-600 text-red-200">💀 Devil's Plaything</Badge>;
              }
            })()}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mb-6 p-3 bg-slate-900/50 rounded border border-purple-700">
          <p className="text-sm text-purple-300">
            {isAllLevelsComplete 
              ? "Amazing! You've conquered every devilish challenge we threw at you. You are truly a platforming legend!"
              : gameState.deaths < 10 
                ? "Not bad! You're getting the hang of the Devil's tricks."
                : gameState.deaths < 25
                  ? "The Devil is laughing, but you're learning! Keep trying!"
                  : gameState.deaths < 50
                    ? "The Devil approves of your persistence. Don't give up!"
                    : "The Devil is impressed by your determination. You're unstoppable!"
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isAllLevelsComplete && (
            <Button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg py-6"
            >
              🔥 Try Again 🔥
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={onMenu}
            className="w-full border-purple-500 text-purple-300 hover:bg-purple-900/20"
          >
            🏠 Back to Menu
          </Button>
        </div>

        {/* Watermark */}
        <div className="mt-6 text-xs text-purple-400/60">
          Created by OMPREET JAISWAL
        </div>
      </div>
    </div>
  );
}