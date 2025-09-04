"use client";

import { useState } from 'react';
import Game from '@/components/Game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Header with Watermark */}
      <div className="absolute top-4 left-4 z-50">
        <Badge variant="outline" className="bg-black/50 text-white border-purple-500">
          Created by OMPREET JAISWAL
        </Badge>
      </div>

      {!gameStarted ? (
        <Card className="max-w-2xl w-full bg-black/40 border-purple-500 p-8 text-center backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
                LEVEL DEVIL
              </h1>
              <p className="text-xl text-purple-300">
                A Deceptively Challenging Platformer
              </p>
            </div>

            {showInstructions && (
              <div className="space-y-4 text-left bg-slate-800/50 p-6 rounded-lg border border-purple-700">
                <h3 className="text-lg font-semibold text-purple-300">How to Play:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <h4 className="font-medium text-white mb-2">Desktop Controls:</h4>
                    <ul className="space-y-1">
                      <li>• WASD or Arrow Keys - Move</li>
                      <li>• SPACE - Jump</li>
                      <li>• R - Restart Level</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Mobile Controls:</h4>
                    <ul className="space-y-1">
                      <li>• Touch D-Pad - Move</li>
                      <li>• Jump Button - Jump</li>
                      <li>• Restart Button - Reset</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-purple-700 pt-4">
                  <h4 className="font-medium text-red-400 mb-2">Warning:</h4>
                  <p className="text-sm text-gray-300">
                    Nothing is as it seems. Platforms may disappear, walls may be fake, 
                    and the exit might not be where you think it is. Trust nothing!
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => setGameStarted(true)}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg py-6"
              >
                Start Game
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInstructions(!showInstructions)}
                className="border-purple-500 text-purple-300 hover:bg-purple-900/20"
              >
                {showInstructions ? 'Hide' : 'Show'} Instructions
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="w-full max-w-6xl">
          <Game onBackToMenu={() => setGameStarted(false)} />
        </div>
      )}

      {/* Footer Watermark */}
      <div className="absolute bottom-4 right-4 text-xs text-purple-400/60">
        © 2024 OMPREET JAISWAL
      </div>
    </div>
  );
}