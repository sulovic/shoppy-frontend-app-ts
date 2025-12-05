import { toast } from "react-toastify";

export const handleApiError: (error: any) => void = (error) => {
  if (error.response?.status === 400) {
    toast.warning("Nisu poslati podaci za upis.", {
      position: "top-center",
    });
  } else if (error.response?.status === 401) {
    toast.warning("Niste autorizovani da posetite ovu stranu.", {
      position: "top-center",
    });
  } else if (error.response?.status === 403) {
    toast.error("Nemate ovlašćenja da izvršite ovu akciju.", {
      position: "top-center",
    });
  } else if (error.response?.status === 404) {
    toast.error("Traženi podatak nije pronađen.", {
      position: "top-center",
    });
  } else if (error.response?.status === 500) {
    toast.error("Greška na API serveru.", {
      position: "top-center",
    });
  } else if (error.response?.status === 409) {
    toast.error("Podatak nije dodat! Ovaj podatak već postoji.", {
      position: "top-center",
    });
  } else if (error.response) {
    toast.error(`API Error: ${error?.response?.status}`, {
      position: "top-center",
    });
  } else if (error.request) {
    toast.error("Error: No response received from server. Please check your server or internet connection.", {
      position: "top-center",
    });
  } else {
    toast.error(`Unexpected Error: Please try again later.`, {
      position: "top-center",
    });
  }
};
