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
          name: "Pendiente de Verificación de producto",
          x: 50,
          y: 400
        } as IBpmMetadataStateItem,

        {
          type: "STATE",
          name: "Pendiente de revisión en bodega",
          x: 250,
          y: 50
        } as IBpmMetadataStateItem,

        {
          type: "STATE",
          name: "Estado 3",
          x: 250,
          y: 400
        } as IBpmMetadataStateItem,


        {
          type: "STATE",
          name: "Estado 4",
          x: 250,
          y: 800
        } as IBpmMetadataStateItem,

        {
          type: "STATE",
          name: "Estado 5",
          x: 480,
          y: 400
        } as IBpmMetadataStateItem,

        {
          type: "TRANSITION",
          name: "Verificar en bodega",
          from: "Pendiente de Verificación de producto",
          to: "Pendiente de revisión en bodega"
        } as IBpmMetadataTransitionItem,
/*
        {
          type: "TRANSITION",
          name: "Transición 2",
          from: "Estado 2",
          to: "Estado 5"
        } as IBpmMetadataTransitionItem,

        {
          type: "TRANSITION",
          name: "Transición 3",
          from: "Estado 5",
          to: "Estado 3"
        } as IBpmMetadataTransitionItem,

        {
          type: "TRANSITION",
          name: "Transición 4",
          from: "Estado 3",
          to: "Estado 4"
        } as IBpmMetadataTransitionItem
*/

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
