import { ObstacleData } from './levels';

export abstract class Obstacle {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public type: 'deadly' | 'platform' | 'checkpoint';
  public isActive: boolean = true;
  
  protected tileSize: number;
  protected animationTime: number = 0;

  constructor(data: ObstacleData, tileSize: number) {
    this.x = data.x * tileSize;
    this.y = data.y * tileSize;
    this.width = (data.width || 1) * tileSize;
    this.height = (data.height || 1) * tileSize;
    this.tileSize = tileSize;
    this.type = 'deadly'; // Default type
  }

  public abstract update(deltaTime: number): void;
  public abstract render(ctx: CanvasRenderingContext2D): void;
  
  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public activate() {
    // Override in subclasses if needed
  }
}

export class Spike extends Obstacle {
  constructor(data: ObstacleData, tileSize: number) {
    super(data, tileSize);
    this.type = 'deadly';
    this.height = tileSize / 2; // Spikes are shorter
    this.y += tileSize / 2; // Position at bottom of tile
  }

  public update(deltaTime: number): void {
    this.animationTime += deltaTime;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) return;

    // Animated red spikes
    const pulse = Math.sin(this.animationTime * 4) * 0.1 + 0.9;
    
    ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
    
    // Draw spikes as triangular shapes
    const spikesCount = Math.floor(this.width / (this.tileSize / 4));
    const spikeWidth = this.width / spikesCount;
    
    ctx.beginPath();
    for (let i = 0; i < spikesCount; i++) {
      const spikeX = this.x + i * spikeWidth;
      ctx.moveTo(spikeX, this.y + this.height);
      ctx.lineTo(spikeX + spikeWidth / 2, this.y);
      ctx.lineTo(spikeX + spikeWidth, this.y + this.height);
    }
    ctx.closePath();
    ctx.fill();
    
    // Outline
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export class MovingPlatform extends Obstacle {
  private startX: number;
  private startY: number;
  private direction: 'horizontal' | 'vertical';
  private moveSpeed: number;
  private range: number;
  private currentDistance: number = 0;
  private movingForward: boolean = true;

  constructor(data: ObstacleData, tileSize: number) {
    super(data, tileSize);
    this.type = 'platform';
    this.startX = this.x;
    this.startY = this.y;
    this.direction = data.direction || 'horizontal';
    this.moveSpeed = data.moveSpeed || 60;
    this.range = (data.range || 4) * tileSize;
  }

  public update(deltaTime: number): void {
    if (!this.isActive) return;

    const movement = this.moveSpeed * deltaTime;
    
    if (this.movingForward) {
      this.currentDistance += movement;
      if (this.currentDistance >= this.range) {
        this.currentDistance = this.range;
        this.movingForward = false;
      }
    } else {
      this.currentDistance -= movement;
      if (this.currentDistance <= 0) {
        this.currentDistance = 0;
        this.movingForward = true;
      }
    }

    if (this.direction === 'horizontal') {
      this.x = this.startX + this.currentDistance;
    } else {
      this.y = this.startY + this.currentDistance;
    }

    this.animationTime += deltaTime;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) return;

    // Moving platform with distinct appearance
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#7c3aed');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Moving indicator
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Direction arrows
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    const arrow = this.direction === 'horizontal' ? (this.movingForward ? '→' : '←') : (this.movingForward ? '↓' : '↑');
    ctx.fillText(arrow, this.x + this.width / 2, this.y + this.height / 2 + 4);
  }
}

export class DisappearingPlatform extends Obstacle {
  private delay: number;
  private disappearTime: number = 0;
  private isVisible: boolean = true;
  private hasBeenStepped: boolean = false;

  constructor(data: ObstacleData, tileSize: number) {
    super(data, tileSize);
    this.type = 'platform';
    this.delay = data.delay || 1000;
  }

  public update(deltaTime: number): void {
    if (!this.isActive) return;

    if (this.hasBeenStepped) {
      this.disappearTime += deltaTime * 1000; // Convert to milliseconds
      
      if (this.disappearTime >= this.delay) {
        this.isVisible = false;
        this.isActive = false;
      }
    }

    this.animationTime += deltaTime;
  }

  public activate(): void {
    this.hasBeenStepped = true;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isVisible) return;

    // Platform that looks normal but will disappear
    let alpha = 1;
    if (this.hasBeenStepped) {
      alpha = Math.max(0, 1 - (this.disappearTime / this.delay));
    }

    ctx.globalAlpha = alpha;
    
    // Warning color when about to disappear
    const warningRed = this.hasBeenStepped ? Math.min(255, (this.disappearTime / this.delay) * 255) : 0;
    ctx.fillStyle = `rgb(${107 + warningRed}, ${115 - warningRed/2}, ${128 - warningRed/2})`;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    ctx.strokeStyle = this.hasBeenStepped ? '#ef4444' : '#9ca3af';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    ctx.globalAlpha = 1;
  }
}

export class Crusher extends Obstacle {
  private startY: number;
  private moveSpeed: number;
  private range: number;
  private currentDistance: number = 0;
  private movingDown: boolean = true;
  private crushDelay: number = 2000; // 2 second delay at top
  private currentDelay: number = 0;

