import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import EvaluationPage from './pages/EvaluationPage';

function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/evaluate/:answersheetId" element={<EvaluationPage />} />
            </Routes>
        </div>
    );
}

export default App;
