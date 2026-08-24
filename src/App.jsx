import { useRef } from 'react';
import Layout      from './components/Layout';
import Sidebar     from './components/Sidebar';
import PreviewSheet from './components/PreviewSheet';

export default function App() {
  const svgRef = useRef(null);

  return (
    <Layout>
      <Sidebar      svgRef={svgRef} />
      <PreviewSheet svgRef={svgRef} />
    </Layout>
  );
}
