import {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  IRequestOptions,
  IDataObject,
  JsonObject,
  NodeApiError,
} from 'n8n-workflow';

/**
 * Make a request to Baserow API with extended authentication options.
 */
export async function baserowApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
): Promise<any> {
  const credentials = await this.getCredentials('baserowExtendedAuthApi');
  const authType = credentials.authType as string;

  // Ensure we don't have duplicate /api/ in the URL
  const baseUrl = credentials.host as string;
  const apiEndpoint = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
  
  const options: IRequestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    uri: `${baseUrl}${apiEndpoint}`,
    //uri: `${baseUrl}`,
    body,
    qs,
    json: true,
  };

  // Handle different authentication methods
  if (authType === 'token') {
    // API Token authentication for self-hosted installations
    options.headers!.Authorization = `Token ${credentials.token}`;
  } else if (authType === 'usernamePassword') {
    // Username/Password authentication for cloud
    const jwtToken = await getJwtToken.call(this, credentials as IDataObject);
    options.headers!.Authorization = `JWT ${jwtToken}`;
  }

  if (Object.keys(body).length === 0) {
    delete options.body;
  }
  if (Object.keys(qs).length === 0) {
    delete options.qs;
  }

  try {
    return await this.helpers.request!(options);
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

/**
 * Get all results from a paginated query to Baserow API.
 */
export async function baserowApiRequestAllItems(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let responseData;

  qs.page = 1;
  qs.size = 100;

  do {
    responseData = await baserowApiRequest.call(this, method, endpoint, body, qs);
    returnData.push(...(responseData.results as IDataObject[]));
    qs.page = (qs.page as number) + 1;
  } while (responseData.next !== null);

  return returnData;
}

/**
 * Get a JWT token based on Baserow account username and password.
 */
export async function getJwtToken(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  credentials: IDataObject,
): Promise<string> {
  // Ensure we don't have duplicate /api/ in the URL
  const baseUrl = credentials.host as string;
  const tokenEndpoint = '/api/user/token-auth/';
  
  const options: IRequestOptions = {
    method: 'POST',
    body: {
      username: credentials.username,
      password: credentials.password,
    },
    uri: `${baseUrl}${tokenEndpoint}`,
    json: true,
  };

  try {
    const { token } = (await this.helpers.request(options)) as { token: string };
    return token;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}
