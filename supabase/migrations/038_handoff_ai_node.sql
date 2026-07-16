-- Migration 038: Add handoff_ai to flow_nodes and flow_run_events

-- 1. Update flow_nodes.node_type constraint
ALTER TABLE flow_nodes DROP CONSTRAINT IF EXISTS flow_nodes_node_type_check;
ALTER TABLE flow_nodes ADD CONSTRAINT flow_nodes_node_type_check CHECK (node_type IN (
  'start',
  'send_buttons',
  'send_list',
  'send_message',
  'collect_input',
  'condition',
  'set_tag',
  'handoff',
  'handoff_ai',
  'http_fetch',
  'end'
));

-- 2. Update flow_run_events.event_type constraint
ALTER TABLE flow_run_events DROP CONSTRAINT IF EXISTS flow_run_events_event_type_check;
ALTER TABLE flow_run_events ADD CONSTRAINT flow_run_events_event_type_check CHECK (event_type IN (
  'started',
  'node_entered',
  'message_sent',
  'reply_received',
  'fallback_fired',
  'handed_off',
  'handoff',
  'handoff_ai',
  'timeout',
  'error',
  'completed'
));
