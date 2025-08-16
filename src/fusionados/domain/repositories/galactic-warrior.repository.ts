import { GalacticWarriorEntity } from "../entities/galactic-warrior.entity";

export interface GalacticWarriorRepository {
  save(warrior: GalacticWarriorEntity): Promise<GalacticWarriorEntity>;
}

