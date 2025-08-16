import { Container } from "inversify";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { logger, tracer } from "../logs/logger";
import { TYPES } from "./types";

import { FusionadosHandler } from "../../../fusionados/application/queries/handlers/fusionados.handler";
import { PokemonRepository } from "../../../fusionados/domain/repositories/pokemon.repository";
import { StarWarsRepository } from "../../../fusionados/domain/repositories/startwars.repository";
import { GalacticWarriorRepository } from "../../../fusionados/domain/repositories/galactic-warrior.repository";
import { PokeApiPokemonRepository } from "../../../fusionados/infrastructure/repositories/PokeApiPokemonRepository";
import { SwapiStarWarsRepository } from "../../../fusionados/infrastructure/repositories/SwapiStarWarsRepository";
import { DynamoGalacticWarriorRepository } from "../../../fusionados/infrastructure/repositories/DynamoGalacticWarriorRepository";
import { InMemoryGalacticWarriorRepository } from "../../../fusionados/infrastructure/repositories/InMemoryGalacticWarriorRepository";

export const buildContainer = () => {
  const container = new Container();

  // shared infrastructure
  container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
  container.bind<Tracer>(TYPES.Tracer).toConstantValue(tracer);

  // Repositories
  container.bind<PokemonRepository>(TYPES.PokemonRepository).to(PokeApiPokemonRepository);
  container.bind<StarWarsRepository>(TYPES.StarWarsRepository).to(SwapiStarWarsRepository);
  
  // Usar repositorio en memoria para desarrollo local, DynamoDB para producción
  if (process.env["NODE_ENV"] === "dev" || process.env["IS_OFFLINE"]) {
    container.bind<GalacticWarriorRepository>(TYPES.GalacticWarriorRepository).to(InMemoryGalacticWarriorRepository).inSingletonScope();
  } else {
    container.bind<GalacticWarriorRepository>(TYPES.GalacticWarriorRepository).to(DynamoGalacticWarriorRepository);
  }

  // Query handler
  container.bind<FusionadosHandler>(TYPES.FusionadosHandler).to(FusionadosHandler);

  return container;
};
