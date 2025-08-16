import { HistorialEntryEntity } from "../../../domain/entities/historial-entry.entity";

export interface HistorialOutput {
  statusCode: number;
  body: string;
  headers?: { [key: string]: string };
}

export interface GetHistorialOutput {
  message: string;
  data: HistorialEntryEntity[] | any[];
  pagination: {
    limit: number;
    total: number;
    count: number;
  };
  timestamp: string;
}