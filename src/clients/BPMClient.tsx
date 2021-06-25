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

  async getAll(offset: number, limit: number): Promise<IArrayRestResponse<IBpmFlow>> {
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
    } as IArrayRestResponse<IBpmFlow>
  }

  async getById(id: string): Promise<IBpmFlow> {
    await Expr.waitRandom(500);

    return {
      id: "12321",
      name: "Recepción de mercadería",
      author: "David Antonio Muñoz Gaete",
      created_at: new Date(),
      modified_at: new Date(),
      meta_data: [
        {
          type: "STATE",
          label: "Pendiente de recepción",
          start: true,
          editor_data: {
            x: 480,
            y: 120
          }
        } as IBpmMetadataStateItem,

        {
          type: "STATE",
          label: "Recepcionada",
          end: true,
          editor_data: {
            x: 329,
            y: 390
          }
        } as IBpmMetadataStateItem,

        {
          type: "STATE",
          label: "Rechazada",
          end: true,
          editor_data: {
            x: 540,
            y: 390
          }
        } as IBpmMetadataStateItem,

        {
          type: "STATE",
          label: "Pendiente de Validación",
          editor_data: {
            x: 330,
            y: 250
          }
        } as IBpmMetadataStateItem,

        {
          type: "TRANSITION",
          label: "Rechazar",
          from: "Pendiente de recepción",
          to: "Rechazada"
        } as IBpmMetadataTransitionItem,

        {
          type: "TRANSITION",
          label: "Marcar para validación",
          from: "Pendiente de recepción",
          to: "Pendiente de Validación"
        } as IBpmMetadataTransitionItem,

        {
          type: "TRANSITION",
          label: "Recepcionar",
          from: "Pendiente de Validación",
          to: "Recepcionada"
        } as IBpmMetadataTransitionItem,

        {
          type: "TRANSITION",
          label: "Rechazar",
          from: "Pendiente de Validación",
          to: "Rechazada"
        } as IBpmMetadataTransitionItem,

      ],
      links: []
    } as IBpmFlow
  }
}

export interface IBpmFlow {
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
  label: string,
  description?: string
}

export interface IBpmMetadataStateItem extends IBpmMetadataItem {
  end: boolean,
  start: boolean,
  editor_data: {
    x: number,
    y: number
  }
}

export interface IBpmMetadataTransitionItem extends IBpmMetadataItem {
  from: string,
  to: string
  roles: string[]
}

export default new BpmClient({
  baseURL: process.env.REACT_APP_API_ENDPOINT!
});
