import { HistorialEntryEntity } from "../entities/historial-entry.entity";

/**
 * historial repository interface
 * define las operaciones disponibles para el historial
 */
export interface HistorialRepository {
  /**
   * guardar entrada del historial
   */
  save(entry: HistorialEntryEntity): Promise<HistorialEntryEntity>;

  /**
   * obtener historial ordenado cronologicamente ascendente
   */
  findAll(limit: number): Promise<HistorialEntryEntity[]>;

  /**
   * obtener entrada por id
   */
  findById(id: string): Promise<HistorialEntryEntity | null>;

  /**
   * contar total de entradas
   */
  count(): Promise<number>;
}
