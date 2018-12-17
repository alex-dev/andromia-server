export interface CronInterface {
  name: string;
  expression: string;
  run(): Promise<void>;
}