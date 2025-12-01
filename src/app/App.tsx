
import { AppRoutes } from "./routes/routes";
import { usePermission } from "../contexts/PermissionsContext";
import { Skeleton } from "@mui/material";
import { Toaster } from "sonner";

function App() {
  const { isLoading } = usePermission();

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      <AppRoutes />
      <Toaster closeButton position="top-right"/>
    </>
  );
}

export default App;