  constructor(data: ObstacleData, tileSize: number) {
    super(data, tileSize);
    this.type = 'deadly';
    this.startY = this.y;
    this.moveSpeed = data.moveSpeed || 100;
    this.range = (data.range || 8) * tileSize;
  }

  public update(deltaTime: number): void {
    if (!this.isActive) return;

    if (this.movingDown) {
      const movement = this.moveSpeed * deltaTime;
      this.currentDistance += movement;
      
      if (this.currentDistance >= this.range) {
        this.currentDistance = this.range;
        this.movingDown = false;
        this.currentDelay = 0;
      }
    } else {
      this.currentDelay += deltaTime * 1000;
      
      if (this.currentDelay >= this.crushDelay) {
        const movement = this.moveSpeed * deltaTime * 2; // Move up faster
        this.currentDistance -= movement;
        
        if (this.currentDistance <= 0) {
          this.currentDistance = 0;
          this.movingDown = true;
        }
      }
    }

    this.y = this.startY + this.currentDistance;
    this.animationTime += deltaTime;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) return;

    // Heavy crushing block
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, '#374151');
    gradient.addColorStop(0.5, '#4b5563');
    gradient.addColorStop(1, '#1f2937');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Danger stripes
    ctx.fillStyle = '#fbbf24';
    const stripeWidth = 4;
    for (let i = 0; i < this.width; i += stripeWidth * 2) {
      ctx.fillRect(this.x + i, this.y, stripeWidth, this.height);
    }
    
    // Heavy outline
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Spikes on bottom
    if (this.movingDown) {
      ctx.fillStyle = '#dc2626';
      const spikesCount = Math.floor(this.width / 8);
      for (let i = 0; i < spikesCount; i++) {
        const spikeX = this.x + i * (this.width / spikesCount);
        const spikeWidth = this.width / spikesCount;
        
        ctx.beginPath();
        ctx.moveTo(spikeX, this.y + this.height);
        ctx.lineTo(spikeX + spikeWidth / 2, this.y + this.height + 6);
        ctx.lineTo(spikeX + spikeWidth, this.y + this.height);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

export class FakeWall extends Obstacle {
  constructor(data: ObstacleData, tileSize: number) {
    super(data, tileSize);
    this.type = 'platform'; // Looks like platform, but passable
  }

  public update(deltaTime: number): void {
    this.animationTime += deltaTime;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) return;

    // Looks exactly like a normal platform
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, '#9ca3af');
    gradient.addColorStop(1, '#4b5563');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Very subtle hint that it's fake (barely visible transparency)
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1;
  }
}

export class Teleporter extends Obstacle {
  private target: { x: number; y: number };

  constructor(data: ObstacleData, tileSize: number) {
    super(data, tileSize);
    this.type = 'checkpoint';
    this.target = {
      x: (data.target?.x || 0) * tileSize,
      y: (data.target?.y || 0) * tileSize
    };
  }

  public update(deltaTime: number): void {
    this.animationTime += deltaTime;
  }

  public activate(): void {
    // Teleportation logic would be handled by game engine
  }

  public getTarget() {
    return this.target;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) return;

    // Animated portal effect
    const pulse = Math.sin(this.animationTime * 6) * 0.3 + 0.7;
    const rotation = this.animationTime * 2;
    
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(rotation);
    
    // Outer ring
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2 * pulse);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
    gradient.addColorStop(0.7, 'rgba(124, 58, 237, 0.4)');
    gradient.addColorStop(1, 'rgba(55, 48, 163, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.width / 2 * pulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner core
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

export class Checkpoint extends Obstacle {
  private isActivated: boolean = false;

  constructor(data: ObstacleData, tileSize: number) {
    super(data, tileSize);
    this.type = 'checkpoint';
  }

  public update(deltaTime: number): void {
    this.animationTime += deltaTime;
  }

  public activate(): void {
    if (!this.isActivated) {
      this.isActivated = true;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) return;

    const color = this.isActivated ? '#10b981' : '#6b7280';
    const pulse = Math.sin(this.animationTime * 4) * 0.2 + 0.8;
    
    // Flag pole
    ctx.fillStyle = '#374151';
    ctx.fillRect(this.x + this.width / 2 - 2, this.y, 4, this.height);
    
    // Flag
    ctx.fillStyle = color;
    ctx.globalAlpha = pulse;
    ctx.fillRect(this.x + this.width / 2 + 2, this.y, this.width / 2 - 2, this.height / 2);
    ctx.globalAlpha = 1;
    
    // Glow effect when activated
    if (this.isActivated) {
      const gradient = ctx.createRadialGradient(
        this.x + this.width / 2, this.y + this.height / 2, 0,
        this.x + this.width / 2, this.y + this.height / 2, this.width
      );
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
    }
  }
}

export function createObstacle(data: ObstacleData, tileSize: number): Obstacle | null {
  switch (data.type) {
    case 'spike':
      return new Spike(data, tileSize);
    case 'movingPlatform':
      return new MovingPlatform(data, tileSize);
    case 'disappearing':
      return new DisappearingPlatform(data, tileSize);
    case 'crusher':
      return new Crusher(data, tileSize);
    case 'fakeWall':
      return new FakeWall(data, tileSize);
    case 'teleporter':
      return new Teleporter(data, tileSize);
    case 'checkpoint':
      return new Checkpoint(data, tileSize);
    default:
      return null;
  }
}