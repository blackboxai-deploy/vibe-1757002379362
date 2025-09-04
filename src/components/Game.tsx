"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { GameEngine } from '@/lib/gameEngine';
import GameUI from './GameUI';
import GameControls from './GameControls';
import GameOverModal from './GameOverModal';
import { Button } from './ui/button';

interface GameProps {
  onBackToMenu: () => void;
}

export default function Game({ onBackToMenu }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState({
    level: 1,
    lives: 3,
    deaths: 0,
    score: 0,
    isGameOver: false,
    isPaused: false,
    levelComplete: false
  });

  // Game state update callback
  const updateGameState = useCallback((newState: Partial<typeof gameState>) => {
    setGameState(prev => ({ ...prev, ...newState }));
  }, []);

  // Initialize game engine
  useEffect(() => {
    if (canvasRef.current && !gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(canvasRef.current, updateGameState);
      gameEngineRef.current.start();
    }

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
      }
    };
  }, [updateGameState]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameEngineRef.current) return;

      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
        case 'Space':
          event.preventDefault();
          gameEngineRef.current.handleInput('jump', true);
          break;
        case 'KeyA':
        case 'ArrowLeft':
          gameEngineRef.current.handleInput('left', true);
          break;
        case 'KeyD':
        case 'ArrowRight':
          gameEngineRef.current.handleInput('right', true);
          break;
        case 'KeyS':
        case 'ArrowDown':
          gameEngineRef.current.handleInput('down', true);
          break;
        case 'KeyR':
          gameEngineRef.current.restartLevel();
          break;
        case 'Escape':
          gameEngineRef.current.togglePause();
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!gameEngineRef.current) return;

      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
        case 'Space':
          gameEngineRef.current.handleInput('jump', false);
          break;
        case 'KeyA':
        case 'ArrowLeft':
          gameEngineRef.current.handleInput('left', false);
          break;
        case 'KeyD':
        case 'ArrowRight':
          gameEngineRef.current.handleInput('right', false);
          break;
        case 'KeyS':
        case 'ArrowDown':
          gameEngineRef.current.handleInput('down', false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle touch controls
  const handleTouchInput = (action: string, pressed: boolean) => {
    if (gameEngineRef.current) {
      gameEngineRef.current.handleInput(action, pressed);
    }
  };

  const restartLevel = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restartLevel();
    }
  };

  const nextLevel = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.nextLevel();
    }
  };

  const restartGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restartGame();
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-black rounded-lg overflow-hidden border-2 border-purple-500">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-900 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBackToMenu}
            className="border-purple-500 text-purple-300 hover:bg-purple-900/20"
          >
            ← Menu
          </Button>
          <h2 className="text-xl font-bold text-white">Level Devil</h2>
        </div>
        <div className="text-sm text-purple-400">
          Created by OMPREET JAISWAL
        </div>
      </div>

      {/* Game UI */}
      <GameUI gameState={gameState} onRestart={restartLevel} />

      {/* Game Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={1200}
          height={600}
          className="w-full h-auto bg-gradient-to-b from-slate-800 to-slate-900 block"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {gameState.isPaused && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-slate-800 p-8 rounded-lg border border-purple-500 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Game Paused</h3>
              <p className="text-purple-300 mb-4">Press ESC to resume</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden">
        <GameControls onInput={handleTouchInput} />
      </div>

      {/* Game Over Modal */}
      {gameState.isGameOver && (
        <GameOverModal
          gameState={gameState}
          onRestart={restartGame}
          onMenu={onBackToMenu}
        />
      )}

      {/* Level Complete Modal */}
      {gameState.levelComplete && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-slate-800 to-purple-900 p-8 rounded-lg border-2 border-purple-500 text-center max-w-md">
            <h3 className="text-3xl font-bold text-green-400 mb-4">Level Complete!</h3>
            <div className="space-y-2 mb-6">
              <p className="text-white">Level {gameState.level} Complete</p>
              <p className="text-purple-300">Deaths: {gameState.deaths}</p>
              <p className="text-purple-300">Score: {gameState.score}</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={nextLevel}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Next Level
              </Button>
              <Button
                variant="outline"
                onClick={restartLevel}
                className="border-purple-500 text-purple-300"
              >
                Replay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}