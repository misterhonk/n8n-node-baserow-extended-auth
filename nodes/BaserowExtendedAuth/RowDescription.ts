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
        description: 'Create a new row in a table',
        action: 'Create a row',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a row from a table',
        action: 'Delete a row',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a specific row from a table',
        action: 'Get a row',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Retrieve many rows from a table',
        action: 'Get many rows',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a row in a table',
        action: 'Update a row',
      },
    ],
    default: 'getAll',
  },
];

export const rowFields: INodeProperties[] = [
  {
    displayName: 'Table ID',
    name: 'tableId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['row'],
      },
    },
    description: 'The ID of the table',
  },
  {
    displayName: 'Row Data',
    name: 'rowData',
    type: 'json',
    displayOptions: {
      show: {
        resource: ['row'],
        operation: ['create'],
      },
    },
    default: '{}',
    description: 'JSON object with the row data to create',
  },
  {
    displayName: 'Row ID',
    name: 'rowId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['row'],
        operation: ['delete', 'get', 'update'],
      },
    },
    default: '',
    required: true,
    description: 'The ID of the row to operate on',
  },
  {
    displayName: 'Row Data',
    name: 'rowData',
    type: 'json',
    displayOptions: {
      show: {
        resource: ['row'],
        operation: ['update'],
      },
    },
    default: '{}',
    description: 'JSON object with the row data to update',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['row'],
        operation: ['getAll'],
      },
    },
    default: true,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: {
      minValue: 1, // maxValue entfernt, um Fehler zu beheben
    },
    displayOptions: {
      show: {
        resource: ['row'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'json',
    displayOptions: {
      show: {
        resource: ['row'],
        operation: ['getAll'],
      },
    },
    default: '{}',
    description: 'JSON object with filters for retrieving rows (e.g., {"field_1__equal": "value"})',
  },
];
