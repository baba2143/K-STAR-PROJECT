import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SongChart from "./pages/charts/SongChart";
import AlbumChart from "./pages/charts/AlbumChart";
import ArtistChart from "./pages/charts/ArtistChart";
import ChartArchive from "./pages/charts/ChartArchive";
import ArtistDetail from "./pages/ArtistDetail";
import SongDetail from "./pages/SongDetail";
import AlbumDetail from "./pages/AlbumDetail";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Chart Routes */}
      <Route path="/charts/archive" component={ChartArchive} />
      <Route path="/charts" component={() => <Redirect to="/charts/songs" />} />
      <Route path="/charts/songs" component={SongChart} />
      <Route path="/charts/songs/:date" component={SongChart} />
      <Route path="/charts/albums" component={AlbumChart} />
      <Route path="/charts/albums/:date" component={AlbumChart} />
      <Route path="/charts/artists" component={ArtistChart} />
      <Route path="/charts/artists/:date" component={ArtistChart} />
      {/* Detail Routes */}
      <Route path="/artists/:id" component={ArtistDetail} />
      <Route path="/songs/:id" component={SongDetail} />
      <Route path="/albums/:id" component={AlbumDetail} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
