import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../shared/infrastructure/ioc/types";
import { Logger } from "@aws-lambda-powertools/logger";
import { CustomWarriorRepository } from "../../../domain/repositories/custom-warrior.repository";
import { CustomWarriorEntity } from "../../../domain/entities/custom-warrior.entity";
import { CreateCustomWarriorCommand } from "../create-custom-warrior.command";

@injectable()
export class AlmacenarHandler {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.CustomWarriorRepository)
    private readonly customWarriorRepository: CustomWarriorRepository
  ) {}

  async execute(
    command: CreateCustomWarriorCommand
  ): Promise<CustomWarriorEntity> {
    try {
      this.logger.info("Creating custom warrior", { command: command.data });

      // Create new custom warrior entity
      const customWarrior = CustomWarriorEntity.create(command.data);

      // Validate the warrior
      if (!customWarrior.validate()) {
        throw new Error("Invalid custom warrior data");
      }

      this.logger.info("Custom warrior created", {
        id: customWarrior.id,
        name: customWarrior.name,
        powerLevel: customWarrior.powerLevel,
      });

      // Save to database
      const savedWarrior = await this.customWarriorRepository.save(
        customWarrior
      );

      this.logger.info("Custom warrior saved to database", {
        id: savedWarrior.id,
        name: savedWarrior.name,
      });

      return savedWarrior;
    } catch (error) {
      this.logger.error("Error creating custom warrior", { error, command });
      throw new Error(`Failed to create custom warrior: ${error}`);
    }
  }
}

