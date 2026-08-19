import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'kmx5m7v5',
    dataset: 'production'
  },
  deployment: {
    appId: 'tg26n8bksjldmbury45xsg7k',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  },
})
