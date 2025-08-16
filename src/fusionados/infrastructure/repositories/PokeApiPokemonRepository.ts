import { injectable, inject } from "inversify";
import axios from "axios";

import { PokemonRepository } from "../../domain/repositories/pokemon.repository";

import { TYPES } from "../../../shared/infrastructure/ioc/types";
import { Logger } from "@aws-lambda-powertools/logger";

@injectable()
export class PokeApiPokemonRepository implements PokemonRepository {
  private readonly baseUrl = "https://pokeapi.co/api/v2";

  constructor(@inject(TYPES.Logger) private logger: Logger) {}

  async getPokemonById(id: number): Promise<any> {
    try {
      this.logger.info("Fetching Pokemon by ID", { id });
      const response = await axios.get(`${this.baseUrl}/pokemon/${id}/`);
      return response.data;
    } catch (error) {
      this.logger.error("Error fetching Pokemon", { id, error });
      throw new Error(`Failed to fetch Pokemon with ID ${id}`);
    }
  }

  async getRandomPokemon(): Promise<any> {
    const randomId = Math.floor(Math.random() * 1010) + 1;
    return this.getPokemonById(randomId);
  }
}

