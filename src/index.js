import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { StoreMe } from 'store-me';

import DocumentHeadUpdates from './components/general/DocumentHeadUpdates';
import { generateInitialState, syncKeys } from './_constants/stateMap';
import { routes } from './_constants/routesMap';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const initialState = generateInitialState(routes);

root.render(
  <BrowserRouter>
    <StoreMe initialState={initialState} syncStateKeys={syncKeys}>
      <DocumentHeadUpdates />

      <App />
    </StoreMe>
  </BrowserRouter>
);
