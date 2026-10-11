import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import NewSessionPage from './pages/NewSessionPage.jsx'
import PickMoviePage from './pages/PickMoviePage.jsx'
import HandoffPage from './pages/HandoffPage.jsx'
import AnalysisPage from './pages/AnalysisPage.jsx'
import ResultPage from './pages/ResultPage.jsx'
import SessionProvider from './context/SessionProvider.jsx'
import SessionLayout from './components/SessionLayout.jsx'
import RequireStep from './components/RequireStep.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/sessao"
          element={
            <SessionProvider>
              <SessionLayout />
            </SessionProvider>
          }
        >
          <Route index element={<Navigate to="nova" replace />} />
          <Route path="nova" element={<NewSessionPage />} />
          <Route path="pessoa-1" element={<PickMoviePage person={1} />} />
          <Route
            path="passar"
            element={
              <RequireStep needs="first">
                <HandoffPage />
              </RequireStep>
            }
          />
          <Route
            path="pessoa-2"
            element={
              <RequireStep needs="first">
                <PickMoviePage person={2} />
              </RequireStep>
            }
          />
          <Route
            path="analise"
            element={
              <RequireStep needs="both">
                <AnalysisPage />
              </RequireStep>
            }
          />
          <Route
            path="resultado"
            element={
              <RequireStep needs="both">
                <ResultPage />
              </RequireStep>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}