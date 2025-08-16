export interface AlmacenarInput {
  body: string;
  headers?: { [key: string]: string };
  queryStringParameters?: { [key: string]: string };
  pathParameters?: { [key: string]: string };
}

export interface CreateCustomWarriorInput {
  name: string;
  powerLevel: number;
  height: number;
  weight: number;
  abilities: string[];
  species: string;
  description?: string;
  createdBy?: string;
}

export interface UpdateCustomWarriorInput {
  name?: string;
  powerLevel?: number;
  height?: number;
  weight?: number;
  abilities?: string[];
  species?: string;
  description?: string;
}