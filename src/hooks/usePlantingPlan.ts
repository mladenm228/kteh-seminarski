import { useEffect, useState } from 'react';
import { storageService } from '../models/LocalStorageService';
import type { IPlantingPlanItem } from '../models/PlantingPlanItem';

const PLANTING_PLAN_KEY = 'rasadnik_planting_plan';

export function usePlantingPlan() {
  const [items, setItems] = useState<IPlantingPlanItem[]>(() =>
    storageService.getItem<IPlantingPlanItem[]>(PLANTING_PLAN_KEY, []),
  );

  useEffect(() => {
    storageService.setItem(PLANTING_PLAN_KEY, items);
  }, [items]);

  const addToPlan = (plantId: string, targetDate: string, note: string) => {
    setItems((current) => [
      ...current.filter((item) => item.plantId !== plantId),
      { plantId, targetDate, note },
    ]);
  };

  const removeFromPlan = (plantId: string) => {
    setItems((current) => current.filter((item) => item.plantId !== plantId));
  };

  const isInPlan = (plantId: string) => items.some((item) => item.plantId === plantId);

  return { items, addToPlan, removeFromPlan, isInPlan };
}
