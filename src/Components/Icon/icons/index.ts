export const icons = {
  enterprise: require('./client_enterprise.png'),
  handshake: require('./handshake.png'),
  'user-group': require('./user-group.png'),
  'payment-waiting': require('./payment-waiting.png'),
  'payment-done': require('./payment-done.png'),
  settlement: require('./settlement.png'),
  settled: require('./settled.png'),
}

export type IconTypes = keyof typeof icons
