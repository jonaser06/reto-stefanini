/**
 * custom warrior interface
 * representa un guerrero creado por el usuario con atributos personalizados
 */
export interface CustomWarrior {
  id: string;
  name: string;
  powerLevel: number;
  origin: "custom";
  height: number; // en metros
  weight: number; // en kg
  abilities: string[];
  species: string;
  description?: string;
  createdBy?: string;
}

/**
 * custom warrior entity
 * entidad de dominio para guerreros creados por el usuario
 */
export class CustomWarriorEntity implements CustomWarrior {
  constructor(
    public id: string,
    public name: string,
    public powerLevel: number,
    public origin: "custom",
    public height: number,
    public weight: number,
    public abilities: string[],
    public species: string,
    public description: string = "",
    public createdBy: string = ""
  ) {}

  static create(
    data: Omit<CustomWarrior, "id" | "origin">
  ): CustomWarriorEntity {
    const id = `custom-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return new CustomWarriorEntity(
      id,
      data.name,
      data.powerLevel,
      "custom",
      data.height,
      data.weight,
      data.abilities,
      data.species,
      data.description || "",
      data.createdBy || ""
    );
  }

  validate(): boolean {
    return !!(
      this.name &&
      this.powerLevel > 0 &&
      this.height > 0 &&
      this.weight > 0 &&
      this.abilities.length > 0 &&
      this.species
    );
  }
}

