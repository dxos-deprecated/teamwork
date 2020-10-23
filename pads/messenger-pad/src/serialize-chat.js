//
// Copyright 2020 DXOS.org
//

const serializeChat = (item, messages) => {
  console.log();
  return messages.reduce((prev, curr) => {
    const msgHeader = `### ${curr.sender} at ${new Date(parseInt(curr.timestamp)).toLocaleString()}`;
    return prev + `${msgHeader}\n${curr.text}\n\n`;
  }, `# ${item.displayName || 'Chat'} log\n\n`);
};

export default serializeChat;
