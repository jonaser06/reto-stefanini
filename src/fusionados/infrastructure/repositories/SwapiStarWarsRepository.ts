import { injectable, inject } from "inversify";
import axios from "axios";
import { StarWarsRepository } from "../../domain/repositories/startwars.repository";
import { TYPES } from "../../../shared/infrastructure/ioc/types";
import { Logger } from "@aws-lambda-powertools/logger";

@injectable()
export class SwapiStarWarsRepository implements StarWarsRepository {
  private readonly baseUrl = "https://swapi.py4e.com/api";

  constructor(@inject(TYPES.Logger) private logger: Logger) {}

  async getCharacterById(id: number): Promise<any> {
    try {
      this.logger.info("Fetching Star Wars character by ID", { id });
      const response = await axios.get(`${this.baseUrl}/people/${id}/`);
      return response.data;
    } catch (error) {
      this.logger.error("Error fetching Star Wars character", { id, error });
      throw new Error(`Failed to fetch Star Wars character with ID ${id}`);
    }
  }

  async getRandomCharacter(): Promise<any> {
    const randomId = Math.floor(Math.random() * 83) + 1;
    return this.getCharacterById(randomId);
  }
}
