export interface StarWarsRepository {
  getCharacterById(id: number): Promise<any>;
  getRandomCharacter(): Promise<any>;
}

