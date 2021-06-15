import WithBootedClient from '../lib/WithBootedClient';
import RESTClient, { ILink } from './RESTClient';

interface IConfig {
  baseURL: string
}

class UserClient extends RESTClient implements WithBootedClient {
  constructor(config: IConfig) {
    super({ baseURL: config.baseURL });
  }
  
  async boot() { }
}

export interface IUser {
  full_name: string,
  document_type: string,
  document_number: string,
  primarysid: string,
  email: string,
  links?: ILink[]
}

export default new UserClient({
  baseURL: process.env.REACT_APP_API_ENDPOINT!
});
