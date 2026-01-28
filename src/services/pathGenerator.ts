import type { PathTask } from '../models/PathTask';

interface PathConfig {
  rows: number;
  cols: number;
  cellSize: number;
  spacing: number;
}

interface PathResult {
  coordinates: Array<{ x: number; y: number }>;
  connections: Array<[number, number]>;
}

export class PathGenerator {
  private config: PathConfig;

  constructor(config: PathConfig = { rows: 6, cols: 10, cellSize: 60, spacing: 15 }) {
    this.config = config;
  }

  generatePath(): PathResult {
    const coordinates: Array<{ x: number; y: number }> = [];
    const connections: Array<[number, number]> = [];

    // 生成坐标（之字形布局）
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        // 之字形布局：偶数行从左到右，奇数行从右到左
        const actualCol = row % 2 === 0 ? col : this.config.cols - 1 - col;
        const x = actualCol * (this.config.cellSize + this.config.spacing);
        const y = row * (this.config.cellSize + this.config.spacing);
        coordinates.push({ x, y });
      }
    }

    // 生成连接关系
    for (let i = 0; i < coordinates.length - 1; i++) {
      connections.push([i, i + 1]);
    }

    return { coordinates, connections };
  }

  render(canvas: HTMLCanvasElement, currentPosition: number, pathTasks: PathTask[]): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pathResult = this.generatePath();
    const { coordinates, connections } = pathResult;

    // 绘制路径连接线
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 3;
    ctx.beginPath();

    connections.forEach(([from, to]) => {
      const fromCoord = coordinates[from];
      const toCoord = coordinates[to];
      ctx.moveTo(fromCoord.x + this.config.cellSize / 2, fromCoord.y + this.config.cellSize / 2);
      ctx.lineTo(toCoord.x + this.config.cellSize / 2, toCoord.y + this.config.cellSize / 2);
    });

    ctx.stroke();

    // 绘制格子
    coordinates.forEach((coord, index) => {
      // 基础格子
      ctx.fillStyle = index === currentPosition ? '#3b82f6' : '#ffffff';
      ctx.strokeStyle = index === currentPosition ? '#1d4ed8' : '#e5e7eb';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(
        coord.x,
        coord.y,
        this.config.cellSize,
        this.config.cellSize,
        8
      );
      ctx.fill();
      ctx.stroke();

      // 格子内容：显示任务名称和数量（格式：任务名称×数量）
      ctx.fillStyle = index === currentPosition ? '#ffffff' : '#374151';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 显示任务信息（格式：任务名称×数量）
      if (pathTasks && pathTasks[index]) {
        // 特殊处理：起点和终点
        if (index === 0) {
          // 起点格子
          const startText = "起点";
          ctx.fillStyle = index === currentPosition ? '#ffffff' : '#10b981';
          ctx.font = '16px Arial';
          ctx.fillText(
            startText,
            coord.x + this.config.cellSize / 2,
            coord.y + this.config.cellSize / 2
          );
        } else if (index === pathTasks.length - 1) {
          // 终点格子
          const endText = "完成";
          ctx.fillStyle = index === currentPosition ? '#ffffff' : '#ef4444';
          ctx.font = '16px Arial';
          ctx.fillText(
            endText,
            coord.x + this.config.cellSize / 2,
            coord.y + this.config.cellSize / 2
          );
        } else {
          // 普通格子：显示任务信息
          const task = pathTasks[index];
          const taskText = `${task.name}×${task.count}`;
          
          // 根据格子大小调整字体，更大的单元格允许更大的字体
          const maxTextWidth = this.config.cellSize - 15;
          let fontSize = 14;
          ctx.font = `${fontSize}px Arial`;
          
          // 如果文本太长，缩小字体
          while (ctx.measureText(taskText).width > maxTextWidth && fontSize > 10) {
            fontSize--;
            ctx.font = `${fontSize}px Arial`;
          }
          
          // 显示任务信息
          ctx.fillText(
            taskText,
            coord.x + this.config.cellSize / 2,
            coord.y + this.config.cellSize / 2
          );
        }
      }
    });

    // 绘制当前位置指示器
    if (currentPosition >= 0 && currentPosition < coordinates.length) {
      const currentCoord = coordinates[currentPosition];
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(
        currentCoord.x + this.config.cellSize / 2,
        currentCoord.y + this.config.cellSize / 2,
        this.config.cellSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // 添加脉冲动画效果
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        currentCoord.x + this.config.cellSize / 2,
        currentCoord.y + this.config.cellSize / 2,
        this.config.cellSize / 2 + 5,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
  }

  getPathLength(): number {
    return this.config.rows * this.config.cols;
  }
}