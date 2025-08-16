import { GalacticWarrior } from "../entities/galactic-warrior.entity";

export interface GalacticWarriorRepository {
  save(warrior: GalacticWarrior): Promise<GalacticWarrior>;
  findById(id: string): Promise<GalacticWarrior | null>;
  findAll(): Promise<GalacticWarrior[]>;
  delete(id: string): Promise<void>;
}