Feature: Almacenar
  Como usuario
  Quiero almacenar guerreros galácticos personalizados
  Para crear mis propios personajes únicos

  Scenario Outline: Almacenar guerrero galáctico personalizado
    Given se solicita almacenar un guerrero personalizado <solicitud>
    And se procesan los datos <datos>
    When se almacena el guerrero
    Then se obtiene la respuesta <respuesta>

    Examples:
      | solicitud | datos        | respuesta     |
      | POST_WARRIOR | DATOS_OK     | RESPUESTA_OK  |
      | POST_WARRIOR | DATOS_INVALIDOS | ERROR_VALIDACION |