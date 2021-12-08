export interface Entity<Type extends { id: string | number }> {
  byId: Record<Type['id'], Type>
  allIds: Type['id'][]
}

type Location = {
  name: string
  place: string
  region: string
  gps_latitude: number
  gps_longitude: number
}

type EventType = {
  name: string
  slug: string
}

export type Event = {
  id: number
  name: string
  date_from: Date
  date_to: Date
  program:
    | ''
    | 'education'
    | 'PsB'
    | 'monuments'
    | 'nature'
    | 'eco_consulting'
    | 'children_section'
    | 'international' // @TODO this is not allowed in API
  // @TODO there was a typo here (was indended_for)
  intended_for:
    | 'everyone'
    | 'adolescents_and_adults'
    | 'children'
    | 'parents_and_children'
    | 'newcomers'
  basic_purpose: 'action' | 'action-with-attendee-list' | 'camp'
  location: Location
  age_from: number
  age_to: number
  start_date: Date
  event_type: EventType
  responsible_person: string
  participation_fee: string
  entry_form_url: string
  web_url: string
  invitation_text_short: string
  working_hours: number
  working_days: number // @TODO needs to be added to API
  accommodation: string
  diet:
    | 'vegetarian'
    | 'non_vegetarian'
    | 'vegan'
    | 'kosher'
    | 'halal'
    | 'gluten_free'
  looking_forward_to_you: string
  registration_method:
    | 'standard'
    | 'other_electronic'
    | 'by_email'
    | 'not_required'
    | 'full'
  administrative_unit_name: string
  administrative_unit_web_url: string
  note: string // @TODO needs to be added to API
  invitation_text_1: string
  invitation_text_2: string
  invitation_text_3: string
  invitation_text_4: string
  main_photo: string
  additional_photo_1: string
  additional_photo_2: string
  additional_photo_3: string
  additional_photo_4: string
  additional_photo_5: string
  additional_photo_6: string
  additional_question_1: string
  additional_question_2: string
  additional_question_3: string
  additional_question_4: string
  contact_person_name: string
  contact_person_email: string
  contact_person_telephone: string
  public_on_web_date_from: Date
  public_on_web_date_to: Date
}

