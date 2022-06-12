import { Config } from '@/Config'

export const icons = {
  enterprise:
    Config.APP === 'epayz'
      ? require('./client_enterprise-epayz.png')
      : require('./client_enterprise.png'),
  handshake:
    Config.APP === 'epayz'
      ? require('./handshake-epayz.png')
      : require('./handshake.png'),
  'user-group':
    Config.APP === 'epayz'
      ? require('./user-group-epayz.png')
      : require('./user-group.png'),
  'payment-waiting':
    Config.APP === 'epayz'
      ? require('./payment-waiting-epayz.png')
      : require('./payment-waiting.png'),
  'payment-done':
    Config.APP === 'epayz'
      ? require('./payment-done-epayz.png')
      : require('./payment-done.png'),
  settlement:
    Config.APP === 'epayz'
      ? require('./settlement-epayz.png')
      : require('./settlement.png'),
  settled:
    Config.APP === 'epayz'
      ? require('./settled-epayz.png')
      : require('./settled.png'),
  'dollar-circle-outline': require('./dollar-circle-outline.png'),
  'dollar-circle':
    Config.APP === 'epayz'
      ? require('./dollar-circle-epayz.png')
      : require('./dollar-circle.png'),
  kyc: require('./kyc.png'),
}

export type IconTypes = keyof typeof icons
