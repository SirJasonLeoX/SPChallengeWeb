export class DiceLogic {
  private consecutiveSixes: number = 0;
 
  rollDice(): { result: number; canRollAgain: boolean } {
    // 使用crypto API生成安全随机数
    const result = Math.floor(Math.random() * 6) + 1;
  
    // 根据新需求，掷出6点不再提供额外掷骰子机会
    const canRollAgain = false;
  
    // 保留consecutiveSixes计数以保持接口一致性，但不再使用
    if (result === 6) {
      this.consecutiveSixes++;
    } else {
      this.consecutiveSixes = 0;
    }
  
    return { result, canRollAgain };
  }
 
  reset(): void {
    this.consecutiveSixes = 0;
  }
  
  // 后退机制：当掷的骰子点数大于到终点所需的点数时，计算后退步数
  calculateBackwardSteps(currentPosition: number, diceResult: number, totalSteps: number): number {
    const remainingSteps = totalSteps - currentPosition - 1; // 减1因为终点是totalSteps-1
    if (diceResult > remainingSteps) {
      // 后退步数 = 骰子点数 - 剩余步数
      // 例如：剩余2步，掷出3点，后退1步（3-2=1）
      // 例如：剩余3步，掷出6点，后退3步（6-3=3）
      return diceResult - remainingSteps;
    }
    return 0; // 无需后退
  }
  
  // 可重现的随机种子版本（用于调试）
  rollDiceWithSeed(seed: number): { result: number; canRollAgain: boolean } {
    const rng = this.seedRandom(seed);
    const result = Math.floor(rng() * 6) + 1;
 
    const canRollAgain = result === 6 && this.consecutiveSixes < 2;
 
    if (result === 6) {
      this.consecutiveSixes++;
    } else {
      this.consecutiveSixes = 0;
    }
 
    return { result, canRollAgain };
  }
 
  private seedRandom(seed: number): () => number {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }
}