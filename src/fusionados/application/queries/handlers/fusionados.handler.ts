import "reflect-metadata";
import { inject, injectable } from "inversify";
import { GetFusionadosQuery } from "../get-fusionados.query";
import { TYPES } from "../../../../shared/infrastructure/ioc/types";
import { Logger } from "@aws-lambda-powertools/logger";
import { PokemonRepository } from "../../../domain/repositories/pokemon.repository";
import { StarWarsRepository } from "../../../domain/repositories/startwars.repository";
import { GalacticWarriorRepository } from "../../../domain/repositories/galactic-warrior.repository";
import { GalacticWarriorEntity } from "../../../domain/entities/galactic-warrior.entity";

@injectable()
export class FusionadosHandler {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.PokemonRepository) private readonly pokemonRepository: PokemonRepository,
    @inject(TYPES.StarWarsRepository) private readonly starWarsRepository: StarWarsRepository,
    @inject(TYPES.GalacticWarriorRepository) private readonly galacticWarriorRepository: GalacticWarriorRepository
  ) {}

  async execute(query: GetFusionadosQuery): Promise<GalacticWarriorEntity[]> {
    try {
      this.logger.info("Starting fusion process", { query });

      // Obtener datos de ambas APIs
      const pokemonPromise = this.pokemonRepository.getRandomPokemon();
      const starWarsPromise = this.starWarsRepository.getRandomCharacter();

      const [pokemon, starWarsCharacter] = await Promise.all([pokemonPromise, starWarsPromise]);

      this.logger.info("Data fetched successfully", {
        pokemon: pokemon.name,
        starWarsCharacter: starWarsCharacter.name,
      });

      // Crear el guerrero galáctico fusionado
      const galacticWarrior = GalacticWarriorEntity.fromPokemonAndStarWars(pokemon, starWarsCharacter);

      this.logger.info("Galactic warrior created", {
        id: galacticWarrior.id,
        name: galacticWarrior.name,
        powerLevel: galacticWarrior.powerLevel,
      });

      // Guardar en DynamoDB
      const savedWarrior = await this.galacticWarriorRepository.save(galacticWarrior);

      this.logger.info("Galactic warrior saved to database", {
        id: savedWarrior.id,
        name: savedWarrior.name,
      });

      return [savedWarrior];
    } catch (error) {
      this.logger.error("Error in fusion process", { error, query });
      throw new Error("Failed to create galactic warrior fusion");
    }
  }
}
