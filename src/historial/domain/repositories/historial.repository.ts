import { HistorialEntryEntity } from "../entities/historial-entry.entity";

/**
 * historial repository interface
 * define las operaciones disponibles para el historial
 */
export interface HistorialRepository {
  findAll(limit: number): Promise<HistorialEntryEntity[]>;
  count(): Promise<number>;
}

