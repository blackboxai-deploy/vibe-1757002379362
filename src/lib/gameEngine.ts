import { Player } from './player';
import { levels, Level } from './levels';
import { Obstacle, createObstacle } from './obstacles';
import { playSound } from './audio';

export interface GameState {
  level: number;
  lives: number;
  deaths: number;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  levelComplete: boolean;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  down: boolean;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private updateCallback: (state: Partial<GameState>) => void;
  
  private player: Player;
  private currentLevel: Level;
  private obstacles: Obstacle[] = [];
  private animationId: number = 0;
  
  private gameState: GameState = {
    level: 1,
    lives: 3,
    deaths: 0,
    score: 0,
    isGameOver: false,
    isPaused: false,
    levelComplete: false
  };
  
  private inputState: InputState = {
    left: false,
    right: false,
    jump: false,
    down: false
  };
  
  private lastTime = 0;
  private readonly targetFPS = 60;
  private readonly frameTime = 1000 / this.targetFPS;
  
  // Camera system
  private camera = { x: 0, y: 0 };
  private readonly TILE_SIZE = 32;

  constructor(canvas: HTMLCanvasElement, updateCallback: (state: Partial<GameState>) => void) {
    this.canvas = canvas;
    this.updateCallback = updateCallback;
    
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas context');
    }
    this.ctx = context;
    
    // Initialize game objects
    this.currentLevel = levels[0];
    this.player = new Player(
      this.currentLevel.startX * this.TILE_SIZE,
      this.currentLevel.startY * this.TILE_SIZE
    );
    
