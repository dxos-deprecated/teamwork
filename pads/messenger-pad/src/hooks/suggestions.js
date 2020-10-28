//
// Copyright 2020 DXOS.org
//

const getItemTitle = item => item.model ? item.model.getProperty('title') : item.displayName

const queryFilter = query => items => {
  console.log('queryFilter items', items);
  return items.filter(item => {
    const label = getItemTitle(item);
    return label?.toLowerCase()?.includes(query.toLowerCase());
  });
};

export const useSuggestionsMenuHandlers = (topic, pads, items, editor, createItem) => {
  function handleSuggestionsGetOptions (query) {
    const filter = queryFilter(query);
    let insertOptions = filter(items).map(item => ({
      id: item.id,
      label: item.model.getProperty('title') || 'untitled'
    }));

    if (insertOptions.length > 0) {
      insertOptions = [{ subheader: 'Insert items' }, ...insertOptions];
    }

    let createItemOptions = filter(pads).map(pad => ({
      id: `create-${pad.type}`,
      label: `New ${pad.displayName}`,
      create: true,
      type: pad.type
    }));

    if (createItemOptions.length > 0) {
      createItemOptions = [{ subheader: 'Create items' }, ...createItemOptions];
    }

    return [...insertOptions];
    // return [...insertOptions, ...createItemOptions]; // Item creation in suggestions not implemented for the new SDK yet
  }

  async function handleSuggestionsOptionSelect (option, { prosemirrorView }) {
    let item;
    if (option.create) {
      item = await createItem(option.type);
    } else {
      item = items.find(item => item.id === option.id);
    }

    const title = `@${getItemTitle(item)}`;
    const href = `/app/${topic}/${item.id}`;

    const { tr } = prosemirrorView.state;

    editor.insertLink(title, title, href, tr);
    editor.insertText(' ', tr);
    editor.scrollIntoView(tr);

    prosemirrorView.dispatch(tr);
  }

  return {
    handleSuggestionsGetOptions,
    handleSuggestionsOptionSelect
  };
};
