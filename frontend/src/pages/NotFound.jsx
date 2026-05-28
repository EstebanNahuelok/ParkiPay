import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#080B11] text-white font-sans flex flex-col items-center justify-center gap-4 p-4">
            <h1 className="text-6xl font-bold text-gray-500">404</h1>
            <p className="text-lg text-gray-400">Pagina no encontrada</p>
            <Link
                to="/"
                className="bg-gradient-to-r from-[#1D9E75] to-[#15803d] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
