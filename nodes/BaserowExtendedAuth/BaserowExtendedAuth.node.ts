import {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
  IDataObject,
  ILoadOptionsFunctions,
} from 'n8n-workflow';
import { 
  baserowApiRequest, 
  baserowApiRequestAllItems,
} from './GenericFunctions';
import { rowOperations, rowFields } from './RowDescription';

/**
 * Helper class for mapping field IDs to names and vice versa
 */
class TableFieldMapper {
  nameToIdMapping: Record<string, string> = {};
  idToNameMapping: Record<string, string> = {};
  mapIds = true;

  async getTableFields(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    tableId: string,
    jwtToken?: string,
  ): Promise<any[]> {
    const endpoint = `/database/fields/table/${tableId}/`;
    return await baserowApiRequest.call(this, 'GET', endpoint, {}, {});
  }

  createMappings(tableFields: any[]) {
    this.nameToIdMapping = this.createNameToIdMapping(tableFields);
    this.idToNameMapping = this.createIdToNameMapping(tableFields);
  }

  private createIdToNameMapping(responseData: any[]) {
    return responseData.reduce<Record<string, string>>((acc, cur) => {
      acc[`field_${cur.id}`] = cur.name;
      return acc;
    }, {});
  }

  private createNameToIdMapping(responseData: any[]) {
    return responseData.reduce<Record<string, string>>((acc, cur) => {
      acc[cur.name] = `field_${cur.id}`;
      return acc;
    }, {});
  }

  setField(field: string) {
    return this.mapIds ? field : (this.nameToIdMapping[field] ?? field);
  }

  idsToNames(obj: Record<string, unknown>) {
    Object.entries(obj).forEach(([key, value]) => {
      if (this.idToNameMapping[key] !== undefined) {
        delete obj[key];
        obj[this.idToNameMapping[key]] = value;
      }
    });
  }

  namesToIds(obj: Record<string, unknown>) {
    Object.entries(obj).forEach(([key, value]) => {
      if (this.nameToIdMapping[key] !== undefined) {
        delete obj[key];
        obj[this.nameToIdMapping[key]] = value;
      }
    });
  }
}

/**
 * Helper function to convert loaded resources to options
 */
function toOptions(items: any[]) {
  return items.map(({ name, id }) => ({ name, value: id }));
}


