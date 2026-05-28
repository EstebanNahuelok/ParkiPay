import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            }
        ],
    },
    {
        path: "/login",
        element: <Auth />
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        )
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
