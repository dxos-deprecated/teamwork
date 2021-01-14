//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Generate using faker (see echo-demo tests).

export const exampleUsername = 'Alice';
export const examplePadName = 'Alice\'s pad';

export const exampleColumns = [
  { headerName: 'protagonist', columnType: 'checkbox' },
  { headerName: 'lastName', columnType: 'text' },
  { headerName: 'firstName', columnType: 'text' },
  { headerName: 'age', columnType: 'text' }
];

export const exampleRows = [
  { lastName: 'Snow', firstName: 'Jon', age: 35, protagonist: true },
  { lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { lastName: 'Stark', firstName: 'Arya', age: 16, protagonist: true },
  { lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { lastName: 'Melisandre', firstName: null, age: 150 },
  { lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { lastName: 'Roxie', firstName: 'Harvey', age: 65 }
];