    this.loadLevel();
    this.setupCanvas();
  }

  private setupCanvas() {
    // Enable crisp pixel rendering
    this.ctx.imageSmoothingEnabled = false;
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  private loadLevel() {
    this.obstacles = [];
    this.currentLevel = levels[this.gameState.level - 1] || levels[0];
    
    // Create obstacles from level data
    this.currentLevel.obstacles.forEach(obstacleData => {
      const obstacle = createObstacle(obstacleData, this.TILE_SIZE);
      if (obstacle) {
        this.obstacles.push(obstacle);
      }
    });
    
    // Reset player position
    this.player.setPosition(
      this.currentLevel.startX * this.TILE_SIZE,
      this.currentLevel.startY * this.TILE_SIZE
    );
    
    this.gameState.levelComplete = false;
    this.updateCallback(this.gameState);
  }

  public start() {
    this.lastTime = performance.now();
    this.gameLoop();
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private gameLoop = (currentTime: number) => {
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime >= this.frameTime) {
      this.update(deltaTime / 1000); // Convert to seconds
      this.render();
      this.lastTime = currentTime;
    }
    
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number) {
    if (this.gameState.isPaused || this.gameState.isGameOver || this.gameState.levelComplete) {
      return;
    }

    // Update player
    this.player.update(deltaTime, this.inputState);
    
    // Update obstacles
    this.obstacles.forEach(obstacle => obstacle.update(deltaTime));
    
    // Check collisions
    this.checkCollisions();
    
    // Update camera
    this.updateCamera();
    
    // Check win condition
    this.checkWinCondition();
  }

  private updateCamera() {
    const targetX = this.player.x - this.canvas.width / 2;
    const targetY = this.player.y - this.canvas.height / 2;
    
    // Smooth camera following
    this.camera.x += (targetX - this.camera.x) * 0.1;
    this.camera.y += (targetY - this.camera.y) * 0.1;
    
    // Keep camera within level bounds
    const levelWidth = this.currentLevel.width * this.TILE_SIZE;
    const levelHeight = this.currentLevel.height * this.TILE_SIZE;
    
    this.camera.x = Math.max(0, Math.min(this.camera.x, levelWidth - this.canvas.width));
    this.camera.y = Math.max(0, Math.min(this.camera.y, levelHeight - this.canvas.height));
  }

  private checkCollisions() {
    // Platform collisions
    const playerBounds = this.player.getBounds();
    
    this.currentLevel.platforms.forEach(platform => {
      const platformBounds = {
        x: platform.x * this.TILE_SIZE,
        y: platform.y * this.TILE_SIZE,
        width: platform.width * this.TILE_SIZE,
        height: platform.height * this.TILE_SIZE
      };
      
      if (this.isColliding(playerBounds, platformBounds)) {
        this.player.handlePlatformCollision(platformBounds);
      }
    });
    
    // Obstacle collisions
    this.obstacles.forEach(obstacle => {
      if (obstacle.isActive && this.isColliding(playerBounds, obstacle.getBounds())) {
        if (obstacle.type === 'deadly') {
          this.playerDied();
        } else if (obstacle.type === 'checkpoint') {
          obstacle.activate();
          this.gameState.score += 100;
          playSound('checkpoint');
        }
      }
    });
    
    // Death boundaries
    if (this.player.y > this.currentLevel.height * this.TILE_SIZE + 100) {
      this.playerDied();
    }
  }

  private isColliding(rect1: any, rect2: any): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  private checkWinCondition() {
    const playerBounds = this.player.getBounds();
    const exitBounds = {
      x: this.currentLevel.exitX * this.TILE_SIZE,
      y: this.currentLevel.exitY * this.TILE_SIZE,
      width: this.TILE_SIZE,
      height: this.TILE_SIZE
    };
    
    if (this.isColliding(playerBounds, exitBounds)) {
      this.completeLevel();
    }
  }

  private playerDied() {
    this.gameState.deaths++;
    this.gameState.lives--;
    
    playSound('death');
    
    if (this.gameState.lives <= 0) {
      this.gameState.isGameOver = true;
    } else {
      // Respawn at start
      this.player.setPosition(
        this.currentLevel.startX * this.TILE_SIZE,
        this.currentLevel.startY * this.TILE_SIZE
      );
    }
    
    this.updateCallback(this.gameState);
  }

  private completeLevel() {
    this.gameState.levelComplete = true;
    this.gameState.score += 1000 - (this.gameState.deaths * 10);
    
    playSound('victory');
    this.updateCallback(this.gameState);
  }

  private render() {
    // Clear canvas
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Save context for camera transform
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);
    
    // Render background grid (optional)
    this.renderBackground();
    
    // Render platforms
    this.renderPlatforms();
    
    // Render obstacles
    this.obstacles.forEach(obstacle => obstacle.render(this.ctx));
    
    // Render exit
    this.renderExit();
    
    // Render player
    this.player.render(this.ctx);
    
    // Restore context
    this.ctx.restore();
    
    // Render UI elements (not affected by camera)
    this.renderUI();
  }

  private renderBackground() {
    this.ctx.strokeStyle = '#374151';
    this.ctx.lineWidth = 1;
    
    const startX = Math.floor(this.camera.x / this.TILE_SIZE) * this.TILE_SIZE;
    const startY = Math.floor(this.camera.y / this.TILE_SIZE) * this.TILE_SIZE;
    const endX = this.camera.x + this.canvas.width + this.TILE_SIZE;
    const endY = this.camera.y + this.canvas.height + this.TILE_SIZE;
    
    for (let x = startX; x < endX; x += this.TILE_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.camera.y);
      this.ctx.lineTo(x, this.camera.y + this.canvas.height);
      this.ctx.stroke();
    }
    
    for (let y = startY; y < endY; y += this.TILE_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.camera.x, y);
      this.ctx.lineTo(this.camera.x + this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  private renderPlatforms() {
    this.ctx.fillStyle = '#6b7280';
    this.ctx.strokeStyle = '#9ca3af';
    this.ctx.lineWidth = 2;
    
    this.currentLevel.platforms.forEach(platform => {
      const x = platform.x * this.TILE_SIZE;
      const y = platform.y * this.TILE_SIZE;
      const width = platform.width * this.TILE_SIZE;
      const height = platform.height * this.TILE_SIZE;
      
      // Platform gradient
      const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0, '#9ca3af');
      gradient.addColorStop(1, '#4b5563');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x, y, width, height);
      this.ctx.strokeRect(x, y, width, height);
    });
  }

  private renderExit() {
    const x = this.currentLevel.exitX * this.TILE_SIZE;
    const y = this.currentLevel.exitY * this.TILE_SIZE;
    
    // Animated exit portal
    const time = Date.now() / 1000;
    const pulse = Math.sin(time * 3) * 0.2 + 0.8;
    
    const gradient = this.ctx.createRadialGradient(
      x + this.TILE_SIZE / 2, y + this.TILE_SIZE / 2, 0,
      x + this.TILE_SIZE / 2, y + this.TILE_SIZE / 2, this.TILE_SIZE * pulse
    );
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(1, 'transparent');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
    
    // Exit door
    this.ctx.fillStyle = '#059669';
    this.ctx.fillRect(x + 4, y + 4, this.TILE_SIZE - 8, this.TILE_SIZE - 8);
  }

  private renderUI() {
    // Level indicator
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 16px monospace';
    this.ctx.fillText(`Level: ${this.gameState.level}`, 10, 30);
    
    // Watermark
    this.ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
    this.ctx.font = '12px monospace';
    this.ctx.fillText('OMPREET JAISWAL', this.canvas.width - 140, this.canvas.height - 10);
  }

  // Public methods for game control
  public handleInput(action: string, pressed: boolean) {
    switch (action) {
      case 'left':
        this.inputState.left = pressed;
        break;
      case 'right':
        this.inputState.right = pressed;
        break;
      case 'jump':
        this.inputState.jump = pressed;
        break;
      case 'down':
        this.inputState.down = pressed;
        break;
    }
  }

  public togglePause() {
    this.gameState.isPaused = !this.gameState.isPaused;
    this.updateCallback(this.gameState);
  }

  public restartLevel() {
    this.gameState.lives = 3;
    this.gameState.deaths = 0;
    this.gameState.isGameOver = false;
    this.gameState.levelComplete = false;
    this.loadLevel();
    this.updateCallback(this.gameState);
  }

  public nextLevel() {
    if (this.gameState.level < levels.length) {
      this.gameState.level++;
      this.gameState.levelComplete = false;
      this.loadLevel();
      this.updateCallback(this.gameState);
    } else {
      // Game completed
      this.gameState.isGameOver = true;
      this.updateCallback(this.gameState);
    }
  }

  public restartGame() {
    this.gameState = {
      level: 1,
      lives: 3,
      deaths: 0,
      score: 0,
      isGameOver: false,
      isPaused: false,
      levelComplete: false
    };
    this.loadLevel();
    this.updateCallback(this.gameState);
  }
}