import { INodeProperties } from 'n8n-workflow';

export const rowOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['row'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new row',
        action: 'Create a row',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a row',
        action: 'Delete a row',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a row',
        action: 'Get a row',
      },
      {
        name: 'Get All',
        value: 'getAll',
        description: 'Get all rows',
        action: 'Get all rows',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a row',
        action: 'Update a row',
      },
    ],
    default: 'create',
  },
];

export const rowFields: INodeProperties[] = [
  {
    displayName: 'Database Name or ID',
    name: 'databaseId',
    type: 'options',
    default: '',
    required: true,
    description:
      'Database to operate on. Choose from the list or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    typeOptions: {
      loadOptionsMethod: 'getDatabaseIds',
    },
    displayOptions: {
      show: {
        resource: ['row'],
      },
    },
  },
  {
    displayName: 'Table Name or ID',
    name: 'tableId',
    type: 'options',
    default: '',
    required: true,
    description:
      'Table to operate on. Choose from the list or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    typeOptions: {
      loadOptionsDependsOn: ['databaseId'],
      loadOptionsMethod: 'getTableIds',
    },
    displayOptions: {
      show: {
        resource: ['row'],
      },
    },
  },
  // Create
  {
    displayName: 'Data to Send',
    name: 'dataToSend',
    type: 'options',
    displayOptions: {
      show: {
        operation: ['create', 'update'],
        resource: ['row'],
      },
    },
    options: [
      {
        name: 'Define Below',
        value: 'defineBelow',
        description: 'Define the row data to send below',
      },
      {
        name: 'Auto-Map Input Data',
        value: 'autoMapInputData',
        description: 'Map input data automatically to row fields',
      },
    ],
    default: 'defineBelow',
  },
  {
    displayName: 'Inputs to Ignore',
    name: 'inputsToIgnore',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['create', 'update'],
        resource: ['row'],
        dataToSend: ['autoMapInputData'],
      },
    },
    default: '',
    description:
      'List of input properties to avoid sending separated by commas. Leave empty to send all properties.',
    placeholder: 'Enter properties...',
  },
  {
    displayName: 'Fields to Send',
    name: 'fieldsUi',
    placeholder: 'Add Field',
    type: 'fixedCollection',
    typeOptions: {
      multipleValueButtonText: 'Add Field to Send',
      multipleValues: true,
    },
    displayOptions: {
      show: {
        operation: ['create', 'update'],
        resource: ['row'],
        dataToSend: ['defineBelow'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Field',
        name: 'fieldValues',
        values: [
          {
            displayName: 'Field Name or ID',
            name: 'fieldId',
            type: 'options',
            description:
              'Choose from the list or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
            typeOptions: {
              loadOptionsDependsOn: ['tableId'],
              loadOptionsMethod: 'getTableFields',
            },
            default: '',
          },
          {
            displayName: 'Field Value',
            name: 'fieldValue',
            type: 'string',
            default: '',
          },
        ],
      },
    ],
  },
  // Delete & Get & Update
  {
    displayName: 'Row ID',
    name: 'rowId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['delete', 'get', 'update'],
        resource: ['row'],
      },
    },
    default: '',
    description: 'The ID of the row to delete, get, or update',
  },
  // Get All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        operation: ['getAll'],
        resource: ['row'],
      },
    },
    default: false,
    description: 'Whether to return all rows or a limited number',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        operation: ['getAll'],
        resource: ['row'],
        returnAll: [false],
      },
    },
    default: 50,
    description: 'Max number of rows to return',
  },
  {
    displayName: 'Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add option',
    default: {},
    displayOptions: {
      show: {
        operation: ['getAll'],
        resource: ['row'],
      },
    },
    options: [
      {
        displayName: 'Filters',
        name: 'filters',
        placeholder: 'Add Filter',
        description: 'Filter rows based on comparison operators',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'fields',
            displayName: 'Field',
            values: [
              {
                displayName: 'Field Name or ID',
                name: 'field',
                type: 'options',
                default: '',
                description:
                  'Field to compare. Choose from the list or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                typeOptions: {
                  loadOptionsDependsOn: ['tableId'],
                  loadOptionsMethod: 'getTableFields',
                },
              },
              {
                displayName: 'Filter',
                name: 'operator',
                description: 'Operator to compare field and value with',
                type: 'options',
                options: [
                  {
                    name: 'Contains',
                    value: 'contains',
                    description: 'Field contains value',
                  },
                  {
                    name: 'Contains Not',
                    value: 'contains_not',
                    description: 'Field does not contain value',
                  },
                  {
                    name: 'Equal',
                    value: 'equal',
                    description: 'Field is equal to value',
                  },
                  {
                    name: 'Higher Than',
                    value: 'higher_than',
                    description: 'Field is higher than value',
                  },
                  {
                    name: 'Is Empty',
                    value: 'empty',
                    description: 'Field is empty',
                  },
                  {
                    name: 'Is Not Empty',
                    value: 'not_empty',
                    description: 'Field is not empty',
                  },
                  {
                    name: 'Lower Than',
                    value: 'lower_than',
                    description: 'Field is lower than value',
                  },
                  {
                    name: 'Not Equal',
                    value: 'not_equal',
                    description: 'Field is not equal to value',
                  },
                ],
                default: 'equal',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'Value to compare to',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Filter Type',
        name: 'filterType',
        type: 'options',
        options: [
          {
            name: 'AND',
            value: 'AND',
            description: 'Indicates that the rows must match all the provided filters',
          },
          {
            name: 'OR',
            value: 'OR',
            description: 'Indicates that the rows only have to match one of the filters',
          },
        ],
        default: 'AND',
        description:
          'This works only if two or more filters are provided. Defaults to <code>AND</code>',
      },
      {
        displayName: 'Search Term',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Text to match (can be in any column)',
      },
      {
        displayName: 'Sorting',
        name: 'order',
        placeholder: 'Add Sort Order',
        description: 'Set the sort order of the result rows',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'fields',
            displayName: 'Field',
            values: [
              {
                displayName: 'Field Name or ID',
                name: 'field',
                type: 'options',
                default: '',
                description:
                  'Field name to sort by. Choose from the list or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                typeOptions: {
                  loadOptionsDependsOn: ['tableId'],
                  loadOptionsMethod: 'getTableFields',
                },
              },
              {
                displayName: 'Direction',
                name: 'direction',
                type: 'options',
                options: [
                  {
                    name: 'ASC',
                    value: '',
                    description: 'Sort in ascending order',
                  },
                  {
                    name: 'DESC',
                    value: '-',
                    description: 'Sort in descending order',
                  },
                ],
                default: '',
                description: 'Sort direction either ascending or descending',
              },
            ],
          },
        ],
      },
    ],
  },
];
