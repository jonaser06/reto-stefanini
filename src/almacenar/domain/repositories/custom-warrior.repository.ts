import { CustomWarriorEntity } from "../entities/custom-warrior.entity";

export interface CustomWarriorRepository {
  save(warrior: CustomWarriorEntity): Promise<CustomWarriorEntity>;
}
