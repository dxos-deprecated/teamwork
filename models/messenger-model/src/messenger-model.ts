//
// Copyright 2020 DXOS.org
//

import { ModelMeta, Model } from '@dxos/model-factory';
import { MutationMeta } from '@dxos/echo-protocol';
import debug from 'debug';

import { Message, schema } from './proto';

export class MessengerModel extends Model<Message> {
  static meta: ModelMeta = {
    type: 'wrn://protocol.dxos.org/teamwork/messenger',
    mutation: schema.getCodecForType('dxos.teamwork.messenger.Message')
  };

  private readonly _messages: Message[] = [];

  get messages() {
    return this._messages;
  }

  async _processMessage (meta: MutationMeta, message: Message) {
    this._messages.push(message);
    this._messages.sort((msgA, msgB) => parseInt(msgA.timestamp) - parseInt(msgB.timestamp));
    return true;
  }

  async sendMessage(message: Message) {
    const receipt = await this.write(message);
    await receipt.waitToBeProcessed();
  }
}
