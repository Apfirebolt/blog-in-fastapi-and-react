import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';

// AG Grid module registration
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

import { store } from './app/store.ts';
import './index.css'
import App from './App.tsx'

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
