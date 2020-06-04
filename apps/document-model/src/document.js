
import { Model } from '@dxos/data-client';

import { Document } from '@dxos/document';

export class DocumentModel extends Model {
  /**
   * @type {Document}
   */
  _document = undefined;

  constructor() {
    super();
    this._document = new Document();
    this._document.on('update', this._handleDocumentUpdate);
  }

  get document() {
    return this._document;
  }

  _handleDocumentUpdate = ({ update, origin }) => {
    const local = !origin.author || origin.author === this.id;

    if (local) {
      return super.appendMessage({
        __type_url: 'testing.document.Update',
        update,
        origin: { author: this.id }
      });
    }
  };

  onUpdate(messages) {
    messages.forEach(({ update, origin }) => {
      if (origin.author === this.id) return;

      this.document.applyUpdate(new Uint8Array(Object.values(update)), origin);

      this.emit('doc-update');
    });
  }

  onDestroy() {
    this.document.off('update', this._handleDocumentUpdate);
  }

  updateContentFromMarkdown = markdownContent => {
    return this.document.content.fromMarkdown(markdownContent);
  }
}
