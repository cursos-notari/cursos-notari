export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = 
    time.split(":")
    .map(Number) // isso converte os dois itens da array em Number;

  const combined = new Date(date);

  combined.setHours(hours, minutes, 0, 0);

  return combined;
}