// Lógica de fusión extraída para poder probar con coverage
exports.fusionLogic = (pokemonData, starwarsData) => {
  if (!pokemonData || !starwarsData) {
    throw new Error("Failed to create galactic warrior fusion");
  }

  const id = `${pokemonData.id}-${
    starwarsData.url.split("/").slice(-2, -1)[0]
  }`;
  const fusedName = `${
    pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
  } ${starwarsData.name.split(" ")[0]}`;
  const powerLevel = Math.floor(
    ((pokemonData.stats?.[0]?.base_stat || 35) +
      parseInt(starwarsData.mass || "77")) /
      2
  );
  const height =
    (pokemonData.height / 10 + parseInt(starwarsData.height) / 100) / 2;
  const weight = (pokemonData.weight / 10 + parseInt(starwarsData.mass)) / 2;
  const abilities = [
    ...(pokemonData.abilities?.map((a) => a.ability.name) || []),
    "Force-sensitive",
  ];
  const species = `${pokemonData.species?.name || "Unknown"}-Humanoid`;

  return {
    id,
    name: fusedName,
    powerLevel,
    origin: "pokemon",
    height: Math.round(height * 100) / 100,
    weight: Math.round(weight * 10) / 10,
    abilities,
    species: species.charAt(0).toUpperCase() + species.slice(1),
    description: "no description",
    createdBy: "no creator",
  };
};

exports.validateWarriorData = (data) => {
  if (!data.name || data.name.trim() === "") {
    throw new Error("Name is required");
  }
  if (data.powerLevel < 0) {
    throw new Error("Power level must be positive");
  }
  if (!["pokemon", "starwars", "custom"].includes(data.origin)) {
    throw new Error("Invalid origin");
  }
  return true;
};

exports.formatHistorialEntry = (warrior) => {
  return {
    id: warrior.id,
    warriorId: warrior.id,
    warriorName: warrior.name,
    warriorData: {
      name: warrior.name,
      powerLevel: warrior.powerLevel,
      origin: warrior.origin,
      height: warrior.height,
      weight: warrior.weight,
      abilities: warrior.abilities,
      species: warrior.species,
      description: warrior.description,
      createdBy: warrior.createdBy,
    },
    createdAt: new Date().toISOString(),
    endpoint: "/fusionados",
    requestData: null,
  };
};

