import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell';
import { CollectionProvider } from './lib/collection';
import { CollectionView } from './views/CollectionView';
import { Discover } from './views/Discover';

export function App() {
  return (
    <HashRouter>
      <CollectionProvider>
        <Shell>
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/collection" element={<CollectionView />} />
            <Route path="/tree" element={<Navigate to="/collection" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </CollectionProvider>
    </HashRouter>
  );
}
