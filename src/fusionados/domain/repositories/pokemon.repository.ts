export interface PokemonRepository {
  getPokemonById(id: number): Promise<any>;
  getRandomPokemon(): Promise<any>;
}

