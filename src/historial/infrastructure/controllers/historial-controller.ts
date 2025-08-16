import "reflect-metadata";
import middy from "@middy/core";
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import { logger, tracer } from "../../../shared/infrastructure/logs/logger";
import { HistorialInput } from "../../application/dtos/input/historial.input";
import { HistorialOutput } from "../../application/dtos/output/historial.output";
import { buildContainer } from "../../../shared/infrastructure/ioc/container";
import { GetHistorialQuery } from "../../application/queries/get-historial.query";
import { HistorialHandler } from "../../application/queries/handlers/historial.handler";
import { TYPES } from "../../../shared/infrastructure/ioc/types";

export const handler = middy(
  async (event: HistorialInput): Promise<HistorialOutput> => {
    try {
      const container = buildContainer();
      const historialHandler = container.get<HistorialHandler>(
        TYPES.HistorialHandler
      );

      logger.info("procesando request de historial GET");

      // extraer parametros de query
      const queryParams = event.queryStringParameters || {};
      const limit = parseInt(queryParams.limit || "20");

      // validar limite
      const validatedLimit = Math.min(Math.max(limit, 1), 100); // entre 1 y 100

      const query = new GetHistorialQuery(validatedLimit);
      const result = await historialHandler.execute(query);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "historial obtenido exitosamente",
          data: result.items,
          pagination: result.pagination,
          timestamp: new Date().toISOString(),
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    } catch (error) {
      logger.error("error en historial handler", { error });
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "internal server error",
          error: error instanceof Error ? error.message : "unknown error",
          timestamp: new Date().toISOString(),
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  }
)
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));