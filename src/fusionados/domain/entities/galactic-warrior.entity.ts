export interface GalacticWarrior {
  id: string;
  name: string;
  powerLevel: number;
  origin: "pokemon" | "starwars";

  // Características físicas combinadas
  height: number; // en metros
  weight: number; // en kg

  // Habilidades fusionadas
  abilities: string[];
  species: string;
}

export class GalacticWarriorEntity implements GalacticWarrior {
  constructor(
    public id: string,
    public name: string,
    public powerLevel: number,
    public origin: "pokemon" | "starwars",
    public height: number,
    public weight: number,
    public abilities: string[],
    public species: string
  ) {}

  static fromPokemonAndStarWars(pokemon: any, starWarsCharacter: any): GalacticWarriorEntity {
    // Crear un ID único combinando ambas fuentes
    const id = `${pokemon.id}-${starWarsCharacter.url.split("/").slice(-2, -1)[0]}`;

    // Fusionar nombres de manera creativa
    const fusedName = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} ${starWarsCharacter.name.split(" ")[0]}`;

    // Calcular poder basado en stats de Pokémon y características del personaje
    const pokemonPower = pokemon.stats?.reduce((total: number, stat: any) => total + stat.base_stat, 0) || 300;
    const characterMass = parseInt(starWarsCharacter.mass) || 75;
    const powerLevel = Math.floor((pokemonPower + characterMass) / 2);

    // Combinar alturas (Pokémon en decímetros, Star Wars en cm)
    const pokemonHeight = pokemon.height ? pokemon.height / 10 : 1.0; // convertir de decímetros a metros
    const characterHeight = parseInt(starWarsCharacter.height) / 100 || 1.7; // convertir de cm a metros
    const avgHeight = (pokemonHeight + characterHeight) / 2;

    // Combinar pesos
    const pokemonWeight = pokemon.weight ? pokemon.weight / 10 : 50; // convertir de hectogramos a kg
    const characterWeight = parseInt(starWarsCharacter.mass) || 75;
    const avgWeight = (pokemonWeight + characterWeight) / 2;

    // Combinar habilidades
    const pokemonAbilities = pokemon.abilities?.map((ability: any) => ability.ability.name) || [];
    const characterOrigin = starWarsCharacter.homeworld ? ["Force-sensitive"] : ["Galactic-warrior"];
    const abilities = [...pokemonAbilities, ...characterOrigin];

    // Determinar especie fusionada
    const pokemonSpecies = pokemon.species?.name || "unknown";
    const species = `${pokemonSpecies.charAt(0).toUpperCase() + pokemonSpecies.slice(1)}-Humanoid`;

    return new GalacticWarriorEntity(
      id,
      fusedName,
      powerLevel,
      "pokemon", // origen primario
      avgHeight,
      avgWeight,
      abilities,
      species
    );
  }

  static fromPokemonOnly(pokemon: any): GalacticWarriorEntity {
    const id = `pokemon-${pokemon.id}`;
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const powerLevel = pokemon.stats?.reduce((total: number, stat: any) => total + stat.base_stat, 0) || 300;
    const height = pokemon.height ? pokemon.height / 10 : 1.0;
    const weight = pokemon.weight ? pokemon.weight / 10 : 50;
    const abilities = pokemon.abilities?.map((ability: any) => ability.ability.name) || [];
    const species = pokemon.species?.name || "unknown";

    return new GalacticWarriorEntity(id, name, powerLevel, "pokemon", height, weight, abilities, species);
  }

  static fromStarWarsOnly(character: any): GalacticWarriorEntity {
    const id = `starwars-${character.url.split("/").slice(-2, -1)[0]}`;
    const name = character.name;
    const powerLevel = parseInt(character.mass) || 75;
    const height = parseInt(character.height) / 100 || 1.7;
    const weight = parseInt(character.mass) || 75;
    const abilities = ["Force-sensitive", "Galactic-warrior"];
    const species = "Humanoid";

    return new GalacticWarriorEntity(id, name, powerLevel, "starwars", height, weight, abilities, species);
  }
}
