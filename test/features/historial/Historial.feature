Feature: Historial
  Como usuario
  Quiero consultar el historial de guerreros galácticos
  Para ver todos los guerreros que se han creado

  Scenario Outline: Consultar historial de guerreros
    Given se solicita el historial <solicitud>
    And se obtienen los datos de la base de datos <datos>
    When se procesa la consulta
    Then se obtiene la respuesta <respuesta>

    Examples:
      | solicitud | datos     | respuesta     |
      | HISTORIAL | DATOS_OK  | RESPUESTA_OK  |
      | HISTORIAL | SIN_DATOS | RESPUESTA_VACIA |