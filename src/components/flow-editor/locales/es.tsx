const LOCALES = {
  TOOLBOX_ADD_STATE_LABEL: "Agregar estado",
  NEW_STATE_NAME_LABEL: "Estado",
  NEW_TRANSITION_NAME_LABEL: "Transición",

  // STATE EDITOR'S
  STATE_EDITOR_SAVE_BUTTON_LABEL: "Actualizar Paso",
  STATE_EDITOR_CANCEL_BUTTON_LABEL: "Cancelar",
  STATE_EDITOR_DRAWER_TITLE: "Edición de Estado",
  STATE_EDITOR_POPCONFIRM_TITLE: "¿Estás seguro de cancelar?",
  STATE_EDITOR_POPCONFIRM_YES: "Sí",
  STATE_EDITOR_POPCONFIRM_NO: "No",

  STATE_EDITOR_FORM_NAME_REQUIRED_MESSAGE: "Es necesario un nombre para el estado",
  STATE_EDITOR_FORM_NAME_LABEL: "Nombre",
  STATE_EDITOR_FORM_NAME_TOOLTIP: "El nombre del estado identifica el paso en el proceso y debería ser un nombre identificativo del estado al cual pertenece esta parte del proceso",

  STATE_EDITOR_FORM_DESCRIPTION_LABEL: "Descripción",
  STATE_EDITOR_FORM_DESCRIPTION_PLACEHOLDER: "Escribe algo que identifique al estado",

  STATE_EDITOR_FORM_ACTORS_LABEL: 'Actores',
  STATE_EDITOR_FORM_ACTORS_PLACEHOLDER: "Ingresa un termino de búsqueda para comenzar",
  STATE_EDITOR_FORM_ACTORS_REQUIRED_MESSAGE: "Debe haber al menos un actor asociado a este estado",
  STATE_EDITOR_FORM_ACTORS_TOOLTIP: "Indica los actores que deberan recibir la notificación cuando el proceso llegue a este estado",

  STATE_EDITOR_FORM_START_LABEL: "Paso inicial",

  STATE_EDITOR_FORM_END_LABEL: "Paso final",

  // TRANSITION EDITOR'S
  TRANSITION_EDITOR_SAVE_BUTTON_LABEL: "Actualizar Transición",
  TRANSITION_EDITOR_CANCEL_BUTTON_LABEL: "Cancelar",
  TRANSITION_EDITOR_DRAWER_TITLE: "Edición de Transición",
  TRANSITION_EDITOR_POPCONFIRM_TITLE: "¿Estás seguro de cancelar?",
  TRANSITION_EDITOR_POPCONFIRM_YES: "Sí",
  TRANSITION_EDITOR_POPCONFIRM_NO: "No",

  TRANSITION_EDITOR_FORM_NAME_REQUIRED_MESSAGE: "Es necesario un nombre para la transición",
  TRANSITION_EDITOR_FORM_NAME_LABEL: "Acción",
  TRANSITION_EDITOR_FORM_NAME_TOOLTIP: "El nombre de la transicción es la acción que se ejecutará para continuar al siguiente estado",

  TRANSITION_EDITOR_FORM_DESCRIPTION_LABEL: "Descripción",
  TRANSITION_EDITOR_FORM_DESCRIPTION_PLACEHOLDER: "Escribe algo que identifique la transición",

  TRANSITION_EDITOR_FORM_INTERACTIONS_LABEL: "Interacciones",

  // INTERACTION EDITOR'S
  INTERACTION_AVAILABLES_TITLE: "Interacciones disponibles",
  INTERACTION_AVAILABLES_SUBTITLE: "Elige una interacción para configurarla",

  INTERACTION_WEBHOOK_TITLE: "Webhook",
  INTERACTION_WEBHOOK_DESCRIPTION: "Add Webhook interaction description",

  INTERACTION_EMAIL_TITLE: "E-mail",
  INTERACTION_EMAIL_DESCRIPTION: "Add e-mail interaction description",



  // WEBHOOK EDITOR'S
  WEBHOOK_EDITOR_FORM_NAME_LABEL: "Nombre",
  WEBHOOK_EDITOR_FORM_NAME_TOOLTIP: "Nombre reconocible de la interacción",
  WEBHOOK_EDITOR_FORM_NAME_REQUIRED_MESSAGE: "El nombre es requerido",

  WEBHOOK_EDITOR_FORM_DESCRIPTION_LABEL: "Descripción",
  WEBHOOK_EDITOR_FORM_DESCRIPTION_PLACEHOLDER: "Ingresa una descripción del webhook",

  WEBHOOK_EDITOR_FORM_DISABLED_LABEL: "Deshabilitar Interacción",

  WEBHOOK_EDITOR_FORM_URL_LABEL: "Url de la dirección",
  WEBHOOK_EDITOR_FORM_URL_TOOLTIP: "Dirección web hacia donde se ejecuta el llamado de la API",
  WEBHOOK_EDITOR_FORM_URL_REQUIRED_MESSAGE: "La url es requerida",

  WEBHOOK_EDITOR_FORM_METHOD_LABEL: "Verbo de ejecución",
  WEBHOOK_EDITOR_FORM_METHOD_TOOLTIP: "Verbo con el cual se ejecutará la llamada a la API",
  WEBHOOK_EDITOR_FORM_METHOD_REQUIRED_MESSAGE: "El verbo es requerido",

  WEBHOOK_EDITOR_FORM_STATUS_CODE_LABEL: "Códigos http de exito",
  WEBHOOK_EDITOR_FORM_STATUS_CODE_TOOLTIP: "Códigos de http que se entenderán como una llamada a la API exitosa",
  WEBHOOK_EDITOR_FORM_STATUS_CODE_REQUIRED_MESSAGE: "Debe definir al menos un código http",

  WEBHOOK_EDITOR_FORM_TIMEOUT_TO_WAIT_LABEL: "Tiempo de respuesta máximo",
  WEBHOOK_EDITOR_FORM_TIMEOUT_TO_WAIT_TOOLTIP: "Define el tiempo máximo a esperar antes de indicar un fallo en la llamada a la API",
  WEBHOOK_EDITOR_FORM_METRIC_LABEL: "Segundo(s)",

  WEBHOOK_EDITOR_FORM_SAVE_LABEL: "Guardar",
  WEBHOOK_EDITOR_FORM_CANCEL_LABEL: "Cancelar"
};
export default LOCALES;
