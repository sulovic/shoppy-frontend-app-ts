import { toast } from "react-toastify";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const OpenFileButton = ({ filePath, buttonText }: { filePath: string; buttonText: string }) => {
  const axiosPrivate = useAxiosPrivate();

  const handleOpen = async () => {
    try {
      const response = await axiosPrivate.get(`files/${filePath}`, {
        responseType: "blob",
      });

      const contentType = response.headers["content-type"] || "application/octet-stream";
      const isImage = contentType.startsWith("image/");

      const blob = new Blob([response.data], { type: contentType });
      const objectUrl = URL.createObjectURL(blob);

      const fileName = filePath.split("/").pop() ?? "file";

      const newWindow = window.open();
      if (!newWindow) {
        toast.error("Popup blokiran. Dozvolite popup prozore.", {
          position: "top-center",
        });
        return;
      }

      if (isImage) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${fileName}</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: #111;
                }
                img {
                  max-width: 100%;
                  max-height: 100vh;
                }
              </style>
            </head>
            <body>
              <img src="${objectUrl}" alt="${fileName}" />
            </body>
          </html>
        `);
      } else {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Preuzimanje</title>
            </head>
            <body>
              <p>Preuzimanje datoteke...</p>
              <a id="download" href="${objectUrl}" download="${fileName}"></a>
              <script>
                document.getElementById("download").click();
              </script>
            </body>
          </html>
        `);
      }

      newWindow.addEventListener("beforeunload", () => {
        URL.revokeObjectURL(objectUrl);
      });
    } catch {
      toast.error("Greška prilikom otvaranja datoteke", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <button type="button" onClick={handleOpen} className="button button-sky">
        {buttonText ?? "Pogledaj"}
      </button>
    </>
  );
};

export default OpenFileButton;