/**
 * 
 * 
 * {
  swagger: "2.0",
  info: {
    title: "Snippets API",
    version: "v1"
  },
  host: "brontosaurus.klub-pratel.cz",
  schemes: [
    "http"
  ],
  basePath: "/",
  consumes: [
    "application/json"
  ],
  produces: [
    "application/json"
  ],
  securityDefinitions: {
    Basic: {
      type: "basic"
    }
  },
  security: [
    {
      Basic: []
    }
  ],
  paths: {
    /api/bronto/administrative_unit/: {
      get: {
        operationId: "api_bronto_administrative_unit_list",
        description: "Reguired info for web\n-- is used to communicate with 3rd aplication,
        parameters: [],
        responses: {
          200: {
            description: "",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/AdministrativeUnit"
              }
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/bronto/event/: {
      get: {
        operationId: "api_bronto_event_list",
        description: "Reguired info for web\n-- is used to communicate with 3rd aplication,
        parameters: [
          {
            name: "date_from__gte",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "date_from__lte",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "date_from__year",
            in: "query",
            description: "",
            required: false,
            type: "number"
          },
          {
            name: "date_to__gte",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "date_to__lte",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "date_to__year",
            in: "query",
            description: "",
            required: false,
            type: "number"
          },
          {
            name: "start_date__gte",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "start_date__lte",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "start_date__year",
            in: "query",
            description: "",
            required: false,
            type: "number"
          },
          {
            name: "indended_for",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "program",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "basic_purpose",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "is_internal",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "administrative_unit",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "event_type_array",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "program_array",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "indended_for_array",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "type",
            in: "query",
            description: "",
            required: false,
            type: "string"
          },
          {
            name: "ordering",
            in: "query",
            description: "Which field to use when ordering the results.",
            required: false,
            type: "string"
          }
        ],
        responses: {
          200: {
            description: "",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/Event"
              }
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/bronto/event/{id}/: {
      get: {
        operationId: "api_bronto_event_read",
        description: "",
        parameters: [],
        responses: {
          200: {
            description: "",
            schema: {
              $ref: "#/definitions/Event"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          type: "string"
        }
      ]
    },
    /api/bronto/register_userprofile_interaction/: {
      post: {
        operationId: "api_bronto_register_userprofile_interaction_create",
        description: "",
        parameters: [
          {
            name: "data",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/CreateUserProfileInteraction"
            }
          }
        ],
        responses: {
          201: {
            description: "",
            schema: {
              $ref: "#/definitions/CreateUserProfileInteraction"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/check_event/{slug}/: {
      get: {
        operationId: "api_check_event_read",
        description: "Check if Event with this slug exists\n-- is used to communicate with 3rd aplication,
        parameters: [],
        responses: {
          200: {
            description: "",
            schema: {
              $ref: "#/definitions/EventCheck"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: [
        {
          name: "slug",
          in: "path",
          description: "Identifikátor kampaně",
          required: true,
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        }
      ]
    },
    /api/check_last_payment/: {
      get: {
        operationId: "api_check_last_payment_list",
        description: "check if payment exist in CRM or on darujme",
        parameters: [],
        responses: {
          200: {
            description: ""
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/check_last_payments/: {
      post: {
        operationId: "api_check_last_payments_create",
        description: "Check last assigned payment\n-- is used to communicate with 3rd aplication,
        parameters: [
          {
            name: "data",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/DonorPaymetChannel"
            }
          }
        ],
        responses: {
          200: {
            description: "",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/Payment"
              }
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/check_moneyaccount/{slug}/: {
      get: {
        operationId: "api_check_moneyaccount_read",
        description: "Check if MoneyAccount  Bank/Api with this slug exists\n-- is used to communicate with 3rd aplication,
        parameters: [],
        responses: {
          200: {
            description: "",
            schema: {
              $ref: "#/definitions/MoneyAccountCheck"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: [
        {
          name: "slug",
          in: "path",
          description: "Identifikátor účtu",
          required: true,
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        }
      ]
    },
    /api/companyprofile/vs/: {
      post: {
        operationId: "api_companyprofile_vs_create",
        description: "Creates or GET DonorPaymentChannel and return VS\n-- is used to communicate with 3rd aplication,
        parameters: [
          {
            name: "data",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/GetDpchCompanyProfile"
            }
          }
        ],
        responses: {
          200: {
            description: "",
            schema: {
              $ref: "#/definitions/VSReturn"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/create_credit_card_payment/: {
      post: {
        operationId: "api_create_credit_card_payment_create",
        description: "creates credit card payment in crm\n-- is used to communicate with 3rd aplication,
        parameters: [
          {
            name: "data",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/CreditCardPayment"
            }
          }
        ],
        responses: {
          200: {
            description: "",
            schema: {
              $ref: "#/definitions/Profile"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/interaction/: {
      post: {
        operationId: "api_interaction_create",
        description: "Create Interaction based on choice\n-- is used to communicate with 3rd aplication,
        parameters: [
          {
            name: "data",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/InteractionSerizer"
            }
          }
        ],
        responses: {
          200: {
            description: "returns empty json"
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/pdf_storage/all_related_ids/: {
      get: {
        operationId: "api_pdf_storage_all_related_ids_read",
        description: "",
        parameters: [],
        responses: {
          200: {
            description: "",
            schema: {
              $ref: "#/definitions/AllRelatedIds"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/pdf_storage/pdf_file/{id}/: {
      get: {
        operationId: "api_pdf_storage_pdf_file_read",
        description: "",
        parameters: [],
        responses: {
          200: {
            description: "",
            schema: {
              $ref: "#/definitions/PaidPdfDownloadLink"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          type: "string"
        }
      ]
    },
    /api/pdf_storage/{related_id}/list/: {
      get: {
        operationId: "api_pdf_storage_list_list",
        description: "",
        parameters: [],
        responses: {
          200: {
            description: "",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/PdfStorageList"
              }
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: [
        {
          name: "related_id",
          in: "path",
          required: true,
          type: "string"
        }
      ]
    },
    /api/register_userprofile/: {
      post: {
        operationId: "api_register_userprofile_create",
        description: "Create new userprofile with PW to has acces to paid section",
        parameters: [
          {
            name: "data",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/CreateUserProfile"
            }
          }
        ],
        responses: {
          201: {
            description: "",
            schema: {
              $ref: "#/definitions/CreateUserProfile"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/reset_password_email/: {
      post: {
        operationId: "api_reset_password_email_create",
        description: "",
        parameters: [
          {
            name: "data",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/ResetPasswordbyEmail"
            }
          }
        ],
        responses: {
          201: {
            description: "",
            schema: {
              $ref: "#/definitions/ResetPasswordbyEmail"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /api/reset_password_email_confirm/{uid}/{token}/: {
      post: {
        operationId: "api_reset_password_email_confirm_create",
        description: "",
        parameters: [
          {
            name: "data",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/ResetPasswordbyEmailConfirm"
            }
          }
        ],
        responses: {
          201: {
            description: "",
            schema: {
              $ref: "#/definitions/ResetPasswordbyEmailConfirm"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: [
        {
          name: "token",
          in: "path",
          required: true,
          type: "string"
        },
        {
          name: "uid",
          in: "path",
          required: true,
          type: "string"
        }
      ]
    },
    /api/userprofile/vs/: {
      post: {
        operationId: "api_userprofile_vs_create",
        description: "Creates or GET DonorPaymentChannel and return VS\n-- is used to communicate with 3rd aplication,
        parameters: [
          {
            name: "data",
            in: "body",
            required: true,
            schema: {
              $ref: "#/definitions/GetDpchUserProfile"
            }
          }
        ],
        responses: {
          200: {
            description: "",
            schema: {
              $ref: "#/definitions/VSReturn"
            }
          }
        },
        tags: [
          "api"
        ]
      },
      parameters: []
    },
    /desk/datatables_ticket_list/{query}: {
      get: {
        operationId: "desk_datatables_ticket_list_read",
        description: "Datatable on ticket_list.html uses this view from to get objects to display\non the table. query_tickets_by_args is at lib.py, DatatablesTicketSerializer is in\nserializers.py. The serializers and this view use django-rest_framework methods,
        parameters: [],
        responses: {
          200: {
            description: ""
          }
        },
        tags: [
          "desk"
        ]
      },
      parameters: [
        {
          name: "query",
          in: "path",
          required: true,
          type: "string"
        }
      ]
    },
    /desk/timeline_ticket_list/{query}: {
      get: {
        operationId: "desk_timeline_ticket_list_read",
        description: "",
        parameters: [],
        responses: {
          200: {
            description: ""
          }
        },
        tags: [
          "desk"
        ]
      },
      parameters: [
        {
          name: "query",
          in: "path",
          required: true,
          type: "string"
        }
      ]
    }
  },
  definitions: {
    AdministrativeUnit: {
      required: [
        "name"
      ],
      type: "object",
      properties: {
        id: {
          title: "ID",
          type: "integer",
          readOnly: true
        },
        name: {
          title: "Název",
          type: "string",
          maxLength: 255,
          minLength: 1
        },
        street: {
          title: "Ulice a číslo domu (č.p./č.o.)",
          type: "string",
          maxLength: 128
        },
        city: {
          title: "Město/Městská část",
          type: "string",
          maxLength: 40
        },
        zip_code: {
          title: "PSČ",
          type: "string",
          maxLength: 30
        },
        telephone: {
          title: "Telefon",
          type: "string",
          pattern: "^\\+?(42(0|1){1})?\\s?\\d{3}\\s?\\d{3}\\s?\\d{3}$,
          maxLength: 100
        },
        from_email_address: {
          title: "Odesílání z e-mailové adresy",
          description: "Nová adresa musí být nastavená administratorem",
          type: "string",
          format: "email",
          maxLength: 254,
          minLength: 1
        },
        web_url: {
          title: "Url adresa webu",
          type: "string",
          format: "uri",
          maxLength: 200,
          x-nullable: true
        },
        president_name: {
          title: "President name",
          type: "string",
          readOnly: true
        },
        manager_name: {
          title: "Manager name",
          type: "string",
          readOnly: true
        },
        gps_latitude: {
          title: "GPS latitude",
          type: "number",
          x-nullable: true
        },
        gps_longitude: {
          title: "GPS longitude",
          type: "number",
          x-nullable: true
        },
        level: {
          title: "Level",
          type: "string",
          enum: [
            "regional_center",
            "basic_section",
            "headquarter",
            "club"
          ]
        }
      }
    },
    Location: {
      required: [
        "name"
      ],
      type: "object",
      properties: {
        name: {
          title: "Název",
          type: "string",
          maxLength: 100,
          minLength: 1
        },
        place: {
          title: "Místo",
          type: "string",
          maxLength: 100
        },
        region: {
          title: "Kraj",
          type: "string",
          maxLength: 100
        },
        gps_latitude: {
          title: "GPS latitude",
          type: "number",
          x-nullable: true
        },
        gps_longitude: {
          title: "GPS longitude",
          type: "number",
          x-nullable: true
        }
      }
    },
    EventType: {
      required: [
        "name"
      ],
      type: "object",
      properties: {
        name: {
          title: "Název",
          description: "Název typu události",
          type: "string",
          maxLength: 100,
          minLength: 1
        },
        slug: {
          title: "Identifikátor",
          description: "Identifier of the event type",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$",
          maxLength: 100
        }
      }
    },
    Event: {
      required: [
        "name"
      ],
      type: "object",
      properties: {
        id: {
          title: "ID",
          type: "integer",
          readOnly: true
        },
        name: {
          title: "Název",
          description: "Vyberte pro tuto kampaň nějaké unikátní jméno",
          type: "string",
          maxLength: 100,
          minLength: 1
        },
        date_from: {
          title: "Datum od",
          type: "string",
          format: "date",
          x-nullable: true
        },
        date_to: {
          title: "Datum do",
          type: "string",
          format: "date",
          x-nullable: true
        },
        program: {
          title: "Program",
          type: "string",
          enum: [
            "",
            "education",
            "PsB",
            "monuments",
            "nature",
            "eco_consulting",
            "children_section "
          ]
        },
        indended_for: {
          title: "Pro koho",
          type: "string",
          enum: [
            "everyone",
            "adolescents_and_adults",
            "children",
            "parents_and_children",
            "newcomers"
          ]
        },
        basic_purpose: {
          title: "Základní účel",
          type: "string",
          enum: [
            "action",
            "action-with-attendee-list",
            "petition",
            "camp",
            "opportunity"
          ]
        },
        opportunity: {
          title: "Příležitost",
          type: "string",
          enum: [
            "",
            "organizing_events",
            "cooperation",
            "help_the_locality"
          ]
        },
        location: {
          $ref: "#/definitions/Location"
        },
        age_from: {
          title: "Věk od",
          type: "integer",
          maximum: 2147483647,
          minimum: 0,
          x-nullable: true
        },
        age_to: {
          title: "Věk do",
          type: "integer",
          maximum: 2147483647,
          minimum: 0,
          x-nullable: true
        },
        start_date: {
          title: "Datum začátku",
          type: "string",
          format: "date-time",
          x-nullable: true
        },
        event_type: {
          $ref: "#/definitions/EventType"
        },
        responsible_person: {
          title: "Responsible person",
          type: "string",
          maxLength: 128
        },
        participation_fee: {
          title: "Účastnický poplatek",
          type: "string",
          maxLength: 128
        },
        entry_form_url: {
          title: "Url adresa registračního formuláře",
          type: "string",
          format: "uri",
          maxLength: 200,
          x-nullable: true
        },
        web_url: {
          title: "Url adresa webu",
          type: "string",
          format: "uri",
          maxLength: 200,
          x-nullable: true
        },
        invitation_text_short: {
          title: "Pozvánka: malá ochutnávka",
          type: "string",
          maxLength: 3000
        },
        working_hours: {
          title: "Working hours (per day)",
          type: "integer",
          maximum: 2147483647,
          minimum: 0,
          x-nullable: true
        },
        accommodation: {
          title: "Accomondation",
          type: "string",
          maxLength: 256
        },
        diet: {
          title: "Diet",
          type: "string",
          enum: [
            "vegetarian",
            "non_vegetarian",
            "vegan",
            "kosher",
            "halal",
            "gluten_free"
          ]
        },
        looking_forward_to_you: {
          title: "Looking forward to you",
          type: "string",
          maxLength: 512
        },
        registration_method: {
          title: "Způsob registrace",
          type: "string",
          enum: [
            "standard",
            "other_electronic",
            "by_email",
            "not_required",
            "full"
          ]
        },
        administrative_unit_name: {
          title: "Administrative unit name",
          type: "string",
          readOnly: true
        },
        administrative_unit_web_url: {
          title: "Administrative unit web url",
          type: "string",
          readOnly: true
        },
        invitation_text_1: {
          title: "Pozvánka: co očekávat",
          description: "Co očekávat, základní informace",
          type: "string",
          maxLength: 3000
        },
        invitation_text_2: {
          title: "Pozvánka: co, kde a jak",
          description: "Program akce",
          type: "string",
          maxLength: 3000
        },
        invitation_text_3: {
          title: "Pozvánka: dobrovolnická pomoc",
          description: "dobrovolnická pomoc",
          type: "string",
          maxLength: 3000
        },
        invitation_text_4: {
          title: "Pozvánka: ochutnávka",
          description: "Malá ochutnávka",
          type: "string",
          maxLength: 3000
        },
        main_photo: {
          title: "Hlavní fotka",
          type: "string",
          readOnly: true,
          x-nullable: true,
          format: "uri"
        },
        additional_photo_1: {
          title: "Additional photo number 1",
          type: "string",
          readOnly: true,
          x-nullable: true,
          format: "uri"
        },
        additional_photo_2: {
          title: "Additional photo number 2",
          type: "string",
          readOnly: true,
          x-nullable: true,
          format: "uri"
        },
        additional_photo_3: {
          title: "Additional photo number 3",
          type: "string",
          readOnly: true,
          x-nullable: true,
          format: "uri"
        },
        additional_photo_4: {
          title: "Additional photo number 4",
          type: "string",
          readOnly: true,
          x-nullable: true,
          format: "uri"
        },
        additional_photo_5: {
          title: "Additional photo number 5",
          type: "string",
          readOnly: true,
          x-nullable: true,
          format: "uri"
        },
        additional_photo_6: {
          title: "Additional photo number 6",
          type: "string",
          readOnly: true,
          x-nullable: true,
          format: "uri"
        },
        additional_question_1: {
          title: "Additional question number 1",
          type: "string",
          maxLength: 300
        },
        additional_question_2: {
          title: "Additional question number 2",
          type: "string",
          maxLength: 300
        },
        additional_question_3: {
          title: "Additional question number 3",
          type: "string",
          maxLength: 300
        },
        additional_question_4: {
          title: "Additional question number 4",
          type: "string",
          maxLength: 300
        },
        contact_person_name: {
          title: "Contact person name",
          type: "string",
          maxLength: 128
        },
        contact_person_email: {
          title: "Contact person email address",
          type: "string",
          format: "email",
          maxLength: 254
        },
        contact_person_telephone: {
          title: "Contact person telephone number",
          type: "string",
          pattern: "^\\+?(42(0|1){1})?\\s?\\d{3}\\s?\\d{3}\\s?\\d{3}$,
          maxLength: 100
        },
        public_on_web_date_from: {
          title: "Public on the web date from",
          type: "string",
          format: "date",
          x-nullable: true
        },
        public_on_web_date_to: {
          title: "Public on the web date to",
          type: "string",
          format: "date",
          x-nullable: true
        }
      }
    },
    CreateUserProfileInteraction: {
      required: [
        "email",
        "event"
      ],
      type: "object",
      properties: {
        first_name: {
          title: "Křestní jméno",
          type: "string",
          maxLength: 128
        },
        last_name: {
          title: "Příjmení",
          type: "string",
          maxLength: 128
        },
        telephone: {
          title: "Telephone",
          type: "string",
          pattern: "^[0-9+ ]*$",
          minLength: 9
        },
        email: {
          title: "E-mailová adresa",
          type: "string",
          format: "email",
          maxLength: 254,
          x-nullable: true
        },
        note: {
          title: "Poznámky",
          type: "string",
          maxLength: 2000
        },
        age_group: {
          title: "Ročník narození",
          type: "integer",
          enum: [
            2021,
            2020,
            2019,
            2018,
            2017,
            2016,
            2015,
            2014,
            2013,
            2012,
            2011,
            2010,
            2009,
            2008,
            2007,
            2006,
            2005,
            2004,
            2003,
            2002,
            2001,
            2000,
            1999,
            1998,
            1997,
            1996,
            1995,
            1994,
            1993,
            1992,
            1991,
            1990,
            1989,
            1988,
            1987,
            1986,
            1985,
            1984,
            1983,
            1982,
            1981,
            1980,
            1979,
            1978,
            1977,
            1976,
            1975,
            1974,
            1973,
            1972,
            1971,
            1970,
            1969,
            1968,
            1967,
            1966,
            1965,
            1964,
            1963,
            1962,
            1961,
            1960,
            1959,
            1958,
            1957,
            1956,
            1955,
            1954,
            1953,
            1952,
            1951,
            1950,
            1949,
            1948,
            1947,
            1946,
            1945,
            1944,
            1943,
            1942,
            1941,
            1940,
            1939,
            1938,
            1937,
            1936,
            1935,
            1934,
            1933,
            1932,
            1931,
            1930,
            1929,
            1928,
            1927,
            1926,
            1925,
            1924,
            1923,
            1922
          ],
          x-nullable: true
        },
        birth_month: {
          title: "Měsíc narození",
          type: "integer",
          enum: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12
          ],
          x-nullable: true
        },
        birth_day: {
          title: "Den narození",
          type: "integer",
          enum: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31
          ],
          x-nullable: true
        },
        street: {
          title: "Ulice a číslo domu (č.p./č.o.)",
          type: "string",
          maxLength: 128
        },
        city: {
          title: "Město/Městská část",
          type: "string",
          maxLength: 40
        },
        zip_code: {
          title: "PSČ",
          type: "string",
          maxLength: 30
        },
        event: {
          title: "Event",
          type: "integer"
        },
        additional_question_1: {
          title: "Additional question 1",
          type: "string"
        },
        additional_question_2: {
          title: "Additional question 2",
          type: "string"
        },
        additional_question_3: {
          title: "Additional question 3",
          type: "string"
        },
        additional_question_4: {
          title: "Additional question 4",
          type: "string"
        }
      }
    },
    EventCheck: {
      type: "object",
      properties: {
        slug: {
          title: "Identifikátor",
          description: "Identifikátor kampaně",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$",
          maxLength: 100,
          x-nullable: true
        }
      }
    },
    DonorPaymetChannel: {
      required: [
        "event",
        "money_account",
        "VS",
        "amount",
        "date"
      ],
      type: "object",
      properties: {
        event: {
          title: "Event",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        money_account: {
          title: "Money account",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        VS: {
          title: "VS",
          description: "Variabilní symbol",
          type: "string",
          maxLength: 30
        },
        amount: {
          title: "Amount",
          type: "integer"
        },
        date: {
          title: "Date",
          type: "string",
          format: "date"
        }
      }
    },
    Payment: {
      required: [
        "amount",
        "date",
        "profile_id"
      ],
      type: "object",
      properties: {
        amount: {
          title: "Částka",
          description: "Částka v hlavní používané měně",
          type: "integer",
          maximum: 2147483647,
          minimum: 0
        },
        date: {
          title: "Datum platby",
          type: "string",
          format: "date"
        },
        operation_id: {
          title: "ID Operace",
          type: "string",
          maxLength: 200,
          x-nullable: true
        },
        profile_id: {
          title: "Profile id",
          type: "integer"
        }
      }
    },
    MoneyAccountCheck: {
      type: "object",
      properties: {
        slug: {
          title: "Identifikátor",
          description: "Identifikátor účtu",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$",
          maxLength: 100,
          x-nullable: true
        }
      }
    },
    GetDpchCompanyProfile: {
      required: [
        "name",
        "email",
        "money_account",
        "event",
        "amount",
        "regular"
      ],
      type: "object",
      properties: {
        crn: {
          title: "IČO",
          description: "Jen pro české firmy",
          type: "string",
          pattern: "^[0-9]*$",
          maxLength: 254,
          x-nullable: true
        },
        name: {
          title: "Název společnosti",
          type: "string",
          maxLength: 180,
          x-nullable: true
        },
        email: {
          title: "E-mailová adresa",
          type: "string",
          format: "email",
          maxLength: 254,
          x-nullable: true
        },
        telephone: {
          title: "Telephone",
          type: "string",
          pattern: "^[0-9+ ]*$",
          minLength: 9
        },
        street: {
          title: "Ulice a číslo domu (č.p./č.o.)",
          type: "string",
          maxLength: 128
        },
        city: {
          title: "Město/Městská část",
          type: "string",
          maxLength: 40
        },
        zip_code: {
          title: "PSČ",
          type: "string",
          maxLength: 30
        },
        money_account: {
          title: "Money account",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        event: {
          title: "Event",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        amount: {
          title: "Amount",
          type: "integer"
        },
        regular: {
          title: "Regular",
          type: "boolean"
        },
        contact_first_name: {
          title: "Contact first name",
          type: "string",
          maxLength: 256,
          minLength: 1
        },
        contact_last_name: {
          title: "Contact last name",
          type: "string",
          maxLength: 256,
          minLength: 1
        }
      }
    },
    VSReturn: {
      type: "object",
      properties: {
        VS: {
          title: "VS",
          description: "Variabilní symbol",
          type: "string",
          maxLength: 30
        }
      }
    },
    CreditCardPayment: {
      required: [
        "profile_type",
        "recipient_account",
        "date",
        "amount",
        "event",
        "email"
      ],
      type: "object",
      properties: {
        profile_type: {
          title: "Profile type",
          type: "string",
          enum: [
            "company",
            "user"
          ]
        },
        recipient_account: {
          title: "Recipient account",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        date: {
          title: "Datum platby",
          type: "string",
          format: "date"
        },
        amount: {
          title: "Částka",
          description: "Částka v hlavní používané měně",
          type: "integer",
          maximum: 2147483647,
          minimum: 0
        },
        event: {
          title: "Event",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        email: {
          title: "Email",
          type: "string",
          format: "email",
          minLength: 1
        },
        account: {
          title: "Account",
          description: "Bankovní účet, ze kterého peníze přišly",
          type: "string",
          maxLength: 100
        },
        bank_code: {
          title: "Kód banky",
          description: "Kód banky ze které peníze přišly",
          type: "string",
          maxLength: 30
        },
        VS: {
          title: "VS 1",
          description: "Variabilní symbol 1",
          type: "string",
          maxLength: 30,
          x-nullable: true
        },
        VS2: {
          title: "VS 2",
          description: "Variabilní symbol 2",
          type: "string",
          maxLength: 30,
          x-nullable: true
        },
        SS: {
          title: "SS",
          description: "Specifický symbol",
          type: "string",
          maxLength: 30
        },
        KS: {
          title: "KS",
          description: "Konstantní symbol",
          type: "string",
          maxLength: 30
        },
        BIC: {
          title: "BIC",
          description: "BIC",
          type: "string",
          maxLength: 30,
          x-nullable: true
        },
        user_identification: {
          title: "Identifikace odesílatele",
          description: "Identifikace odesílatele z bankovního výpisu",
          type: "string",
          maxLength: 50
        },
        done_by: {
          title: "Provedl",
          description: "Toto je kolonka importovaná z výpisů z účtu. Její účel není jasný. Na všech dosavadních výpisech bývala obyčejně prázdná.",
          type: "string",
          maxLength: 500
        },
        account_name: {
          title: "Jméno účtu",
          type: "string",
          maxLength: 200
        },
        bank_name: {
          title: "Jméno banky",
          type: "string",
          maxLength: 500
        },
        transfer_type: {
          title: "Typ převodu",
          type: "string",
          maxLength: 200,
          x-nullable: true
        },
        specification: {
          title: "Specifikace",
          type: "string",
          maxLength: 200,
          x-nullable: true
        },
        order_id: {
          title: "ID objednávky",
          type: "string",
          maxLength: 200,
          x-nullable: true
        }
      }
    },
    Profile: {
      required: [
        "profile_id"
      ],
      type: "object",
      properties: {
        profile_id: {
          title: "Profile id",
          type: "integer"
        }
      }
    },
    InteractionSerizer: {
      required: [
        "date",
        "event",
        "profile_id",
        "interaction_type",
        "text"
      ],
      type: "object",
      properties: {
        date: {
          title: "Date",
          type: "string",
          format: "date-time"
        },
        event: {
          title: "Event",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        profile_id: {
          title: "Profile id",
          type: "integer"
        },
        interaction_type: {
          title: "Interaction type",
          type: "string",
          enum: [
            "certificate",
            "confirmation"
          ]
        },
        text: {
          title: "Text",
          type: "string",
          minLength: 1
        }
      }
    },
    AllRelatedIds: {
      type: "object",
      properties: {
        ids: {
          title: "Ids",
          type: "string",
          readOnly: true
        }
      }
    },
    PaidPdfDownloadLink: {
      type: "object",
      properties: {
        download_url: {
          title: "Download url",
          type: "string",
          readOnly: true
        }
      }
    },
    PdfStorageList: {
      required: [
        "name",
        "topic"
      ],
      type: "object",
      properties: {
        id: {
          title: "ID",
          type: "integer",
          readOnly: true
        },
        name: {
          title: "Název souboru",
          type: "string",
          maxLength: 200,
          minLength: 1
        },
        topic: {
          title: "Téma souboru",
          type: "string",
          maxLength: 200,
          minLength: 1
        },
        author: {
          title: "Author",
          type: "string",
          readOnly: true
        },
        created: {
          title: "Datum vytvoření",
          type: "string",
          format: "date-time",
          readOnly: true
        }
      }
    },
    DonorPaymentChannelNested: {
      required: [
        "money_account",
        "event",
        "regular_amount"
      ],
      type: "object",
      properties: {
        money_account: {
          title: "Money account",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        event: {
          title: "Event",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        regular_amount: {
          title: "Částka pravidelné platby",
          description: "Jsme rádi za jakýkoli dar, plné členství s výhodami však začíná od 1800 Kč ročně.",
          type: "integer",
          maximum: 2147483647,
          minimum: 0,
          x-nullable: true
        },
        regular_frequency: {
          title: "Frekvence pravidelných plateb",
          type: "string",
          enum: [
            null,
            "monthly",
            "quaterly",
            "biannually",
            "annually"
          ],
          x-nullable: true
        },
        VS: {
          title: "VS",
          description: "Variabilní symbol",
          type: "string",
          readOnly: true,
          minLength: 1
        }
      }
    },
    CreateUserProfile: {
      required: [
        "email",
        "userchannels"
      ],
      type: "object",
      properties: {
        username: {
          title: "Uživatelské jméno",
          type: "string",
          maxLength: 150,
          x-nullable: true
        },
        password: {
          title: "Password",
          type: "string",
          minLength: 1
        },
        first_name: {
          title: "Křestní jméno",
          type: "string",
          maxLength: 128
        },
        last_name: {
          title: "Příjmení",
          type: "string",
          maxLength: 128
        },
        telephone: {
          title: "Telephone",
          type: "string",
          pattern: "^[0-9+ ]*$",
          minLength: 9
        },
        email: {
          title: "Email",
          type: "string",
          format: "email",
          minLength: 1
        },
        userchannels: {
          type: "array",
          items: {
            $ref: "#/definitions/DonorPaymentChannelNested"
          }
        }
      }
    },
    ResetPasswordbyEmail: {
      required: [
        "email"
      ],
      type: "object",
      properties: {
        email: {
          title: "Email",
          type: "string",
          format: "email",
          minLength: 1
        }
      }
    },
    ResetPasswordbyEmailConfirm: {
      required: [
        "password_1",
        "password_2"
      ],
      type: "object",
      properties: {
        password_1: {
          title: "Password 1",
          type: "string",
          minLength: 1
        },
        password_2: {
          title: "Password 2",
          type: "string",
          minLength: 1
        }
      }
    },
    GetDpchUserProfile: {
      required: [
        "email",
        "first_name",
        "last_name",
        "money_account",
        "event",
        "amount",
        "regular"
      ],
      type: "object",
      properties: {
        email: {
          title: "E-mailová adresa",
          type: "string",
          format: "email",
          maxLength: 254,
          x-nullable: true
        },
        first_name: {
          title: "Křestní jméno",
          type: "string",
          maxLength: 128
        },
        last_name: {
          title: "Příjmení",
          type: "string",
          maxLength: 128
        },
        telephone: {
          title: "Telephone",
          type: "string",
          pattern: "^[0-9+ ]*$",
          minLength: 9
        },
        street: {
          title: "Ulice a číslo domu (č.p./č.o.)",
          type: "string",
          maxLength: 128
        },
        city: {
          title: "Město/Městská část",
          type: "string",
          maxLength: 40
        },
        zip_code: {
          title: "PSČ",
          type: "string",
          maxLength: 30
        },
        money_account: {
          title: "Money account",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        event: {
          title: "Event",
          type: "string",
          format: "slug",
          pattern: "^[-a-zA-Z0-9_]+$"
        },
        birth_day: {
          title: "Den narození",
          type: "integer",
          enum: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31
          ],
          x-nullable: true
        },
        birth_month: {
          title: "Měsíc narození",
          type: "integer",
          enum: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12
          ],
          x-nullable: true
        },
        age_group: {
          title: "Ročník narození",
          type: "integer",
          enum: [
            2021,
            2020,
            2019,
            2018,
            2017,
            2016,
            2015,
            2014,
            2013,
            2012,
            2011,
            2010,
            2009,
            2008,
            2007,
            2006,
            2005,
            2004,
            2003,
            2002,
            2001,
            2000,
            1999,
            1998,
            1997,
            1996,
            1995,
            1994,
            1993,
            1992,
            1991,
            1990,
            1989,
            1988,
            1987,
            1986,
            1985,
            1984,
            1983,
            1982,
            1981,
            1980,
            1979,
            1978,
            1977,
            1976,
            1975,
            1974,
            1973,
            1972,
            1971,
            1970,
            1969,
            1968,
            1967,
            1966,
            1965,
            1964,
            1963,
            1962,
            1961,
            1960,
            1959,
            1958,
            1957,
            1956,
            1955,
            1954,
            1953,
            1952,
            1951,
            1950,
            1949,
            1948,
            1947,
            1946,
            1945,
            1944,
            1943,
            1942,
            1941,
            1940,
            1939,
            1938,
            1937,
            1936,
            1935,
            1934,
            1933,
            1932,
            1931,
            1930,
            1929,
            1928,
            1927,
            1926,
            1925,
            1924,
            1923,
            1922
          ],
          x-nullable: true
        },
        sex: {
          title: "Pohlaví",
          type: "string",
          enum: [
            "male",
            "female",
            "unknown"
          ]
        },
        amount: {
          title: "Amount",
          type: "integer"
        },
        regular: {
          title: "Regular",
          type: "boolean"
        }
      }
    }
  }
}
 */
