import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { ZodError } from "zod";

export const handleCustomErrors = (error: ZodError | unknown) => {
  console.log("Custom error received:", error);
  if (error instanceof ZodError) {
    toast.error(error.issues[0].message, {
      position: "top-center",
    });
    return;
  }
  if (error === "Unauthorized") {
    toast.error("Nemate ovlašćenja za ovu akciju.", {
      position: "top-center",
    });
    return;
  }

  toast.error(`Greška, ${error}`, {
    position: "top-center",
  });
};

export const handleApiError = (error: AxiosError) => {
  // No server response (network error, CORS issue, timeout)
  if (error.request && !error.response) {
    toast.error("Server nije dostupan. Proverite internet ili API server.", {
      position: "top-center",
    });
    return;
  }

  // Backend responded with a status
  const status = error.response?.status;
  const message = error.response?.data as string;

  switch (status) {
    case 400:
      toast.warning(message || "Nisu poslati validni podaci.", { position: "top-center" });
      break;

    case 401:
      toast.warning(message || "Niste autorizovani da pristupite ovoj akciji.", { position: "top-center" });
      break;

    case 403:
      toast.error(message || "Nemate ovlašćenja za ovu akciju.", { position: "top-center" });
      break;

    case 404:
      toast.error(message || "Traženi podatak nije pronađen.", { position: "top-center" });
      break;

    case 409:
      toast.error(message || "Podatak već postoji.", { position: "top-center" });
      break;

    case 500:
      toast.error(message || "Greška na API serveru.", { position: "top-center" });
      break;

    default:
      if (status) {
        toast.error(message || `API greška: ${status}, greška: ${message}`, { position: "top-center" });
      } else {
        toast.error("Dogodila se neočekivana greška.", { position: "top-center" });
      }
      break;
  }
};
