/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import Papa from "papaparse";

export function csvToArray(csvData: string) {
  const result = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true, // Otomatis konversi tipe data
  });

  return result.data;
}

export function arrayToCsv(data: any[]) {
  return Papa.unparse(data);
}
