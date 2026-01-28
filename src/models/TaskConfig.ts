export interface TaskConfig {
  name: string;           // 任务名称
  min_count: number;      // 最小数量
  max_count: number;      // 最大数量
}

export const DEFAULT_TASKS: TaskConfig[] = [
  {
    name: "巴掌",
    min_count: 10,
    max_count: 50
  },
  {
    name: "戒尺",
    min_count: 10,
    max_count: 50
  },
  {
    name: "皮带",
    min_count: 10,
    max_count: 50
  },
  {
    name: "藤条",
    min_count: 10,
    max_count: 30
  },
  {
    name: "发刷",
    min_count: 10,
    max_count: 30
  },
  {
    name: "小红",
    min_count: 10,
    max_count: 30
  }
];