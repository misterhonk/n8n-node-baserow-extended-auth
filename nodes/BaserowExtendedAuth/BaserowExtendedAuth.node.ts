import { IExecuteFunctions, INodeType, INodeTypeDescription, INodeExecutionData } from 'n8n-workflow';
import { baserowApiRequest } from './GenericFunctions';
import { rowOperations, rowFields } from './RowDescription';

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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'row') {
          const tableId = this.getNodeParameter('tableId', i) as string;

          if (operation === 'create') {
            const rowData = this.getNodeParameter('rowData', i) as string;
            const body = JSON.parse(rowData);
            const response = await baserowApiRequest.call(
              this,
              'POST',
              `/api/database/rows/table/${tableId}/`,
              body,
            );
            returnData.push({ json: response });
          } else if (operation === 'delete') {
            const rowId = this.getNodeParameter('rowId', i) as string;
            await baserowApiRequest.call(
              this,
              'DELETE',
              `/api/database/rows/table/${tableId}/${rowId}/`,
            );
            returnData.push({ json: { success: true } });
          } else if (operation === 'get') {
            const rowId = this.getNodeParameter('rowId', i) as string;
            const response = await baserowApiRequest.call(
              this,
              'GET',
              `/api/database/rows/table/${tableId}/${rowId}/`,
            );
            returnData.push({ json: response });
          } else if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as unknown as string;
            const qs = JSON.parse(filters || '{}');

            if (returnAll) {
              const response = await baserowApiRequest.call(
                this,
                'GET',
                `/api/database/rows/table/${tableId}/`,
                {},
                qs,
              );
              returnData.push(...response.results.map((item: any) => ({ json: item })));
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              qs.size = limit;
              const response = await baserowApiRequest.call(
                this,
                'GET',
                `/api/database/rows/table/${tableId}/`,
                {},
                qs,
              );
              returnData.push(...response.results.map((item: any) => ({ json: item })));
            }
          } else if (operation === 'update') {
            const rowId = this.getNodeParameter('rowId', i) as string;
            const rowData = this.getNodeParameter('rowData', i) as string;
            const body = JSON.parse(rowData);
            const response = await baserowApiRequest.call(
              this,
              'PATCH',
              `/api/database/rows/table/${tableId}/${rowId}/`,
              body,
            );
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
