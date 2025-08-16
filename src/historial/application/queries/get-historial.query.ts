/**
 * get historial query
 * query para obtener el historial cronologicamente
 */
export class GetHistorialQuery {
  constructor(public readonly limit: number = 20) {}
}