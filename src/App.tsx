import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Nav } from "./components/Nav";
import { CaseStageProvider, useCaseStage } from "./state/caseStage";
import { CaseStageOverlay } from "./components/CaseStageOverlay";
import { TrailerProvider } from "./components/TrailerModal";
import { StoreProvider } from "./state/store";

import Home from "./pages/Home";
import Archive from "./pages/Archive";
import FilmReader from "./pages/FilmReader";
import StudyEntry from "./pages/StudyEntry";
import StudyReport from "./pages/StudyReport";
import SceneAnatomy from "./pages/SceneAnatomy";
import StudyBySkill from "./pages/StudyBySkill";
import Notebook from "./pages/Notebook";
import Create from "./pages/Create";
import Tracker from "./pages/Tracker";
import StudyPathPage from "./pages/StudyPathPage";
import SearchPage from "./pages/SearchPage";
import Profile from "./pages/Profile";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// A route change is a real page navigation, not a case-to-case transition —
// so any open case stage should close immediately (no animation) rather than
// stay mounted on top of whatever page we've navigated to.
function CloseStageOnNavigate() {
  const { pathname, search } = useLocation();
  const { stage, closeImmediate } = useCaseStage();
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (stage.slug) closeImmediate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <StoreProvider>
      <TrailerProvider>
        <CaseStageProvider>
          <div className="grain-overlay" aria-hidden="true" />
          <ScrollToTop />
          <CloseStageOnNavigate />
          <Nav />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/film/:slug" element={<FilmReader />} />
              <Route path="/study/:slug" element={<StudyEntry />} />
              <Route path="/study/:slug/report" element={<StudyReport />} />
              <Route path="/scenes/:slug" element={<SceneAnatomy />} />
              <Route path="/skills" element={<StudyBySkill />} />
              <Route path="/skills/:slug" element={<StudyBySkill />} />
              <Route path="/notebook" element={<Notebook />} />
              <Route path="/create" element={<Create />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/path" element={<StudyPathPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <footer className="border-t border-line py-9 text-ivory-faint text-sm">
            <div className="max-w-[1180px] mx-auto px-5 md:px-10 flex justify-between flex-wrap gap-2">
              <span>StoryLens — a working frontend prototype. Backend, auth, and real AI analysis are mocked.</span>
              <span>Full clickable prototype build</span>
            </div>
          </footer>
          <CaseStageOverlay />
        </CaseStageProvider>
      </TrailerProvider>
    </StoreProvider>
  );
}
