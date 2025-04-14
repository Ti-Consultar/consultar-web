import { toast, ToastContainer } from "react-toastify";
import { AppRoutes } from "./routes/routes";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "../components/Button";

function App() {
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