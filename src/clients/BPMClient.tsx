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
        name: "Reposición de producto en gondola",
        author: "David Antonio Muñoz Gaete",
        created_at: new Date(),
        modified_at: new Date(),
        meta_data: [],
        links: []
      }],
      offset: offset,
      limit: limit,
      total: 1,
      links: []
    } as IArrayRestResponse<IBpmItem>
  }

  async getById(id: string): Promise<IBpmItem> {
    await Expr.waitRandom(1500);

    return {
      id: "12321",
      name: "Reposición de producto en gondola",
      author: "David Antonio Muñoz Gaete",
      created_at: new Date(),
      modified_at: new Date(),
      meta_data: [
        {
          type: "STATE",
          name: "Producto pendiente de revisión",
          x: 400,
          y: 80
        } as IBpmMetadataStateItem,

        {
          type: "STATE",
          name: "Producto encontrado",
          x: 100,
          y: 400
        } as IBpmMetadataStateItem,

        {
          type: "STATE",
          name: "Producto no encontrado",
          x: 700,
          y: 400
        } as IBpmMetadataStateItem,
        
        {
          type: "TRANSITION",
          name: "Revisión",
          from: "Producto pendiente de revisión",
          to: "Producto encontrado"
        } as IBpmMetadataTransitionItem,

        {
          type: "TRANSITION",
          name: "Quebrar producto",
          from: "Producto pendiente de revisión",
          to: "Producto no encontrado"
        } as IBpmMetadataTransitionItem,

      ],
      links: []
    } as IBpmItem
  }
}

export interface IBpmItem {
  id: string,
  name: string,
  author: string,
  created_at: Date,
  modified_at: Date,
  meta_data: IBpmMetadataItem[]
  links?: ILink[]
}

export interface IBpmMetadataItem {
  type: "STATE" | "TRANSITION",
  name: string
}

export interface IBpmMetadataStateItem extends IBpmMetadataItem {
  x: number,
  y: number
}

export interface IBpmMetadataTransitionItem extends IBpmMetadataItem {
  from: string,
  to: string
}

export default new BpmClient({
  baseURL: process.env.REACT_APP_API_ENDPOINT!
});
