import { ReactP5Wrapper, P5CanvasInstance } from "@p5-wrapper/react";
import p5Types from "p5";

function sketch(p5: P5CanvasInstance) {
  let baseLayer: p5Types.Graphics;
  let scratchLayer: p5Types.Graphics;
  const particles: ScratchParticle[] = [];
  let cursorImg: p5Types.Image;
  const brushSize = 10;

  class ScratchParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    alpha: number;
    points: { x: number; y: number }[];

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.vx = p5.random(-1, 1);
      this.vy = p5.random(-0.5, 0);
      this.size = p5.random(2, 4);
      this.rotation = p5.random(p5.TWO_PI);
      this.rotationSpeed = p5.random(-0.05, 0.05);
      this.alpha = p5.random(180, 255);
      this.points = [];

      // Create irregular flake shape
      const numPoints = p5.floor(p5.random(5, 8));
      for (let i = 0; i < numPoints; i++) {
        const angle = (p5.TWO_PI * i) / numPoints;
        const radius = this.size * p5.random(0.7, 1);
        this.points.push({
          x: p5.cos(angle) * radius,
          y: p5.sin(angle) * radius,
        });
      }
    }

    update(): boolean {
      this.x += this.vx;
      this.vy += 0.15; // Heavier gravity for more realistic fall
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      // Slow down horizontal movement
      this.vx *= 0.98;

      // Fade out slower
      this.alpha -= 2;

      return this.alpha > 0;
    }

    draw(): void {
      p5.push();
      p5.translate(this.x, this.y);
      p5.rotate(this.rotation);

      // Draw irregular flake
      p5.noStroke();
      p5.fill(40, 40, 40, this.alpha); // Dark gray, almost black
      p5.beginShape();
      for (const point of this.points) {
        p5.vertex(point.x, point.y);
      }
      p5.endShape(p5.CLOSE);
      p5.pop();
    }
  }

  p5.preload = () => {
    cursorImg = p5.loadImage("/stylus.png");
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);

    baseLayer = p5.createGraphics(p5.windowWidth, p5.windowHeight);
    scratchLayer = p5.createGraphics(p5.windowWidth, p5.windowHeight);

    drawRainbowGradient();

    scratchLayer.background(0);
    //   drawHeart();

    p5.noCursor();
  };

  function drawRainbowGradient(): void {
    // Create horizontal rainbow gradient
    baseLayer.noFill();
    for (let x = 0; x < p5.width; x++) {
      const inter = p5.map(x, 0, p5.width, 0, 1);
      let gradientColor: p5Types.Color;

      // Create rainbow effect similar to HTML version
      if (inter < 0.2) {
        gradientColor = p5.lerpColor(
          p5.color(255, 0, 0),
          p5.color(255, 165, 0),
          p5.map(inter, 0, 0.2, 0, 1)
        ); // red to orange
      } else if (inter < 0.4) {
        gradientColor = p5.lerpColor(
          p5.color(255, 165, 0),
          p5.color(255, 255, 0),
          p5.map(inter, 0.2, 0.4, 0, 1)
        ); // orange to yellow
      } else if (inter < 0.6) {
        gradientColor = p5.lerpColor(
          p5.color(255, 255, 0),
          p5.color(0, 128, 0),
          p5.map(inter, 0.4, 0.6, 0, 1)
        ); // yellow to green
      } else if (inter < 0.8) {
        gradientColor = p5.lerpColor(
          p5.color(0, 128, 0),
          p5.color(0, 0, 255),
          p5.map(inter, 0.6, 0.8, 0, 1)
        ); // green to blue
      } else {
        gradientColor = p5.lerpColor(
          p5.color(0, 0, 255),
          p5.color(75, 0, 130),
          p5.map(inter, 0.8, 1, 0, 1)
        ); // blue to indigo
      }

      baseLayer.stroke(gradientColor);
      baseLayer.line(x, 0, x, p5.height);
    }
  }

  //   function drawHeart(): void {
  //     scratchLayer.push();
  //     scratchLayer.translate(p5.width / 2, p5.height / 2);
  //     scratchLayer.scale(2);
  //     scratchLayer.stroke("#FFD700");
  //     scratchLayer.strokeWeight(3);
  //     scratchLayer.noFill();

  //     scratchLayer.arc(-50, -50, 100, 100, p5.PI, 0);
  //     scratchLayer.arc(50, -50, 100, 100, p5.PI, 0);
  //     scratchLayer.line(-100, -50, 0, 75);
  //     scratchLayer.line(100, -50, 0, 75);

  //     scratchLayer.pop();
  //   }

  function drawCustomCursor(): void {
    p5.push();
    p5.translate(p5.mouseX, p5.mouseY);

    // Rotate cursor when scratching (mouseIsPressed)
    if (p5.mouseIsPressed) {
      p5.rotate(-p5.PI / 4); // -45 degrees like in HTML
    }

    // Draw the cursor image
    // @ts-expect-error p5.imageMode is not properly defined in p5Types
    p5.imageMode(p5.LEFT);
    p5.image(cursorImg, 0, 0, 200, 100); // Adjust size as needed

    p5.pop();
  }

  p5.draw = () => {
    // Draw base and scratch layers
    p5.image(baseLayer, 0, 0);
    p5.image(scratchLayer, 0, 0);

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].update()) {
        particles.splice(i, 1);
        continue;
      }
      particles[i].draw();
    }

    drawCustomCursor();
  };

  function createParticles(x: number, y: number): void {
    const numParticles = p5.floor(p5.random(4, 8));
    for (let i = 0; i < numParticles; i++) {
      particles.push(
        new ScratchParticle(x + p5.random(-5, 5), y + p5.random(-5, 5))
      );
    }
  }

  p5.mouseDragged = () => {
    // Create particles
    createParticles(p5.mouseX, p5.mouseY);

    // Erase scratch layer
    scratchLayer.erase();
    scratchLayer.circle(p5.mouseX, p5.mouseY, brushSize * 2);
    scratchLayer.noErase();
    return false;
  };

  p5.touchMoved = () => {
    if (p5.touches && p5.touches.length > 0) {
      // @ts-expect-error p5.touches[0] is not properly defined in p5Types
      createParticles(p5.touches[0].x, p5.touches[0].y);

      scratchLayer.erase();
      // @ts-expect-error p5.touches[0] is not properly defined in p5Types
      scratchLayer.circle(p5.touches[0].x, p5.touches[0].y, brushSize * 2);
      scratchLayer.noErase();
    }
    return false;
  };
}

function App() {
  return <ReactP5Wrapper sketch={sketch} />;
}

export default App;
