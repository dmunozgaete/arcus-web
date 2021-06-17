import Expr from '../lib/Expr';
import WithBootedClient from '../lib/WithBootedClient';
import RESTClient, { IArrayRestResponse, ILink } from './RESTClient';

interface IConfig {
  baseURL: string
}

class BpmClient extends RESTClient implements WithBootedClient {
  constructor(config: IConfig) {
    super({ baseURL: config.baseURL });
  }

  async boot() { }

  async getAll(offset: number, limit: number): Promise<IArrayRestResponse<IBpmItem>> {
    await Expr.waitRandom(1500);

    return {
      data: [{
        id: "12321",
        name: "Dummy BPM",
        author: "David Antonio Muñoz Gaete",
        created_at: new Date(),
        modified_at: new Date(),
        links: []
      }],
      offset: offset,
      limit: limit,
      total: 1,
      links: []
    } as IArrayRestResponse<IBpmItem>
  }
}

export interface IBpmItem {
  id: string,
  name: string,
  author: string,
  created_at: Date,
  modified_at: Date,
  links?: ILink[]
}

export default new BpmClient({
  baseURL: process.env.REACT_APP_API_ENDPOINT!
});
