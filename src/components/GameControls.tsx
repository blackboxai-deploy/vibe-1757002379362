"use client";

import { Button } from './ui/button';
import { Card } from './ui/card';

interface GameControlsProps {
  onInput: (action: string, pressed: boolean) => void;
}

export default function GameControls({ onInput }: GameControlsProps) {
  const handleTouchStart = (action: string) => {
    onInput(action, true);
  };

  const handleTouchEnd = (action: string) => {
    onInput(action, false);
  };

  return (
    <Card className="bg-slate-900/90 border-purple-500 p-4 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        {/* D-Pad */}
        <div className="relative">
          <div className="text-xs text-purple-400 text-center mb-2">Move</div>
          <div className="grid grid-cols-3 gap-1">
            {/* Top Row */}
            <div></div>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-300 h-12 w-12"
              onTouchStart={() => handleTouchStart('jump')}
              onTouchEnd={() => handleTouchEnd('jump')}
              onMouseDown={() => handleTouchStart('jump')}
              onMouseUp={() => handleTouchEnd('jump')}
            >
              ⬆️
            </Button>
            <div></div>
            
            {/* Middle Row */}
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-300 h-12 w-12"
              onTouchStart={() => handleTouchStart('left')}
              onTouchEnd={() => handleTouchEnd('left')}
              onMouseDown={() => handleTouchStart('left')}
              onMouseUp={() => handleTouchEnd('left')}
            >
              ⬅️
            </Button>
            <div className="h-12 w-12"></div>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-300 h-12 w-12"
              onTouchStart={() => handleTouchStart('right')}
              onTouchEnd={() => handleTouchEnd('right')}
              onMouseDown={() => handleTouchStart('right')}
              onMouseUp={() => handleTouchEnd('right')}
            >
              ➡️
            </Button>
            
            {/* Bottom Row */}
            <div></div>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-300 h-12 w-12"
              onTouchStart={() => handleTouchStart('down')}
              onTouchEnd={() => handleTouchEnd('down')}
              onMouseDown={() => handleTouchStart('down')}
              onMouseUp={() => handleTouchEnd('down')}
            >
              ⬇️
            </Button>
            <div></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="text-xs text-purple-400 text-center">Actions</div>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="lg"
              className="border-green-500 text-green-300 hover:bg-green-900/20 h-16 w-16"
              onTouchStart={() => handleTouchStart('jump')}
              onTouchEnd={() => handleTouchEnd('jump')}
              onMouseDown={() => handleTouchStart('jump')}
              onMouseUp={() => handleTouchEnd('jump')}
            >
              🦘<br/>
              <span className="text-xs">JUMP</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 text-red-300 hover:bg-red-900/20 h-12 w-16"
              onClick={() => {
                handleTouchStart('restart');
                setTimeout(() => handleTouchEnd('restart'), 100);
              }}
            >
              🔄<br/>
              <span className="text-xs">RESET</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-4 text-xs text-center text-purple-400">
        Use the D-pad to move and jump button to jump
      </div>
    </Card>
  );
}