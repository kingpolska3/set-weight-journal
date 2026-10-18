export type EquipmentType = 'smith_barbell' | 'dumbbells' | 'cable_stack';

export function roundToGymEquipment(weight: number, equipment: EquipmentType): number {
  if (weight <= 0) return 0;

  switch (equipment) {
    case 'smith_barbell':
      return Math.round(weight / 2.5) * 2.5;

    case 'dumbbells':
      if (weight <= 10) {
        return Math.round(weight);
      } else {
        const rounded = Math.round(weight / 2.5) * 2.5;
        return Math.max(12.5, rounded);
      }

    case 'cable_stack':
      return Math.round(weight / 3.75) * 3.75;

    default:
      return Math.round(weight / 2.5) * 2.5;
  }
}

export function detectEquipmentType(exerciseName: string): EquipmentType {
  const name = exerciseName.toLowerCase();
  
  // 1. Najpierw sprawdzamy Smitha i sztangę (zanim wykryje ogólne słowo "maszyna")
  if (name.includes('smith') || name.includes('sztang')) {
    return 'smith_barbell';
  }
  
  // 2. Hantle
  if (name.includes('hantel') || name.includes('hantle') || name.includes('hantli')) {
    return 'dumbbells';
  }
  
  // 3. Pozostałe wyciągi i maszyny ze stosem
  if (name.includes('wyciąg') || name.includes('brama') || name.includes('bram') || name.includes('butterfly') || name.includes('maszyna')) {
    return 'cable_stack';
  }
  
  return 'smith_barbell';
}