export class BaserowExtendedAuth implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Baserow Extended Auth',
    name: 'baserowExtendedAuth',
    icon: 'file:baserow.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Baserow API with extended authentication',
    defaults: {
      name: 'Baserow Extended Auth',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'baserowExtendedAuthApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: '={{$credentials.host}}',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Row',
            value: 'row',
          },
        ],
        default: 'row',
      },
      ...rowOperations,
      ...rowFields,
    ],
  };

  methods = {
    loadOptions: {
      async getDatabaseIds(this: ILoadOptionsFunctions) {
        const endpoint = '/applications/';
        const databases = await baserowApiRequest.call(
          this,
          'GET',
          endpoint,
          {},
          {},
        );
        return toOptions(databases);
      },

      async getTableIds(this: ILoadOptionsFunctions) {
        const databaseId = this.getNodeParameter('databaseId', 0) as string;
        const endpoint = `/database/tables/database/${databaseId}/`;
        const tables = await baserowApiRequest.call(
          this,
          'GET',
          endpoint,
          {},
          {},
        );
        return toOptions(tables);
      },

      async getTableFields(this: ILoadOptionsFunctions) {
        const tableId = this.getNodeParameter('tableId', 0) as string;
        const endpoint = `/database/fields/table/${tableId}/`;
        const fields = await baserowApiRequest.call(
          this,
          'GET',
          endpoint,
          {},
          {},
        );
        return toOptions(fields);
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    const returnData: INodeExecutionData[] = [];
    const mapper = new TableFieldMapper();

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'row') {
          const tableId = this.getNodeParameter('tableId', i) as string;

          // Get table fields for field mapping if needed
          if (['create', 'update'].includes(operation)) {
            const fields = await mapper.getTableFields.call(this, tableId);
            mapper.createMappings(fields);
          }

          if (operation === 'create') {
            const dataToSend = this.getNodeParameter('dataToSend', i) as string;
            let body: any;
            if (dataToSend === 'autoMapInputData') {
              body = { ...items[i].json };
              const inputsToIgnore = (this.getNodeParameter('inputsToIgnore', i, '') as string)
                .split(',')
                .map((c) => c.trim())
                .filter((c) => !!c);
              
              if (inputsToIgnore.length) {
                inputsToIgnore.forEach((key) => {
                  delete body[key];
                });
              }
              
              mapper.namesToIds(body);
            } else {
              body = {};
              const fieldsUi = this.getNodeParameter('fieldsUi.fieldValues', i, []) as Array<{
                fieldId: string;
                fieldValue: string;
              }>;
              
              for (const field of fieldsUi) {
                body[`field_${field.fieldId}`] = field.fieldValue;
              }
            }
            const response = await baserowApiRequest.call(
              this,
              'POST',
              `/database/rows/table/${tableId}/`,
              body,
            );
            mapper.idsToNames(response);
            returnData.push({ json: response });
          } else if (operation === 'delete') {
            const rowId = this.getNodeParameter('rowId', i) as string;
            await baserowApiRequest.call(
              this,
              'DELETE',
              `/database/rows/table/${tableId}/${rowId}/`,
            );
            returnData.push({ json: { success: true } });
          } else if (operation === 'get') {
            const rowId = this.getNodeParameter('rowId', i) as string;
            const response = await baserowApiRequest.call(
              this,
              'GET',
              `/database/rows/table/${tableId}/${rowId}/`,
            );
            mapper.idsToNames(response);
            returnData.push({ json: response });
          } else if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const { order, filters, filterType, search } = this.getNodeParameter(
              'additionalOptions',
              i,
              {},
            ) as {
              order?: { fields: Array<{ field: string; direction: string }> };
              filters?: { fields: Array<{ field: string; operator: string; value: string }> };
              filterType?: string;
              search?: string;
            };

            const qs: IDataObject = {};

            if (order?.fields) {
              qs.order_by = order.fields
                .map(({ field, direction }) => `${direction}${mapper.setField(field)}`)
                .join(',');
            }

            if (filters?.fields) {
              filters.fields.forEach(({ field, operator, value }) => {
                qs[`filter__field_${mapper.setField(field)}__${operator}`] = value;
              });
            }

            if (filterType) {
              qs.filter_type = filterType;
            }

            if (search) {
              qs.search = search;
            }

            if (returnAll) {
              const allRows = await baserowApiRequestAllItems.call(
                this,
                'GET',
                `/database/rows/table/${tableId}/`,
                {},
                qs,
              );
              allRows.forEach((row: Record<string, unknown>) => mapper.idsToNames(row));
              returnData.push(...allRows.map((item: any) => ({ json: item })));
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              qs.size = limit;
              const response = await baserowApiRequest.call(
                this,
                'GET',
                `/database/rows/table/${tableId}/`,
                {},
                qs,
              );
              response.results.forEach((row: Record<string, unknown>) => mapper.idsToNames(row));
              returnData.push(...response.results.map((item: any) => ({ json: item })));
            }
          } else if (operation === 'update') {
            const rowId = this.getNodeParameter('rowId', i) as string;
            const dataToSend = this.getNodeParameter('dataToSend', i) as string;
            let body: any;
            if (dataToSend === 'autoMapInputData') {
              body = { ...items[i].json };
              const inputsToIgnore = (this.getNodeParameter('inputsToIgnore', i, '') as string)
                .split(',')
                .map((c) => c.trim())
                .filter((c) => !!c);
              
              if (inputsToIgnore.length) {
                inputsToIgnore.forEach((key) => {
                  delete body[key];
                });
              }
              
              mapper.namesToIds(body);
            } else {
              body = {};
              const fieldsUi = this.getNodeParameter('fieldsUi.fieldValues', i, []) as Array<{
                fieldId: string;
                fieldValue: string;
              }>;
              
              for (const field of fieldsUi) {
                body[`field_${field.fieldId}`] = field.fieldValue;
              }
            }
            const response = await baserowApiRequest.call(
              this,
              'PATCH',
              `/database/rows/table/${tableId}/${rowId}/`,
              body,
            );
            mapper.idsToNames(response);
            returnData.push({ json: response });
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
