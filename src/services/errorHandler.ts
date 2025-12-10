import { toast } from "react-toastify";
import type { AxiosError } from "axios";

export const handleCustomErrors = (error: any): void => {
  if (error === "Unauthorized") {
    toast.error("Nemate ovlašćenja za ovu akciju.", {
      position: "top-center",
    });
    return;
  }

  toast.error(error, {
    position: "top-center",
  });
};

export const handleApiError = (error: any): void => {
  const axiosError = error as AxiosError<any>;

  // No server response (network error, CORS issue, timeout)
  if (axiosError.request && !axiosError.response) {
    toast.error("Server nije dostupan. Proverite internet ili API server.", {
      position: "top-center",
    });
    return;
  }

  // Backend responded with a status
  const status = axiosError.response?.status;
  const msg = axiosError.response?.data?.message;

  switch (status) {
    case 400:
      toast.warning(msg || "Nisu poslati validni podaci.", { position: "top-center" });
      break;

    case 401:
      toast.warning(msg || "Niste autorizovani da pristupite ovoj akciji.", { position: "top-center" });
      break;

    case 403:
      toast.error(msg || "Nemate ovlašćenja za ovu akciju.", { position: "top-center" });
      break;

    case 404:
      toast.error(msg || "Traženi podatak nije pronađen.", { position: "top-center" });
      break;

    case 409:
      toast.error(msg || "Podatak već postoji.", { position: "top-center" });
      break;

    case 500:
      toast.error(msg || "Greška na API serveru.", { position: "top-center" });
      break;

    default:
      if (status) {
        toast.error(msg || `API greška: ${status}`, { position: "top-center" });
      } else {
        toast.error("Dogodila se neočekivana greška.", { position: "top-center" });
      }
      break;
  }
};
