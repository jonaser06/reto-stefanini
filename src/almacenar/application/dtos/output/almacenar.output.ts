import { CustomWarrior } from "../../../domain/entities/custom-warrior.entity";

export interface AlmacenarOutput {
  statusCode: number;
  body: string;
  headers?: { [key: string]: string };
}

export interface CreateCustomWarriorOutput {
  message: string;
  data: CustomWarrior;
  timestamp: string;
}

export interface GetCustomWarriorsOutput {
  message: string;
  data: CustomWarrior[];
  count: number;
  timestamp: string;
}

export interface UpdateCustomWarriorOutput {
  message: string;
  data: CustomWarrior;
  timestamp: string;
}

export interface DeleteCustomWarriorOutput {
  message: string;
  deletedId: string;
  timestamp: string;
}