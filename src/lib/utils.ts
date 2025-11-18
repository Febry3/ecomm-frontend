import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstLetter(str: string) {
  const temp = str.split(" ");
  let result = "";
  temp.forEach((word) => {
    result += word.charAt(0).toUpperCase();
  });
  return result;
}
