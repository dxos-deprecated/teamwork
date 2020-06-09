import { CardProperties } from './CardProperties';

export interface CardItem {
  id: string,
  deleted: boolean,
  properties: CardProperties
}
