import { useEffect, useRef } from 'react';
import Layout      from './components/Layout';
import Sidebar     from './components/Sidebar';
import PreviewSheet from './components/PreviewSheet';
import { track } from './utils/analytics';
import { useRulingStore } from './store/useRulingStore';

export default function App() {
  const svgRef = useRef(null);
  const { paperSize, orientation, gridType } = useRulingStore();

  useEffect(() => {
    track('app_loaded', { paperSize, orientation, gridType });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Sidebar      svgRef={svgRef} />
      <PreviewSheet svgRef={svgRef} />
    </Layout>
  );
}
