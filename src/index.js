import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StoreMe } from 'store-me';
import { generateInitialState, syncKeys } from './_constants/stateMap';
import { routes } from './_constants/routesMap';
import DocumentHeadUpdates from './components/general/DocumentHeadUpdates';

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
