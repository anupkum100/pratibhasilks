import { useAuth } from "../../contexts/AuthContexts";

export default function PermissionRenderer({ children }) {
    const { isAdmin } = useAuth();

    if (!isAdmin) return null;

    return <>{children}</>;
}