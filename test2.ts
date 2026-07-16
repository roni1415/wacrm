import { getFlowTemplate } from './src/lib/flows/templates';
import { deriveCanvasEdges } from './src/lib/flows/edges';

const template = getFlowTemplate('faq_bot');
const builderNodes = template?.nodes.map(n => ({ ...n, position_x: 0, position_y: 0 })) ?? [];
const edges = deriveCanvasEdges(builderNodes);

console.log('edges:', edges);
