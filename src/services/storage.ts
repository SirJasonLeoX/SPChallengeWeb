import type { GameState } from '@/models/GameState';
import type { TaskConfig } from '@/models/TaskConfig';

export class GameStorage {
  private static readonly GAME_STATE_KEY = 'gameState';
  private static readonly TASK_CONFIG_KEY = 'taskConfig';
  private static readonly LAST_CONFIG_KEY = 'lastTaskConfig';

  static saveGame(state: GameState, config: TaskConfig[]): void {
    try {
      localStorage.setItem(this.GAME_STATE_KEY, JSON.stringify(state));
      localStorage.setItem(this.TASK_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('保存游戏失败:', error);
      // 实现降级策略
    }
  }

  static loadGame(): { state: GameState | null; config: TaskConfig[] | null } {
    try {
      const stateJson = localStorage.getItem(this.GAME_STATE_KEY);
      const configJson = localStorage.getItem(this.TASK_CONFIG_KEY);

      return {
        state: stateJson ? JSON.parse(stateJson) : null,
        config: configJson ? JSON.parse(configJson) : null
      };
    } catch (error) {
      console.error('加载游戏失败:', error);
      return { state: null, config: null };
    }
  }

  static saveLastConfig(config: TaskConfig[]): void {
    try {
      localStorage.setItem(this.LAST_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('保存配置失败:', error);
    }
  }

  static loadLastConfig(): TaskConfig[] | null {
    try {
      const configJson = localStorage.getItem(this.LAST_CONFIG_KEY);
      return configJson ? JSON.parse(configJson) : null;
    } catch (error) {
      console.error('加载配置失败:', error);
      return null;
    }
  }

  static clear(): void {
    localStorage.removeItem(this.GAME_STATE_KEY);
    localStorage.removeItem(this.TASK_CONFIG_KEY);
  }

  static hasSavedGame(): boolean {
    return !!localStorage.getItem(this.GAME_STATE_KEY);
  }
}