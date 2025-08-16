Feature: Fusionados
  Como usuario
  Quiero crear guerreros galácticos fusionados
  Para obtener personajes únicos de Pokemon y Star Wars

  Scenario Outline: Crear guerrero galáctico fusionado
    Given se solicita crear un guerrero galáctico <solicitud>
    And se obtienen los datos de las APIs <apis>
    When se procesa la fusión
    Then se obtiene la respuesta <respuesta>

    Examples:
      | solicitud | apis        | respuesta     |
      | FUSION    | APIS_OK     | RESPUESTA_OK  |
      | FUSION    | POKEMON_ERROR | ERROR_POKEMON |
      | FUSION    | STARWARS_ERROR | ERROR_STARWARS |