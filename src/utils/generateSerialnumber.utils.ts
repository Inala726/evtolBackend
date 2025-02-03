let counter = 0;

export function generateSerialNumber(): string {
  counter++; 
  return `EVTOL-${counter.toString().padStart(4, "0")}`; 
}
