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
      <Route path="/charts" component={() => <Redirect to="/charts/weekly" />} />
      {/* K-STAR CHART */}
      <Route path="/charts/weekly" component={SongChart} />
      <Route path="/charts/weekly/:date" component={SongChart} />
      <Route path="/charts/monthly" component={SongChart} />
      <Route path="/charts/season" component={SongChart} />
      <Route path="/charts/year-end" component={SongChart} />
      {/* Legacy routes - redirect to new paths */}
      <Route path="/charts/songs" component={() => <Redirect to="/charts/weekly" />} />
      <Route path="/charts/songs/:date" component={SongChart} />
      <Route path="/charts/albums" component={AlbumChart} />
      <Route path="/charts/albums/:date" component={AlbumChart} />
      <Route path="/charts/artists" component={ArtistChart} />
      <Route path="/charts/artists/:date" component={ArtistChart} />
      {/* K-STAR ARTIST CHART */}
      <Route path="/charts/artist/rookie" component={ArtistChart} />
      <Route path="/charts/artist/solo" component={ArtistChart} />
      <Route path="/charts/artist/group" component={ArtistChart} />
      <Route path="/charts/artist/icon" component={ArtistChart} />
      <Route path="/charts/artist/global" component={ArtistChart} />
      {/* GLOBAL CHAMP CHART */}
      <Route path="/charts/global/mv" component={SongChart} />
      <Route path="/charts/global/hot-mv" component={SongChart} />
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
