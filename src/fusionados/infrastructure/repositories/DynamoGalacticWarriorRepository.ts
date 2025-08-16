import "reflect-metadata";
import { injectable, inject } from "inversify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { GalacticWarrior } from "../../domain/entities/galactic-warrior.entity";
import { GalacticWarriorRepository } from "../../domain/repositories/galactic-warrior.repository";
import { TYPES } from "../../../shared/infrastructure/ioc/types";
import { Logger } from "@aws-lambda-powertools/logger";

@injectable()
export class DynamoGalacticWarriorRepository implements GalacticWarriorRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(@inject(TYPES.Logger) private logger: Logger) {
    const clientConfig: any = {
      region: process.env["AWS_REGION"],
    };

    const dynamoClient = new DynamoDBClient(clientConfig);
    this.client = DynamoDBDocumentClient.from(dynamoClient);
    this.tableName = process.env["GALACTIC_WARRIORS_TABLE"];
  }

  async save(warrior: GalacticWarrior): Promise<GalacticWarrior> {
    try {
      this.logger.info("Saving galactic warrior to DynamoDB", {
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: item,
        })
      );

      this.logger.info("Galactic warrior saved successfully", { id: warrior.id });
      return warrior;
    } catch (error) {
      this.logger.error("Error saving galactic warrior", {
        error,
        warriorId: warrior.id,
      });
      throw new Error(`Failed to save galactic warrior: ${error}`);
    }
  }

  async findById(id: string): Promise<GalacticWarrior | null> {
    try {
      this.logger.info("Finding galactic warrior by ID", { id });

      const result = await this.client.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { id },
        })
      );

      if (!result.Item) {
        this.logger.info("Galactic warrior not found", { id });
        return null;
      }

      const item = result.Item;
      return {
        id: item["id"],
        name: item["name"],
        powerLevel: item["powerLevel"],
        origin: item["origin"],
        height: item["height"],
        weight: item["weight"],
        abilities: item["abilities"],
        species: item["species"],
      };
    } catch (error) {
      this.logger.error("Error finding galactic warrior", { error, id });
      throw new Error(`Failed to find galactic warrior: ${error}`);
    }
  }

  async findAll(): Promise<GalacticWarrior[]> {
    try {
      this.logger.info("Finding all galactic warriors");

      const result = await this.client.send(
        new ScanCommand({
          TableName: this.tableName,
        })
      );

      if (!result.Items || result.Items.length === 0) {
        this.logger.info("No galactic warriors found");
        return [];
      }

      return result.Items.map((item) => ({
        id: item["id"],
        name: item["name"],
        powerLevel: item["powerLevel"],
        origin: item["origin"],
        height: item["height"],
        weight: item["weight"],
        abilities: item["abilities"],
        species: item["species"],
      }));
    } catch (error) {
      this.logger.error("Error finding all galactic warriors", { error });
      throw new Error(`Failed to find galactic warriors: ${error}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.logger.info("Deleting galactic warrior", { id });

      await this.client.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { id },
        })
      );

      this.logger.info("Galactic warrior deleted successfully", { id });
    } catch (error) {
      this.logger.error("Error deleting galactic warrior", { error, id });
      throw new Error(`Failed to delete galactic warrior: ${error}`);
    }
  }
}
