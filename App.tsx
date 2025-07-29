
import React from 'react';
import { HashRouter, Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';
import URLShortenerPage from './pages/URLShortenerPage';
import URLStatisticsPage from './pages/URLStatisticsPage';
import Header from './components/Header';
import { LinkIcon, ChartBarIcon, ExclamationTriangleIcon } from './components/icons';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ShortenedURL, ClickDetail } from './types';

const MOCK_LOCATIONS = ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia', 'Berlin, Germany'];
const MOCK_SOURCES = ['Direct', 'Social Media', 'Referral', 'Email'];

const RedirectHandler: React.FC = () => {
    const { shortCode } = useParams<{ shortCode: string }>();
    const navigate = useNavigate();
    const [urls, setUrls] = useLocalStorage<ShortenedURL[]>('shortenedUrls', []);

    React.useEffect(() => {
        if (!shortCode) return;

        const urlData = urls.find(u => u.id === shortCode);

        if (urlData) {
            const isExpired = new Date(urlData.expiresAt) < new Date();
            if (isExpired) {
                navigate(`/not-found/${shortCode}/expired`, { replace: true });
                return;
            }

            const updatedUrls = urls.map(u => {
                if (u.id === shortCode) {
                    const newClick: ClickDetail = {
                        timestamp: new Date().toISOString(),
                        source: MOCK_SOURCES[Math.floor(Math.random() * MOCK_SOURCES.length)],
                        location: MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)],
                    };
                    return { ...u, clicks: u.clicks + 1, clickDetails: [...u.clickDetails, newClick] };
                }
                return u;
            });
            setUrls(updatedUrls);

            window.location.href = urlData.longUrl;
        } else {
            navigate(`/not-found/${shortCode}/invalid`, { replace: true });
        }
    }, [shortCode, urls, setUrls, navigate]);

    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Redirecting...</p>
      </div>
    );
};

const NotFoundPage: React.FC = () => {
    const { reason } = useParams<{ reason: string }>();
    const message = reason === 'expired' ? 'This link has expired.' : 'This link is invalid or does not exist.';

    return (
        <div className="text-center p-8 flex flex-col items-center gap-4 bg-white dark:bg-dark-card rounded-lg shadow-lg max-w-md mx-auto mt-16">
            <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500" />
            <h1 className="text-2xl font-bold">Link Not Found</h1>
            <p className="text-slate-600 dark:text-slate-300">{message}</p>
        </div>
    );
};

const AppContent: React.FC = () => {
    const location = useLocation();
    const isRedirectRoute = location.pathname.split('/').length === 2 && location.pathname.length > 1 && location.pathname !== '/stats';

    if (isRedirectRoute) {
        return <RedirectHandler />;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-6">
                <Routes>
                    <Route path="/" element={<URLShortenerPage />} />
                    <Route path="/stats" element={<URLStatisticsPage />} />
                    <Route path="/not-found/:shortCode/:reason" element={<NotFoundPage />} />
                </Routes>
            </main>
            <footer className="text-center p-4 text-sm text-slate-500 dark:text-slate-400">
                <p>React</p>
            </footer>
        </div>
    );
};


function App() {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
}

export default App;
