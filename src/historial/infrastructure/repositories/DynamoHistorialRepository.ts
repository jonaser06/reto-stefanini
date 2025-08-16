import "reflect-metadata";
import { injectable, inject } from "inversify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { HistorialEntryEntity } from "../../domain/entities/historial-entry.entity";
import { HistorialRepository } from "../../domain/repositories/historial.repository";
import { TYPES } from "../../../shared/infrastructure/ioc/types";
import { Logger } from "@aws-lambda-powertools/logger";

@injectable()
export class DynamoHistorialRepository implements HistorialRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(@inject(TYPES.Logger) private logger: Logger) {
    const clientConfig: any = {
      region: process.env.AWS_REGION || "us-east-1",
    };

    const dynamoClient = new DynamoDBClient(clientConfig);
    this.client = DynamoDBDocumentClient.from(dynamoClient);
    this.tableName =
      process.env.GALACTIC_WARRIORS_TABLE || "galactic-warriors-dev";
  }

  async findAll(limit: number = 20): Promise<HistorialEntryEntity[]> {
    try {
      this.logger.info("obteniendo historial cronologico", { limit });

      const result = await this.client.send(
        new ScanCommand({
          TableName: this.tableName,
        })
      );

      if (!result.Items || result.Items.length === 0) {
        this.logger.info("no se encontraron entradas del historial");
        return [];
      }

      // filtrar solo items que tienen las propiedades de galactic warriors
      const galacticWarriorItems = result.Items.filter(
        (item) => item.name && item.powerLevel && item.origin && !item.type
      );

      // ordenar por fecha de creacion ascendente
      const sortedItems = galacticWarriorItems.sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt)
      );

      // aplicar limite
      const limitedItems = sortedItems.slice(0, limit);

      const items = limitedItems.map(
        (item) =>
          new HistorialEntryEntity(
            item.id,
            item.id, // warriorId es el mismo id
            item.name, // warriorName
            {
              name: item.name,
              powerLevel: item.powerLevel,
              origin: item.origin,
              height: item.height,
              weight: item.weight,
              abilities: item.abilities,
              species: item.species,
              description: item.description,
              createdBy: item.createdBy,
            }, // warriorData
            item.createdAt,
            "/fusionados", // endpoint
            null // requestData
          )
      );

      this.logger.info("historial obtenido exitosamente", {
        total: galacticWarriorItems.length,
        returned: items.length,
      });

      return items;
    } catch (error) {
      this.logger.error("error obteniendo historial", { error });
      throw new Error(`failed to get historial: ${error}`);
    }
  }

  async count(): Promise<number> {
    try {
      this.logger.info("contando entradas del historial");

      const allResult = await this.client.send(
        new ScanCommand({
          TableName: this.tableName,
        })
      );

      const galacticWarriorCount =
        allResult.Items?.filter(
          (item) => item.name && item.powerLevel && item.origin && !item.type
        ).length || 0;

      this.logger.info("conteo del historial completado", {
        count: galacticWarriorCount,
      });

      return galacticWarriorCount;
    } catch (error) {
      this.logger.error("error contando entradas del historial", { error });
      throw new Error(`failed to count historial entries: ${error}`);
    }
  }
}

