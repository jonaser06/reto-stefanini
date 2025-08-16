import "reflect-metadata";
import middy from "@middy/core";
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { logger, tracer } from "../../../shared/infrastructure/logs/logger";
import { FusionadosInput } from "../../application/dtos/input/fusionados.input";
import { FusionadosOutput } from "../../application/dtos/output/fusionados.output";
import { buildContainer } from "../../../shared/infrastructure/ioc/container";
import { GetFusionadosQuery } from "../../application/queries/get-fusionados.query";
import { FusionadosHandler } from "../../application/queries/handlers/fusionados.handler";
import { TYPES } from "../../../shared/infrastructure/ioc/types";

export const handler = middy(async (_event: FusionadosInput): Promise<FusionadosOutput> => {
  try {
    const container = buildContainer();
    const fusionadosHandler = container.get<FusionadosHandler>(TYPES.FusionadosHandler);
    const query = new GetFusionadosQuery();

    const galacticWarriors = await fusionadosHandler.execute(query);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Galactic Warriors Fusion Successful",
        data: galacticWarriors,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    logger.error("Error in fusionados handler", { error });
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
})
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));
