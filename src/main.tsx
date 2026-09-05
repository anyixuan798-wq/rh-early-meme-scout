import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ScoutApp } from "@/components/scout/scout-app";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ScoutApp />
    <Toaster
      theme="dark"
      position="top-center"
      toastOptions={{
        className:
          "bg-popover text-popover-foreground shadow-[0_0_0_1px_rgb(255_255_255_/_10%)]",
      }}
    />
  </QueryClientProvider>,
);
