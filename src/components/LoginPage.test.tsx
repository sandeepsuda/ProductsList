import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { setAuth } from '../store/authSlice';
import { makeStore, renderWithProviders } from '../test/renderWithProviders';
import LoginPage from './LoginPage';

const mockNavigate = vi.fn();
const fetchMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function createJsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 200,
    ...init,
  });
}

function createDeferredResponse() {
  let resolve!: (value: Response) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<Response>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, reject, resolve };
}

beforeEach(() => {
  mockNavigate.mockReset();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('LoginPage', () => {
  it('renders the login form with submit disabled by default', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByLabelText(/username/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });

  it('enables submit after both credentials are entered', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username/i, { selector: 'input' });
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'password123');

    expect(submitButton).toBeEnabled();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    const passwordInput = screen.getByLabelText(/password/i, {
      selector: 'input',
    }) as HTMLInputElement;

    expect(passwordInput.type).toBe('password');

    await user.click(screen.getByRole('button', { name: /toggle password visibility/i }));

    expect(passwordInput.type).toBe('text');
  });

  it('submits credentials and redirects to the default route on success', async () => {
    const user = userEvent.setup();
    const store = makeStore();

    fetchMock.mockResolvedValueOnce(
      createJsonResponse({
        message: 'Login successful',
        user: { username: 'admin' },
      }),
    );

    renderWithProviders(<LoginPage />, { store });

    await user.type(screen.getByLabelText(/username/i, { selector: 'input' }), 'admin');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username: 'admin', password: 'password123' }),
      });
    });

    await waitFor(() => {
      expect(store.getState().auth).toMatchObject({
        isAuthenticated: true,
        user: { username: 'admin' },
      });
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('redirects to the original route after a successful login', async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValueOnce(
      createJsonResponse({
        message: 'Login successful',
        user: { username: 'admin' },
      }),
    );

    renderWithProviders(<LoginPage />, {
      locationState: { from: { pathname: '/about' } },
    });

    await user.type(screen.getByLabelText(/username/i, { selector: 'input' }), 'admin');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/about', { replace: true });
    });
  });

  it('shows the server error when credentials are rejected', async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValueOnce(
      createJsonResponse(
        { error: 'Invalid username or password' },
        { status: 401 },
      ),
    );

    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/username/i, { selector: 'input' }), 'admin');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Invalid username or password')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows a network error when the login request fails', async () => {
    const user = userEvent.setup();

    fetchMock.mockRejectedValueOnce(new Error('Network down'));

    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/username/i, { selector: 'input' }), 'admin');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Network down')).toBeInTheDocument();
  });

  it('disables the form and shows a spinner while the request is pending', async () => {
    const user = userEvent.setup();
    const deferred = createDeferredResponse();

    fetchMock.mockReturnValueOnce(deferred.promise);

    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username/i, { selector: 'input' });
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    deferred.resolve(
      createJsonResponse({
        message: 'Login successful',
        user: { username: 'admin' },
      }),
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('redirects immediately when the user is already authenticated', async () => {
    const store = makeStore();
    store.dispatch(setAuth({ isAuthenticated: true, user: { username: 'admin' } }));

    renderWithProviders(<LoginPage />, { store });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
