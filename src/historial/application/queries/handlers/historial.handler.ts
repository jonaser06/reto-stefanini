import "reflect-metadata";
import { inject, injectable } from "inversify";
import { GetHistorialQuery } from "../get-historial.query";
import { TYPES } from "../../../../shared/infrastructure/ioc/types";
import { Logger } from "@aws-lambda-powertools/logger";
import { HistorialRepository } from "../../../domain/repositories/historial.repository";
import { HistorialEntryEntity } from "../../../domain/entities/historial-entry.entity";

@injectable()
export class HistorialHandler {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.HistorialRepository)
    private readonly historialRepository: HistorialRepository
  ) {}

  async execute(query: GetHistorialQuery): Promise<{
    items: HistorialEntryEntity[];
    pagination: {
      limit: number;
      total: number;
      count: number;
    };
  }> {
    try {
      this.logger.info("obteniendo historial cronologico", {
        limit: query.limit,
      });

      // obtener historial cronologico
      const items = await this.historialRepository.findAll(query.limit);

      this.logger.info("historial obtenido exitosamente", {
        count: items.length,
      });
      // obtener total
      const total = await this.historialRepository.count();

      return {
        items,
        pagination: {
          limit: query.limit,
          total,
          count: items.length,
        },
      };
    } catch (error) {
      this.logger.error("error obteniendo historial", { error, query });
      throw new Error("failed to get historial");
    }
  }
}

