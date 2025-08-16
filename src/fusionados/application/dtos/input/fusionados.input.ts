import { APIGatewayProxyEvent } from "aws-lambda";

export interface FusionadosInput extends APIGatewayProxyEvent {
  queryStringParameters: {
    count?: string;
    starWarsId?: string;
    pokemonId?: string;
  } | null;
}

