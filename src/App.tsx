import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout';
import NotFound from './404';
import LoginPage from './page/login-page';
import LoggedInPage from './page/logged-in-page';
import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: 'logged',
        element: <LoggedInPage />,
      },
    ],
  },
]);

function App() {
  return (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
