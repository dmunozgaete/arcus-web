import Expr from '../lib/Expr';
import WithBootedClient from '../lib/WithBootedClient';
import RESTClient, { IArrayRestResponse } from './RESTClient';

interface IConfig {
  baseURL: string
}

class ActorClient extends RESTClient implements WithBootedClient {
  constructor(config: IConfig) {
    super({ baseURL: config.baseURL });
  }

  async getAll(offset: number, limit: number): Promise<IArrayRestResponse<IActor>> {
    await Expr.waitRandom(1500);

    return {
      data: [{
        id: 'bf98f2dd-9be6-4da8-a11a-140caf4e9475',
        name: 'Supermercados',
        type: 'ROLE'
      },
      {
        id: 'd4067489-a86c-4361-b979-e1c3a70912ec',
        name: 'Juan Jose Diaz',
        type: 'USER'
      },
      {
        id: 'f4067489-a86c-4361-b979-e1c3a70912e3',
        name: 'Chile',
        type: 'TAG'
      }],
      offset: offset,
      limit: limit,
      total: 1,
      links: []
    }
  }

  async boot() { }
}

export interface IActor {
  name: string,
  type: 'USER' | 'ROLE' | 'TAG'
  id: string
}

export default new ActorClient({
  baseURL: process.env.REACT_APP_API_ENDPOINT!
});
