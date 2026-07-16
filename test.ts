import { getFlowTemplate } from './src/lib/flows/templates';
import { validateFlowForActivation } from './src/lib/flows/validate';

const template = getFlowTemplate('faq_bot');
const issues = validateFlowForActivation(
  {
    name: template.name,
    trigger_type: template.trigger_type,
    trigger_config: template.trigger_config,
    entry_node_id: template.entry_node_id
  },
  template.nodes
);

console.log(JSON.stringify(issues, null, 2));
