import "reflect-metadata";
import { injectable, inject } from "inversify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { CustomWarriorEntity } from "../../domain/entities/custom-warrior.entity";
import { CustomWarriorRepository } from "../../domain/repositories/custom-warrior.repository";
import { TYPES } from "../../../shared/infrastructure/ioc/types";
import { Logger } from "@aws-lambda-powertools/logger";

@injectable()
export class DynamoCustomWarriorRepository implements CustomWarriorRepository {
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

  async save(warrior: CustomWarriorEntity): Promise<CustomWarriorEntity> {
    try {
      this.logger.info("Saving custom warrior to DynamoDB", {
        id: warrior.id,
        name: warrior.name,
      });

      const item = {
        id: warrior.id,
        name: warrior.name,
        powerLevel: warrior.powerLevel,
        origin: warrior.origin,
        height: warrior.height,
        weight: warrior.weight,
        abilities: warrior.abilities,
        species: warrior.species,
        description: warrior.description,
        createdBy: warrior.createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: item,
        })
      );

      this.logger.info("Custom warrior saved successfully", { id: warrior.id });
      return warrior;
    } catch (error) {
      this.logger.error("Error saving custom warrior", {
        error,
        warriorId: warrior.id,
      });
      throw new Error(`Failed to save custom warrior: ${error}`);
    }
  }
}

