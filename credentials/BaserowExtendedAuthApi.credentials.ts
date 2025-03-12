import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class BaserowExtendedAuthApi implements ICredentialType {
  name = 'baserowExtendedAuthApi';
  displayName = 'Baserow Extended Auth API';
  documentationUrl = 'https://baserow.io/docs/apis/rest-api';
  properties: INodeProperties[] = [
    {
      displayName: 'Authentication Type',
      name: 'authType',
      type: 'options',
      options: [
        {
          name: 'Username/Password (Cloud)',
          value: 'usernamePassword',
        },
        {
          name: 'API Token (Self-Hosted)',
          value: 'token',
        },
      ],
      default: 'usernamePassword',
      description: 'Choose the authentication method for Baserow API',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      displayOptions: {
        show: {
          authType: ['usernamePassword'],
        },
      },
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      displayOptions: {
        show: {
          authType: ['usernamePassword'],
        },
      },
    },
    {
      displayName: 'API Token',
      name: 'token',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      displayOptions: {
        show: {
          authType: ['token'],
        },
      },
    },
    {
      displayName: 'Host',
      name: 'host',
      type: 'string',
      default: 'https://api.baserow.io',
      description: 'The Baserow API host URL (default is the official Baserow API)',
    },
  ];
}
