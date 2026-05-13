import { useEffect, useRef } from "react";
import { toast } from "sonner";

function AppUpdater() {
  const updateToastId = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    if (!window.electronApp) {
      return;
    }

    const removeUpdaterListener = window.electronApp.onUpdaterEvent((payload) => {
      if (payload.event === "update-available") {
        updateToastId.current = toast.loading("Baixando nova versao do MRP...");
      }

      if (payload.event === "download-progress" && updateToastId.current) {
        toast.loading(`Baixando nova versao do MRP (${payload.percent || 0}%)`, {
          id: updateToastId.current,
        });
      }

      if (payload.event === "update-downloaded") {
        toast.success("Atualizacao pronta para instalar.", {
          id: updateToastId.current,
          duration: Infinity,
          action: {
            label: "Reiniciar",
            onClick: () => {
              window.electronApp?.quitAndInstall();
            },
          },
        });
      }

      if (payload.event === "error" && updateToastId.current) {
        toast.error(payload.message || "Nao foi possivel baixar a atualizacao.", {
          id: updateToastId.current,
        });
      }
    });

    window.electronApp.checkForUpdates().catch(() => undefined);

    return removeUpdaterListener;
  }, []);

  return null;
}

export default AppUpdater;
