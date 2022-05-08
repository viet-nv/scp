export const icons = {
  enterprise: require('./client_enterprise.png'),
  handshake: require('./handshake.png'),
  'user-group': require('./user-group.png'),
  'payment-waiting': require('./payment-waiting.png'),
  'payment-done': require('./payment-done.png'),
  settlement: require('./settlement.png'),
  settled: require('./settled.png'),
  'dollar-circle-outline': require('./dollar-circle-outline.png'),
  'dollar-circle': require('./dollar-circle.png'),
}

export type IconTypes = keyof typeof icons
