import { APIGatewayProxyEvent } from "aws-lambda";

export interface HistorialInput extends APIGatewayProxyEvent {
  queryStringParameters: {
    limit?: string; // limite de elementos por pagina
  } | null;
}