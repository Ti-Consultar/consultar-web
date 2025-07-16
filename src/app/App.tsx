import { ToastContainer } from "react-toastify";
import { AppRoutes } from "./routes/routes";
import "react-toastify/dist/ReactToastify.css";
import { usePermission } from "../contexts/PermissionsContext";
import { Skeleton } from "@mui/material";

function App() {
  const { isLoading } = usePermission();

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;
