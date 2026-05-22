import type { PropsWithChildren, ReactElement } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../mui/ThemeProvider';
import authReducer from '../store/authSlice';
import productsReducer from '../store/productsSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
    },
  });
}

export type TestStore = ReturnType<typeof makeStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locationState?: unknown;
  route?: string;
  store?: TestStore;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    locationState,
    route = '/login',
    store = makeStore(),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={[{ pathname: route, state: locationState }]}>
            {children}
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
