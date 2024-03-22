import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="mx-auto max-w-1040 px-20">
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default Layout;
