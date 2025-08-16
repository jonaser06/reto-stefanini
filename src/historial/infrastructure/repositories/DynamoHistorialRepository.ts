import "reflect-metadata";
import { injectable, inject } from "inversify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
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

  async save(entry: HistorialEntryEntity): Promise<HistorialEntryEntity> {
    try {
      this.logger.info("guardando entrada del historial en DynamoDB", {
        id: entry.id,
        warriorId: entry.warriorId,
        warriorName: entry.warriorName,
      });

      const item = {
        id: entry.id,
        warriorId: entry.warriorId,
        warriorName: entry.warriorName,
        warriorData: entry.warriorData,
        createdAt: entry.createdAt,
        endpoint: entry.endpoint,
        requestData: entry.requestData,
        type: "historial", // para filtrar en scans
        updatedAt: new Date().toISOString(),
      };

      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: item,
        })
      );

      this.logger.info("entrada del historial guardada exitosamente", {
        id: entry.id,
      });

      return entry;
    } catch (error) {
      this.logger.error("error guardando entrada del historial", {
        error,
        entryId: entry.id,
      });
      throw new Error(`failed to save historial entry: ${error}`);
    }
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

  async findById(id: string): Promise<HistorialEntryEntity | null> {
    try {
      this.logger.info("buscando entrada del historial por ID", { id });

      const result = await this.client.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { id },
        })
      );

      if (!result.Item || result.Item.type !== "historial") {
        this.logger.info("entrada del historial no encontrada", { id });
        return null;
      }

      const item = result.Item;
      return new HistorialEntryEntity(
        item.id,
        item.warriorId,
        item.warriorName,
        item.warriorData,
        item.createdAt,
        item.endpoint,
        item.requestData
      );
    } catch (error) {
      this.logger.error("error buscando entrada del historial", { error, id });
      throw new Error(`failed to find historial entry: ${error}`);
    }
  }

  async count(): Promise<number> {
    try {
      this.logger.info("contando entradas del historial");

      const result = await this.client.send(
        new ScanCommand({
          TableName: this.tableName,
          Select: "COUNT",
        })
      );

      // necesitamos contar solo galactic warriors (sin el campo type)
      const allResult = await this.client.send(
        new ScanCommand({
          TableName: this.tableName,
        })
      );

      const galacticWarriorCount = allResult.Items?.filter(
        (item) => item.name && item.powerLevel && item.origin && !item.type
      ).length || 0;

      this.logger.info("conteo del historial completado", { count: galacticWarriorCount });

      return galacticWarriorCount;
    } catch (error) {
      this.logger.error("error contando entradas del historial", { error });
      throw new Error(`failed to count historial entries: ${error}`);
    }
  }
}