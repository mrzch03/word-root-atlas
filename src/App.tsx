import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell';
import { CollectionProvider } from './lib/collection';
import { CollectionView } from './views/CollectionView';
import { Discover } from './views/Discover';

const TreeView = lazy(() => import('./views/TreeView'));

export function App() {
  return (
    <HashRouter>
      <CollectionProvider>
        <Shell>
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route
              path="/tree"
              element={
                <Suspense fallback={<p className="stage-wait">打开词根之树…</p>}>
                  <TreeView />
                </Suspense>
              }
            />
            <Route path="/collection" element={<CollectionView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </CollectionProvider>
    </HashRouter>
  );
}
