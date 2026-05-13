
import { AppRoutes } from "./routes/routes";
import { usePermission } from "../contexts/PermissionsContext";
import { Skeleton } from "@mui/material";
import { Toaster } from "sonner";
import AppUpdater from "../components/AppUpdater";

function App() {
  const { isLoading } = usePermission();

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      <AppRoutes />
      <AppUpdater />
      <Toaster closeButton position="top-right"/>
    </>
  );
}

export default App;
