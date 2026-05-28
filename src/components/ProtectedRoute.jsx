import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

/**
 * Route protégée : redirige vers l'accueil si aucun pseudo n'est défini.
 */
export default function ProtectedRoute({ children }) {
  const { pseudo } = useUser();

  if (!pseudo) {
    return <Navigate to="/" replace />;
  }

  return children;
}
