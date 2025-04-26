let counter = 0;

export function generateSerialNumber(): string {
  counter++; 
  return `EVTOL-${counter.toString().padStart(4, "0")}`; 
}

export const generateOTP = ():string =>{
  return Math.floor(100000 + Math.random() *900000).toString() 
}