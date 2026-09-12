import type { IPlantingPlanItem } from './PlantingPlanItem';


export class PlantingPlanner {
  private readonly items: IPlantingPlanItem[];

  constructor(items: IPlantingPlanItem[] = []) {
    this.items = items;
  }

  getItems(): IPlantingPlanItem[] {
    return this.items;
  }

  sortByDate(): IPlantingPlanItem[] {
    return [...this.items].sort(
      (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime(),
    );
  }

  upcoming(referenceDate: Date = new Date()): IPlantingPlanItem[] {
    return this.sortByDate().filter((item) => new Date(item.targetDate) >= referenceDate);
  }

  overdue(referenceDate: Date = new Date()): IPlantingPlanItem[] {
    return this.sortByDate().filter((item) => new Date(item.targetDate) < referenceDate);
  }

  count(): number {
    return this.items.length;
  }
}
