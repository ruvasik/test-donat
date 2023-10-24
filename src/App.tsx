import React from 'react';

import Donat, {IItem} from './Donat';

const DATA: IItem[] = [
    {
        label: 'Управление гос. финансами',
        value: 19611120.90,
        color: '#3B89F0',
    },
    {
        label: 'Информационное общество',
        value: 4827629.30,
        color: '#1C4AC1',
    },
    {
        label: 'ГП НТР',
        value: 849411.3,
        color: '#ED8D34',
    },
];

function App() {
  return (
    <div className="App">
      <Donat data={DATA} size="medium" />
    </div>
  );
}

export default App;
