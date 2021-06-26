import Expr from '../lib/Expr';
import WithBootedClient from '../lib/WithBootedClient';
import { IActor } from './ActorClient';
import RESTClient, { IArrayRestResponse, ILink } from './RESTClient';

interface IConfig {
  baseURL: string
}

class FlowClient extends RESTClient implements WithBootedClient {
  constructor(config: IConfig) {
    super({ baseURL: config.baseURL });
  }

  async boot() { }

  async getAll(offset: number, limit: number): Promise<IArrayRestResponse<IFlow>> {
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
    } as IArrayRestResponse<IFlow>
  }

  async getById(id: string): Promise<IFlow> {
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
          actors: [{
            id: 'bf98f2dd-9be6-4da8-a11a-140caf4e9475',
            name: 'Supermercados',
            type: 'ROLE'
          },
          {
            id: 'd4067489-a86c-4361-b979-e1c3a70912ec',
            name: 'Juan Jose Diaz',
            type: 'USER'
          }],
          editor_data: {
            x: 540,
            y: 120
          }
        } as IFlowMetadataState,

        {
          type: "STATE",
          label: "Recepcionada",
          end: true,
          editor_data: {
            x: 329,
            y: 390
          }
        } as IFlowMetadataState,

        {
          type: "STATE",
          label: "Rechazada",
          end: true,
          editor_data: {
            x: 540,
            y: 390
          }
        } as IFlowMetadataState,

        {
          type: "STATE",
          label: "Pendiente de Validación",
          editor_data: {
            x: 330,
            y: 250
          }
        } as IFlowMetadataState,

        {
          type: "TRANSITION",
          label: "Rechazar",
          from: "Pendiente de recepción",
          to: "Rechazada"
        } as IFlowMetadataTransition,

        {
          type: "TRANSITION",
          label: "Marcar para validación",
          from: "Pendiente de recepción",
          to: "Pendiente de Validación"
        } as IFlowMetadataTransition,

        {
          type: "TRANSITION",
          label: "Recepcionar",
          from: "Pendiente de Validación",
          to: "Recepcionada"
        } as IFlowMetadataTransition,

        {
          type: "TRANSITION",
          label: "Rechazar",
          from: "Pendiente de Validación",
          to: "Rechazada"
        } as IFlowMetadataTransition,

      ],
      links: []
    } as IFlow
  }
}

export interface IFlow {
  id: string,
  name: string,
  author: string,
  created_at: Date,
  modified_at: Date,
  meta_data: IFlowMetadata[]
  links?: ILink[]
}

export interface IFlowMetadata {
  type: "STATE" | "TRANSITION",
  label: string,
  description?: string
}

export interface IFlowMetadataState extends IFlowMetadata {
  end: boolean,
  start: boolean,
  actors: IActor[]
  editor_data: {
    x: number,
    y: number
  }
}

export interface IFlowMetadataTransition extends IFlowMetadata {
  from: string,
  to: string
}

export default new FlowClient({
  baseURL: process.env.REACT_APP_API_ENDPOINT!
});
