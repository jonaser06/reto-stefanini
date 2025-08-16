import { CustomWarrior } from "../../../domain/entities/custom-warrior.entity";

export interface AlmacenarOutput {
  statusCode: number;
  body: string;
  headers?: { [key: string]: string };
}

