export default function PermissionRenderer({ permission, children }) {
    if (!permission) return null;

    return <>{children}</>;
}