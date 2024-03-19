import type { Preview } from '@storybook/react'
import {theme} from '../src/config/theme/theme'
import { lightModeColors } from '../src/styles'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    chakra: {
      theme: {...theme, colors: lightModeColors},
    }
  },
}

export default preview
