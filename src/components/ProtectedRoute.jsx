import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function ProtectedRoute({ children }) {
  const { pseudo } = useUser();
  if (!pseudo) return <Navigate to="/" replace />;
  return children;
}

export default ProtectedRoute;
