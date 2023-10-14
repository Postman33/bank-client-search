export enum LoadCategory {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  AVERAGE = "AVERAGE",
  LOW = "LOW",
}

export function determineLoadCategory(load: number): LoadCategory {
  if (load < 0 || load > 100) {
    throw new Error("Степень загрузки должна быть в диапазоне от 0 до 100");
  }

  if (load >= 90) {
    return LoadCategory.CRITICAL;
  } else if (load >= 70) {
    return LoadCategory.HIGH;
  } else if (load >= 50) {
    return LoadCategory.AVERAGE;
  } else {
    return LoadCategory.LOW;
  }
}



export function determineWhenToGO(load: number): string {
  if (load < 0 || load > 100) {
    throw new Error("Степень загрузки должна быть в диапазоне от 0 до 100");
  }

  if (load >= 90) {
    return 'приходите через 2 часа';
  } else if (load >= 70) {
    return 'приходите через 1 час';
  } else if (load >= 50) {
    return 'приходите через 25 мин';
  } else {
    return 'можно приходить';
  }
}
