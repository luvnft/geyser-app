import { Button, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useRefundFileValue } from '../../../../../../../funding/state'
import { PaymentMethods, usePaymentMethodAtom } from '../states/paymentMethodAtom'

export const PaymentMethodSelection = () => {
  const { t } = useTranslation()
  const [paymentMethod, setPaymentMethod] = usePaymentMethodAtom()

  const refundFile = useRefundFileValue()

  const isLightning = paymentMethod === PaymentMethods.lightning

  console.log('checking refundFile', refundFile)

  return (
    <HStack w="full">
      <Button
        flex={1}
        variant={'secondary'}
        borderColor={isLightning ? 'primary.400' : undefined}
        color={isLightning ? 'primary.400' : undefined}
        onClick={() => setPaymentMethod(PaymentMethods.lightning)}
      >
        {t('Lightning')}
      </Button>
      <Button
        flex={1}
        variant={'secondary'}
        borderColor={!isLightning ? 'primary.400' : undefined}
        color={!isLightning ? 'primary.400' : undefined}
        onClick={() => setPaymentMethod(PaymentMethods.onChain)}
        isDisabled={!refundFile}
      >
        {t('Onchain')}
      </Button>
    </HStack>
  )
}
