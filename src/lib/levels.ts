export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  solid?: boolean;
  fake?: boolean;
}

export interface ObstacleData {
  type: 'spike' | 'movingPlatform' | 'disappearing' | 'crusher' | 'fakeWall' | 'teleporter' | 'checkpoint';
  x: number;
  y: number;
  width?: number;
  height?: number;
  moveSpeed?: number;
  direction?: 'horizontal' | 'vertical';
  range?: number;
  delay?: number;
  target?: { x: number; y: number };
}

export interface Level {
  id: number;
  name: string;
  width: number;
  height: number;
  startX: number;
  startY: number;
  exitX: number;
  exitY: number;
  platforms: Platform[];
  obstacles: ObstacleData[];
  deathMessage?: string;
}

export const levels: Level[] = [
  // Level 1: Welcome to Hell
  {
    id: 1,
    name: "Welcome to Hell",
    width: 40,
    height: 20,
    startX: 2,
    startY: 15,
    exitX: 35,
    exitY: 15,
    deathMessage: "Even the tutorial can kill you here!",
    platforms: [
      // Starting platform
      { x: 1, y: 17, width: 4, height: 2 },
      // Main path
      { x: 7, y: 16, width: 3, height: 1 },
      { x: 12, y: 15, width: 4, height: 1 },
      { x: 18, y: 14, width: 3, height: 1 },
      { x: 23, y: 16, width: 4, height: 1 },
      { x: 29, y: 15, width: 3, height: 1 },
      // Exit platform
      { x: 34, y: 17, width: 4, height: 2 },
      // Fake wall near exit (looks like platform)
      { x: 32, y: 15, width: 1, height: 2, fake: true },
      // Ground spikes
      { x: 0, y: 19, width: 40, height: 1 }
    ],
    obstacles: [
      // Basic spikes
      { type: 'spike', x: 10, y: 16 },
      { type: 'spike', x: 16, y: 15 },
      { type: 'spike', x: 21, y: 17 },
      // Hidden spike in fake safe area
      { type: 'spike', x: 27, y: 16 },
      // Checkpoint
      { type: 'checkpoint', x: 20, y: 13 }
    ]
  },

  // Level 2: Vanishing Act
  {
    id: 2,
    name: "Vanishing Act",
    width: 45,
    height: 22,
    startX: 2,
    startY: 18,
    exitX: 42,
    exitY: 16,
    deathMessage: "Trust nothing that supports you!",
    platforms: [
      // Starting area
      { x: 1, y: 20, width: 4, height: 2 },
      // Stable platforms (few and far between)
      { x: 8, y: 19, width: 2, height: 1 },
      { x: 15, y: 17, width: 2, height: 1 },
      { x: 25, y: 15, width: 2, height: 1 },
      { x: 35, y: 17, width: 2, height: 1 },
      // Exit platform
      { x: 41, y: 18, width: 4, height: 2 },
      // Ground death
      { x: 0, y: 21, width: 45, height: 1 }
    ],
    obstacles: [
      // Disappearing platforms (look like normal platforms)
      { type: 'disappearing', x: 6, y: 19, width: 2, height: 1, delay: 1000 },
      { type: 'disappearing', x: 11, y: 18, width: 3, height: 1, delay: 800 },
      { type: 'disappearing', x: 18, y: 16, width: 3, height: 1, delay: 1200 },
      { type: 'disappearing', x: 22, y: 18, width: 2, height: 1, delay: 600 },
      { type: 'disappearing', x: 28, y: 16, width: 3, height: 1, delay: 1000 },
      { type: 'disappearing', x: 32, y: 18, width: 2, height: 1, delay: 900 },
      { type: 'disappearing', x: 38, y: 17, width: 2, height: 1, delay: 700 },
      // Spikes on stable platforms (extra cruel)
      { type: 'spike', x: 9, y: 18 },
      { type: 'spike', x: 26, y: 14 },
      // Checkpoint
      { type: 'checkpoint', x: 20, y: 15 }
    ]
  },

  // Level 3: Moving Madness
  {
    id: 3,
    name: "Moving Madness",
    width: 50,
    height: 25,
    startX: 2,
    startY: 20,
    exitX: 47,
    exitY: 18,
    deathMessage: "Timing is everything, except when it's not!",
    platforms: [
      // Starting platform
      { x: 1, y: 22, width: 4, height: 2 },
      // Static platforms
      { x: 10, y: 20, width: 2, height: 1 },
      { x: 20, y: 18, width: 2, height: 1 },
      { x: 30, y: 16, width: 2, height: 1 },
      { x: 40, y: 19, width: 2, height: 1 },
      // Exit platform
      { x: 46, y: 20, width: 4, height: 2 },
      // Crusher paths
      { x: 15, y: 12, width: 10, height: 1 },
      { x: 25, y: 8, width: 15, height: 1 },
      // Ground death
      { x: 0, y: 24, width: 50, height: 1 }
    ],
    obstacles: [
      // Moving platforms
      { type: 'movingPlatform', x: 7, y: 21, width: 3, height: 1, direction: 'horizontal', range: 6, moveSpeed: 60 },
      { type: 'movingPlatform', x: 15, y: 19, width: 2, height: 1, direction: 'vertical', range: 4, moveSpeed: 40 },
      { type: 'movingPlatform', x: 25, y: 17, width: 3, height: 1, direction: 'horizontal', range: 8, moveSpeed: 80 },
      { type: 'movingPlatform', x: 35, y: 20, width: 2, height: 1, direction: 'vertical', range: 6, moveSpeed: 50 },
      
      // Crushers (moving death blocks)
      { type: 'crusher', x: 15, y: 5, width: 2, height: 2, direction: 'vertical', range: 10, moveSpeed: 100 },
      { type: 'crusher', x: 30, y: 5, width: 2, height: 2, direction: 'vertical', range: 8, moveSpeed: 120 },
      
      // Static spikes in "safe" areas
      { type: 'spike', x: 11, y: 19 },
      { type: 'spike', x: 21, y: 17 },
      { type: 'spike', x: 31, y: 15 },
      
      // Checkpoints
      { type: 'checkpoint', x: 18, y: 16 },
      { type: 'checkpoint', x: 35, y: 14 }
    ]
  },

  // Level 4: Invisible Maze
  {
    id: 4,
    name: "Invisible Maze",
    width: 55,
    height: 28,
    startX: 2,
    startY: 24,
    exitX: 52,
    exitY: 22,
    deathMessage: "What you can't see CAN hurt you!",
    platforms: [
      // Starting platform
      { x: 1, y: 26, width: 4, height: 2 },
      // Visible platforms (very few)
      { x: 10, y: 24, width: 2, height: 1 },
      { x: 25, y: 20, width: 2, height: 1 },
      { x: 40, y: 18, width: 2, height: 1 },
      // Exit platform
      { x: 51, y: 24, width: 4, height: 2 },
      // Ground death
      { x: 0, y: 27, width: 55, height: 1 }
    ],
    obstacles: [
      // Fake walls (invisible barriers)
      { type: 'fakeWall', x: 8, y: 20, width: 1, height: 5 },
      { type: 'fakeWall', x: 15, y: 18, width: 1, height: 7 },
      { type: 'fakeWall', x: 23, y: 15, width: 1, height: 8 },
      { type: 'fakeWall', x: 30, y: 12, width: 1, height: 10 },
      { type: 'fakeWall', x: 38, y: 14, width: 1, height: 8 },
      { type: 'fakeWall', x: 45, y: 16, width: 1, height: 6 },
      
      // Invisible platforms (player must feel for them)
      { type: 'disappearing', x: 6, y: 23, width: 3, height: 1, delay: 0 },
      { type: 'disappearing', x: 13, y: 21, width: 3, height: 1, delay: 0 },
      { type: 'disappearing', x: 18, y: 19, width: 4, height: 1, delay: 0 },
      { type: 'disappearing', x: 27, y: 17, width: 3, height: 1, delay: 0 },
      { type: 'disappearing', x: 33, y: 15, width: 4, height: 1, delay: 0 },
      { type: 'disappearing', x: 42, y: 17, width: 3, height: 1, delay: 0 },
      { type: 'disappearing', x: 47, y: 19, width: 3, height: 1, delay: 0 },
      
      // Hidden spikes
      { type: 'spike', x: 12, y: 22 },
      { type: 'spike', x: 20, y: 18 },
      { type: 'spike', x: 29, y: 16 },
      { type: 'spike', x: 36, y: 14 },
      { type: 'spike', x: 44, y: 16 },
      
      // Teleporters (transport to different locations)
      { type: 'teleporter', x: 16, y: 23, target: { x: 32, y: 20 } },
      { type: 'teleporter', x: 35, y: 19, target: { x: 48, y: 21 } },
      
      // Checkpoints
      { type: 'checkpoint', x: 22, y: 18 },
      { type: 'checkpoint', x: 41, y: 16 }
    ]
  },

  // Level 5: The Devil's Trick
  {
    id: 5,
    name: "The Devil's Trick",
    width: 60,
    height: 30,
    startX: 2,
    startY: 26,
    exitX: 57,
    exitY: 24,
    deathMessage: "The devil always has the last laugh!",
    platforms: [
      // Starting platform
      { x: 1, y: 28, width: 4, height: 2 },
      // Scattered visible platforms
      { x: 8, y: 26, width: 2, height: 1 },
      { x: 15, y: 24, width: 2, height: 1 },
      { x: 25, y: 22, width: 2, height: 1 },
      { x: 35, y: 20, width: 2, height: 1 },
      { x: 45, y: 22, width: 2, height: 1 },
      // Fake exit platform (trap!)
      { x: 52, y: 26, width: 4, height: 2, fake: true },
      // Real exit platform (hidden)
      { x: 56, y: 26, width: 4, height: 2 },
      // Ground death
      { x: 0, y: 29, width: 60, height: 1 }
    ],
    obstacles: [
      // Multiple fake exits
      { type: 'spike', x: 53, y: 25 }, // Spike in fake exit
      { type: 'spike', x: 54, y: 25 },
      { type: 'spike', x: 55, y: 25 },
      
      // Combination of all previous level mechanics
      // Disappearing platforms
      { type: 'disappearing', x: 6, y: 25, width: 3, height: 1, delay: 1500 },
      { type: 'disappearing', x: 12, y: 23, width: 4, height: 1, delay: 1200 },
      { type: 'disappearing', x: 20, y: 21, width: 3, height: 1, delay: 800 },
      { type: 'disappearing', x: 30, y: 19, width: 4, height: 1, delay: 1000 },
      { type: 'disappearing', x: 40, y: 21, width: 3, height: 1, delay: 900 },
      { type: 'disappearing', x: 48, y: 23, width: 3, height: 1, delay: 600 },
      
      // Moving platforms
      { type: 'movingPlatform', x: 10, y: 20, width: 3, height: 1, direction: 'vertical', range: 6, moveSpeed: 70 },
      { type: 'movingPlatform', x: 18, y: 25, width: 2, height: 1, direction: 'horizontal', range: 8, moveSpeed: 90 },
      { type: 'movingPlatform', x: 28, y: 18, width: 3, height: 1, direction: 'vertical', range: 5, moveSpeed: 60 },
      { type: 'movingPlatform', x: 38, y: 24, width: 2, height: 1, direction: 'horizontal', range: 10, moveSpeed: 100 },
      
      // Crushers
      { type: 'crusher', x: 22, y: 10, width: 2, height: 2, direction: 'vertical', range: 12, moveSpeed: 150 },
      { type: 'crusher', x: 32, y: 8, width: 2, height: 2, direction: 'vertical', range: 14, moveSpeed: 130 },
      { type: 'crusher', x: 42, y: 12, width: 2, height: 2, direction: 'vertical', range: 10, moveSpeed: 140 },
      
      // Fake walls
      { type: 'fakeWall', x: 13, y: 18, width: 1, height: 8 },
      { type: 'fakeWall', x: 23, y: 15, width: 1, height: 10 },
      { type: 'fakeWall', x: 33, y: 12, width: 1, height: 12 },
      { type: 'fakeWall', x: 43, y: 16, width: 1, height: 8 },
      
      // Teleporters with deceptive targets
      { type: 'teleporter', x: 17, y: 22, target: { x: 50, y: 20 } }, // Sends near fake exit
      { type: 'teleporter', x: 29, y: 17, target: { x: 8, y: 24 } },  // Sends back to beginning
      { type: 'teleporter', x: 41, y: 19, target: { x: 55, y: 23 } }, // Sends to real exit area
      
      // Spikes everywhere
      { type: 'spike', x: 9, y: 25 },
      { type: 'spike', x: 14, y: 23 },
      { type: 'spike', x: 19, y: 20 },
      { type: 'spike', x: 24, y: 21 },
      { type: 'spike', x: 29, y: 19 },
      { type: 'spike', x: 34, y: 19 },
      { type: 'spike', x: 39, y: 20 },
      { type: 'spike', x: 44, y: 21 },
      { type: 'spike', x: 49, y: 22 },
      
      // Checkpoints (but are they real?)
      { type: 'checkpoint', x: 16, y: 20 },
      { type: 'checkpoint', x: 31, y: 16 },
      { type: 'checkpoint', x: 46, y: 18 }
    ]
  }
];