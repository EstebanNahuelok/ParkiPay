import { createBrowserRouter } from 'react-router-dom';
import { ParkingProvider } from '../context/ParkingContext';

// Permisionario
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

// Conductor
import Escanear from '../screens/Escanear';
import Confirmar from '../screens/Confirmar';
import Pagar from '../screens/Pagar';
import Ticket from '../screens/Ticket';

function ConductorApp({ children }) {
    return (
        <ParkingProvider>
            <div className="app-container">{children}</div>
        </ParkingProvider>
    );
}

const router = createBrowserRouter([
    // ── Conductor (app de pago del estacionamiento) ──
    {
        path: '/',
        element: <ConductorApp><Escanear /></ConductorApp>,
    },
    {
        path: '/confirmar',
        element: <ConductorApp><Confirmar /></ConductorApp>,
    },
    {
        path: '/pagar',
        element: <ConductorApp><Pagar /></ConductorApp>,
    },
    {
        path: '/ticket',
        element: <ConductorApp><Ticket /></ConductorApp>,
    },

    // ── Permisionario (app del inspector/cobrador) ──
    {
        path: '/home',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
    {
        path: '/login',
        element: <Auth />,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },

    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;
