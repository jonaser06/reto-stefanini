/**
 * historial entry interface
 * representa una entrada del historial de respuestas de fusionados
 */
export interface HistorialEntry {
  id: string; // id unico
  warriorId: string; // id del guerrero
  warriorName: string; // nombre del guerrero
  warriorData: any; // datos completos del guerrero
  createdAt: string; // fecha de creacion
  endpoint: string; // endpoint que lo creo
  requestData?: any; // datos de la request original
}

/**
 * historial entry entity
 * entidad de dominio para las entradas del historial
 */
export class HistorialEntryEntity implements HistorialEntry {
  constructor(
    public id: string,
    public warriorId: string,
    public warriorName: string,
    public warriorData: any,
    public createdAt: string,
    public endpoint: string,
    public requestData?: any
  ) {}

  /**
   * crear entrada de historial desde un guerrero
   */
  static fromWarrior(
    warrior: any,
    endpoint: string = "/fusionados",
    requestData?: any
  ): HistorialEntryEntity {
    const id = `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return new HistorialEntryEntity(
      id,
      warrior.id,
      warrior.name,
      warrior,
      new Date().toISOString(),
      endpoint,
      requestData
    );
  }

  /**
   * validar entrada del historial
   */
  validate(): boolean {
    return !!(
      this.id &&
      this.warriorId &&
      this.warriorName &&
      this.warriorData &&
      this.createdAt &&
      this.endpoint
    );
  }

  /**
   * obtener datos resumidos
   */
  getSummary(): any {
    return {
      id: this.id,
      warriorId: this.warriorId,
      warriorName: this.warriorName,
      createdAt: this.createdAt,
      endpoint: this.endpoint,
      powerLevel: this.warriorData.powerLevel || 0,
      origin: this.warriorData.origin || 'unknown'
    };
  }
}