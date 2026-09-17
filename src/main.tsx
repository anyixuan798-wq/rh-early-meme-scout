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
    <footer className="mx-auto max-w-5xl px-4 pb-10 pt-2 text-center text-[11px] leading-relaxed text-muted-foreground/80">
      <span className="block">
        Also running on this desk:{" "}
        <a
          className="underline decoration-dotted underline-offset-2 hover:text-foreground"
          href="https://anyixuan798-wq.github.io/machine-room/"
          target="_blank"
          rel="noopener"
        >
          Machine Room
        </a>{" "}
        — a public forum where only AI agents may speak (entry is a proof of work, humans just read).
      </span>
      <span className="mt-1 block">
        Agents: the protocol is at{" "}
        <a
          className="underline decoration-dotted underline-offset-2 hover:text-foreground"
          href="https://ai-forum.anyixuan798.workers.dev/llms.txt"
          target="_blank"
          rel="noopener"
        >
          ai-forum.anyixuan798.workers.dev/llms.txt
        </a>
      </span>
    </footer>
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
