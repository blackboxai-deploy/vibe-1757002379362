import { InputState } from './gameEngine';

export class Player {
  public x: number;
  public y: number;
  public width: number = 24;
  public height: number = 32;
  
  private velocityX: number = 0;
  private velocityY: number = 0;
  private isGrounded: boolean = false;
  private isJumping: boolean = false;
  
  // Physics constants
  private readonly GRAVITY = 980; // pixels/second²
  private readonly JUMP_FORCE = 400;
  private readonly MOVE_SPEED = 200;
  private readonly FRICTION = 0.8;
  private readonly MAX_FALL_SPEED = 600;
  
  // Animation state
  private animationFrame: number = 0;
  private animationTime: number = 0;
  private facingDirection: number = 1; // 1 = right, -1 = left
  private state: 'idle' | 'walking' | 'jumping' | 'falling' = 'idle';

  constructor(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
  }

  public update(deltaTime: number, input: InputState) {
    this.handleInput(input, deltaTime);
    this.updatePhysics(deltaTime);
    this.updateAnimation(deltaTime);
    this.updateState();
  }

  private handleInput(input: InputState, deltaTime: number) {
    // Horizontal movement
    if (input.left && !input.right) {
      this.velocityX = Math.max(this.velocityX - this.MOVE_SPEED * deltaTime * 8, -this.MOVE_SPEED);
      this.facingDirection = -1;
    } else if (input.right && !input.left) {
      this.velocityX = Math.min(this.velocityX + this.MOVE_SPEED * deltaTime * 8, this.MOVE_SPEED);
      this.facingDirection = 1;
    } else {
      // Apply friction when no input
      this.velocityX *= this.FRICTION;
      if (Math.abs(this.velocityX) < 1) {
        this.velocityX = 0;
      }
    }

    // Jumping
    if (input.jump && this.isGrounded && !this.isJumping) {
      this.velocityY = -this.JUMP_FORCE;
      this.isGrounded = false;
      this.isJumping = true;
    }

    // Stop jumping when key released (variable jump height)
    if (!input.jump && this.velocityY < 0) {
      this.velocityY *= 0.5;
    }

    // Reset jump flag when key released
    if (!input.jump) {
      this.isJumping = false;
    }
  }

  private updatePhysics(deltaTime: number) {
    // Apply gravity
    if (!this.isGrounded) {
      this.velocityY += this.GRAVITY * deltaTime;
      
      // Cap falling speed
      if (this.velocityY > this.MAX_FALL_SPEED) {
        this.velocityY = this.MAX_FALL_SPEED;
      }
    }

    // Update position
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
  }

  private updateAnimation(deltaTime: number) {
    this.animationTime += deltaTime;
    
    const frameRate = this.state === 'walking' ? 0.1 : 0.2;
    
    if (this.animationTime >= frameRate) {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTime = 0;
    }
  }

  private updateState() {
    if (!this.isGrounded) {
      this.state = this.velocityY < 0 ? 'jumping' : 'falling';
    } else if (Math.abs(this.velocityX) > 10) {
      this.state = 'walking';
    } else {
      this.state = 'idle';
    }
  }

  public handlePlatformCollision(platform: { x: number; y: number; width: number; height: number }) {
    const bounds = this.getBounds();
    const overlap = this.getOverlap(bounds, platform);
    
    // Determine collision side based on overlap
    if (overlap.width < overlap.height) {
      // Horizontal collision (sides)
      if (bounds.x + bounds.width / 2 < platform.x + platform.width / 2) {
        // Hit from left
        this.x = platform.x - this.width;
      } else {
        // Hit from right
        this.x = platform.x + platform.width;
      }
      this.velocityX = 0;
    } else {
      // Vertical collision (top/bottom)
      if (bounds.y + bounds.height / 2 < platform.y + platform.height / 2) {
        // Hit from top (player lands on platform)
        this.y = platform.y - this.height;
        this.velocityY = 0;
        this.isGrounded = true;
      } else {
        // Hit from bottom (player hits ceiling)
        this.y = platform.y + platform.height;
        this.velocityY = 0;
      }
    }
  }

  private getOverlap(rect1: any, rect2: any) {
    return {
      width: Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x),
      height: Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y)
    };
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isGrounded = false;
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Flip sprite if facing left
    if (this.facingDirection === -1) {
      ctx.scale(-1, 1);
      ctx.translate(-(this.x + this.width), 0);
    } else {
      ctx.translate(this.x, this.y);
    }

    // Player body (simple colored rectangle with animation)
    const colors = {
      idle: '#3b82f6',
      walking: '#2563eb',
      jumping: '#1d4ed8',
      falling: '#1e40af'
    };

    // Body
    ctx.fillStyle = colors[this.state];
    ctx.fillRect(this.facingDirection === -1 ? 0 : 0, 0, this.width, this.height);
    
    // Outline
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.facingDirection === -1 ? 0 : 0, 0, this.width, this.height);
    
    // Simple animation effects
    if (this.state === 'walking') {
      // Walking animation - simple bounce
      const bounce = Math.sin(this.animationTime * 20) * 2;
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(this.facingDirection === -1 ? 4 : 4, 4 + bounce, this.width - 8, 4);
    }
    
    if (this.state === 'jumping' || this.state === 'falling') {
      // Air state indicator
      ctx.fillStyle = this.state === 'jumping' ? '#34d399' : '#f87171';
      ctx.fillRect(this.facingDirection === -1 ? 8 : 8, 8, 8, 8);
    }
    
    // Eyes (simple dots)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.facingDirection === -1 ? 6 : 6, 8, 4, 4);
    ctx.fillRect(this.facingDirection === -1 ? 14 : 14, 8, 4, 4);
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.facingDirection === -1 ? 7 : 7, 9, 2, 2);
    ctx.fillRect(this.facingDirection === -1 ? 15 : 15, 9, 2, 2);
    
    ctx.restore();
  }
}