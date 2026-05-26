import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
}

const ProtectedRoute = ({
  children,
}: Props) => {

  const token =
    localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {

    const decoded =
      jwtDecode<DecodedToken>(
        token
      );

    const currentTime =
      Date.now() / 1000;

    if (decoded.exp < currentTime) {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      return (
        <Navigate to="/login" replace />
      );
    }

    return children;

  } catch {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    return (
      <Navigate to="/login" replace />
    );
  }
};

export default ProtectedRoute;