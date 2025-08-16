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
import { CustomWarriorRepository } from "../../../almacenar/domain/repositories/custom-warrior.repository";
import { DynamoCustomWarriorRepository } from "../../../almacenar/infrastructure/repositories/DynamoCustomWarriorRepository";
import { AlmacenarHandler } from "../../../almacenar/application/commands/handlers/almacenar.handler";
import { HistorialHandler } from "../../../historial/application/queries/handlers/historial.handler";
import { HistorialRepository } from "../../../historial/domain/repositories/historial.repository";
import { DynamoHistorialRepository } from "../../../historial/infrastructure/repositories/DynamoHistorialRepository";

export const buildContainer = () => {
  const container = new Container();

  // shared infrastructure
  container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
  container.bind<Tracer>(TYPES.Tracer).toConstantValue(tracer);

  // repositorios
  container
    .bind<PokemonRepository>(TYPES.PokemonRepository)
    .to(PokeApiPokemonRepository);
  container
    .bind<StarWarsRepository>(TYPES.StarWarsRepository)
    .to(SwapiStarWarsRepository);

  container
    .bind<GalacticWarriorRepository>(TYPES.GalacticWarriorRepository)
    .to(DynamoGalacticWarriorRepository);

  container
    .bind<CustomWarriorRepository>(TYPES.CustomWarriorRepository)
    .to(DynamoCustomWarriorRepository);

  container
    .bind<HistorialRepository>(TYPES.HistorialRepository)
    .to(DynamoHistorialRepository);

  // query handler
  container
    .bind<FusionadosHandler>(TYPES.FusionadosHandler)
    .to(FusionadosHandler);

  container.bind<HistorialHandler>(TYPES.HistorialHandler).to(HistorialHandler);

  // command handler
  container.bind<AlmacenarHandler>(TYPES.AlmacenarHandler).to(AlmacenarHandler);

  return container;
};

