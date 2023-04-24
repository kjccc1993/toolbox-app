import * as dotenv from 'dotenv'

//dotenv config
dotenv.config()

export default {
  port: process.env.PORT || 3333,
  toolbox: {
    apiKey: process.env.TOOLBOX_API_KEY,
    baseUrl: process.env.TOOLBOX_BASE_URL,
  },
}
