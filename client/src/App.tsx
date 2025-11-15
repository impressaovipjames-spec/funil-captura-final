import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Captura from "@/pages/captura";
import Confirmacao from "@/pages/confirmacao";
import Entrega from "@/pages/entrega";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Captura} />
      <Route path="/confirmacao" component={Confirmacao} />
      <Route path="/entrega" component={Entrega} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
