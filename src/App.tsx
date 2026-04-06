import { Navigate, Route, Routes } from "react-router-dom";
import { AppShellLayout } from "./components/AppShellLayout";
import { defaultExperimentId } from "./config/projects";
import { ExperimentPage } from "./pages/ExperimentPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route path="/" element={<Navigate to={`/e/${defaultExperimentId}`} replace />} />
        <Route path="/e/:experimentId" element={<ExperimentPage />} />
      </Route>
    </Routes>
  );
}
