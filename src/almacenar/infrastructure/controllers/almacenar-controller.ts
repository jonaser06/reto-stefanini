import "reflect-metadata";
import middy from "@middy/core";
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { logger, tracer } from "../../../shared/infrastructure/logs/logger";
import {
  AlmacenarInput,
  CreateCustomWarriorInput,
} from "../../application/dtos/input/almacenar.input";
import { AlmacenarOutput } from "../../application/dtos/output/almacenar.output";
import { buildContainer } from "../../../shared/infrastructure/ioc/container";
import { AlmacenarHandler } from "../../application/commands/handlers/almacenar.handler";
import { TYPES } from "../../../shared/infrastructure/ioc/types";
import { CreateCustomWarriorCommand } from "../../application/commands/create-custom-warrior.command";

export const handler = middy(
  async (event: AlmacenarInput): Promise<AlmacenarOutput> => {
    try {
      const container = buildContainer();
      const almacenarHandler = container.get<AlmacenarHandler>(
        TYPES.AlmacenarHandler
      );

      logger.info("Processing almacenar POST request");

      const requestData: CreateCustomWarriorInput = JSON.parse(event.body);
      const command = new CreateCustomWarriorCommand(requestData);
      const customWarrior = await almacenarHandler.execute(command);

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "Custom Warrior Created Successfully",
          data: customWarrior,
          timestamp: new Date().toISOString(),
        }),
      };
    } catch (error) {
      logger.error("Error in almacenar handler", { error });
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal Server Error",
          error: error instanceof Error ? error.message : "Unknown error",
        }),
      };
    }
  }
)
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));

