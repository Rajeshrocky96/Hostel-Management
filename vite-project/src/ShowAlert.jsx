import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToastAlert = (message, type = "success") => {
  const toastTypes = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
    default: toast
  };

  const toastFn = toastTypes[type] || toastTypes.default;
  toastFn(message, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default showToastAlert;
