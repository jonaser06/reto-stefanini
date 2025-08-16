import { CreateCustomWarriorInput } from "../dtos/input/almacenar.input";

export class CreateCustomWarriorCommand {
  constructor(public readonly data: CreateCustomWarriorInput) {}
}

export class GetCustomWarriorsCommand {
  constructor(public readonly createdBy?: string) {}
}

export class GetCustomWarriorByIdCommand {
  constructor(public readonly id: string) {}
}

export class UpdateCustomWarriorCommand {
  constructor(
    public readonly id: string,
    public readonly data: Partial<CreateCustomWarriorInput>
  ) {}
}

export class DeleteCustomWarriorCommand {
  constructor(public readonly id: string) {}
}