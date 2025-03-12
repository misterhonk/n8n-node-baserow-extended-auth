import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';

export async function baserowApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: string,
  endpoint: string,
  body: any = {},
  qs: any = {},
): Promise<any> {
  const credentials = await this.getCredentials('baserowExtendedAuthApi');
  const host = credentials.host as string;
  const authType = credentials.authType as string;

  const options: any = {
    method,
    uri: `${host}${endpoint}`,
    json: true,
    qs,
    body,
    headers: {},
  };

  if (authType === 'usernamePassword') {
    const tokenResponse = await this.helpers.request({
      method: 'POST',
      uri: `${host}/api/user/token-auth/`,
      json: true,
      body: {
        username: credentials.username,
        password: credentials.password,
      },
    });
    options.headers['Authorization'] = `JWT ${tokenResponse.token}`;
  } else if (authType === 'token') {
    options.headers['Authorization'] = `Token ${credentials.token}`;
  }

  try {
    return await this.helpers.request(options);
  } catch (error) {
    throw new Error(`Baserow API Error: ${error.message}`);
  }
}
