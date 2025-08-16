import { CreateCustomWarriorInput } from "../dtos/input/almacenar.input";

export class CreateCustomWarriorCommand {
  constructor(public readonly data: CreateCustomWarriorInput) {}
}
