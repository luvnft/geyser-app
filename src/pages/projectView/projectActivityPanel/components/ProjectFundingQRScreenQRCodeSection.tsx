import {
  Box,
  Button,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BiRefresh } from 'react-icons/bi'
import { BsExclamationCircle } from 'react-icons/bs'
import { FaBitcoin, FaCopy } from 'react-icons/fa'
import { IoMdRefresh } from 'react-icons/io'
import { RiLinkUnlink } from 'react-icons/ri'
import { QRCode } from 'react-qrcode-logo'

import LogoPrimary from '../../../../assets/logo-brand.svg'
import LogoDark from '../../../../assets/logo-dark.svg'
import { Body2 } from '../../../../components/typography'
import Loader from '../../../../components/ui/Loader'
import { UseFundingFlowReturn } from '../../../../hooks'
import { colors } from '../../../../styles'
import {
  FundingStatus,
  InvoiceStatus,
} from '../../../../types/generated/graphql'

type Props = {
  fundingFlow: UseFundingFlowReturn
}

enum QRDisplayState {
  REFRESHING = 'REFRESHING',

  AWAITING_PAYMENT = 'AWAITING_PAYMENT',

  AWAITING_PAYMENT_WEB_LN = 'AWAITING_PAYMENT_WEB_LN',

  INVOICE_CANCELLED = 'INVOICE_CANCELLED',

  FUNDING_CANCELED = 'FUNDING_CANCELED',
}

const FundingErrorView = ({ error }: { error?: string }) => {
  return (
    <VStack
      height={248}
      width={252}
      spacing="10px"
      padding={3}
      backgroundColor={'brand.bgLightRed'}
      justifyContent="center"
      borderRadius={'md'}
    >
      <BsExclamationCircle fontSize={'2em'} />
      <Body2 bold>Funding failed</Body2>
      {error && <Body2 fontSize="12px">{`Error: ${error}`}</Body2>}
    </VStack>
  )
}

const InvoiceErrorView = ({
  onRefreshSelected,
}: {
  onRefreshSelected: () => void
}) => {
  return (
    <VStack
      height={248}
      width={252}
      spacing="10px"
      padding={3}
      backgroundColor={'brand.primary100'}
      justifyContent="center"
      borderRadius={'md'}
    >
      <BsExclamationCircle fontSize={'2em'} />

      <Body2 bold>Invoice was cancelled or expired.</Body2>
      <Body2>Click refresh to try again</Body2>

      <Button
        leftIcon={<BiRefresh fontSize={'2em'} />}
        iconSpacing={2}
        backgroundColor={'brand.bgWhite'}
        textTransform={'uppercase'}
        onClick={onRefreshSelected}
        borderRadius={'full'}
        fontSize={'10px'}
      >
        Refresh
      </Button>
    </VStack>
  )
}

export const ProjectFundingQRScreenQRCodeSection = ({ fundingFlow }: Props) => {
  const [hasCopiedLightning, setHasCopiedLightning] = useState(false)
  const [hasCopiedOnchain, setHasCopiedOnchain] = useState(false)

  const [lightningAddress, setLightningAddress] = useState<string>('')
  const [onchainAddress, setOnchainAddress] = useState<string>('')
  const [fallbackAddress, setFallbackAddress] = useState<string>('')

  const {
    fundingTx,
    fundingRequestErrored,
    refreshFundingInvoice,
    invoiceRefreshErrored,
    invoiceRefreshLoading,
    fundingRequestLoading,
    hasWebLN,
    weblnErrored,
    error,
  } = fundingFlow

  const qrDisplayState = useMemo(() => {
    if (invoiceRefreshLoading || fundingRequestLoading) {
      return QRDisplayState.REFRESHING
    }

    if (fundingRequestErrored || fundingTx.status === FundingStatus.Canceled) {
      return QRDisplayState.FUNDING_CANCELED
    }

    if (
      fundingTx.invoiceStatus === InvoiceStatus.Canceled ||
      invoiceRefreshErrored
    ) {
      return QRDisplayState.INVOICE_CANCELLED
    }

    if (hasWebLN && !weblnErrored) {
      return QRDisplayState.AWAITING_PAYMENT_WEB_LN
    }

    return QRDisplayState.AWAITING_PAYMENT
  }, [
    invoiceRefreshLoading,
    fundingRequestLoading,
    fundingRequestErrored,
    fundingTx.status,
    fundingTx.invoiceStatus,
    invoiceRefreshErrored,
    hasWebLN,
    weblnErrored,
  ])

  useEffect(() => {
    const { id, paymentRequest, address, amount } = fundingTx

    if (id === 0) {
      return setFallbackAddress('')
    }

    const btcAmount = amount / 10 ** 8

    setOnchainAddress(address || '')
    setLightningAddress(paymentRequest || '')

    // If no on-chain address could be generated, only show the payment request
    if (!address) {
      return setFallbackAddress(paymentRequest || '')
    }

    // If no payment request could be generated, only show the on-chain option
    if (!paymentRequest) {
      return setFallbackAddress(`bitcoin:${address}?amount=${btcAmount}`)
    }

    setFallbackAddress(
      `bitcoin:${address}?amount=${btcAmount}&lightning=${paymentRequest}`,
    )
  }, [
    fundingTx,
    fundingTx.paymentRequest,
    fundingTx.address,
    refreshFundingInvoice,
  ])

  const onCopyLightning = useCallback(() => {
    navigator.clipboard.writeText(lightningAddress)
    setHasCopiedLightning(true)
    setTimeout(() => {
      setHasCopiedLightning(false)
    }, 500)
  }, [lightningAddress])

  const onCopyOnchain = useCallback(() => {
    navigator.clipboard.writeText(onchainAddress)
    setHasCopiedOnchain(true)
    setTimeout(() => {
      setHasCopiedOnchain(false)
    }, 500)
  }, [onchainAddress])

  const PaymentRequestCopyButton = useCallback(() => {
    return (
      <HStack
        width="100%"
        visibility={
          qrDisplayState === QRDisplayState.AWAITING_PAYMENT
            ? 'visible'
            : 'hidden'
        }
      >
        <Button
          leftIcon={hasCopiedLightning ? <RiLinkUnlink /> : <FaCopy />}
          minWidth="50%"
          width="50%"
          onClick={onCopyLightning}
          variant="contained"
        >
          <Text>{hasCopiedLightning ? 'Copied!' : 'Lightning invoice'}</Text>
        </Button>
        <Button
          leftIcon={hasCopiedOnchain ? <RiLinkUnlink /> : <FaCopy />}
          minWidth="50%"
          width="50%"
          onClick={onCopyOnchain}
          variant="contained"
        >
          <Text>{hasCopiedOnchain ? 'Copied!' : 'Onchain invoice'}</Text>
        </Button>
      </HStack>
    )
  }, [
    hasCopiedLightning,
    hasCopiedOnchain,
    onCopyLightning,
    onCopyOnchain,
    qrDisplayState,
  ])

  const renderQrBox = useCallback(() => {
    switch (qrDisplayState) {
      case QRDisplayState.AWAITING_PAYMENT:
        return (
          /* This is setting the ground for using overlapping Grid items. Reasoning: the transition from "copied" to "not
            copied" is not smooth because it takes a few milli-seconds to re-render the logo. The idea would be to 
            render both elements in a Grid, make them overlap and hide one of the two based on the value of "hasCopiedQrCode".
            This way the component is already rendered, and the visual effect is smoother.
          */
          <VStack>
            <Box borderRadius={'4px'} borderWidth={'2px'} padding={'2px'}>
              {hasCopiedLightning || hasCopiedOnchain ? (
                <Box borderColor={colors.primary}>
                  <QRCode
                    value={fallbackAddress}
                    size={208}
                    bgColor={colors.bgWhite}
                    fgColor={colors.primary}
                    qrStyle="dots"
                    logoImage={LogoPrimary}
                    logoHeight={40}
                    logoWidth={40}
                    eyeRadius={2}
                    removeQrCodeBehindLogo={true}
                  />
                </Box>
              ) : (
                <Box borderColor={colors.textBlack}>
                  <QRCode
                    value={fallbackAddress}
                    size={208}
                    bgColor={colors.bgWhite}
                    fgColor={colors.textBlack}
                    qrStyle="dots"
                    logoImage={LogoDark}
                    logoHeight={40}
                    logoWidth={40}
                    eyeRadius={2}
                    removeQrCodeBehindLogo={true}
                  />
                </Box>
              )}
            </Box>
            <Box marginBottom={4} fontSize={'10px'}>
              <HStack spacing={5}>
                <Loader size="md" />
                <Text color={'brand.neutral900'} fontWeight={400}>
                  Waiting for payment...
                </Text>
              </HStack>
            </Box>
          </VStack>
        )

      case QRDisplayState.AWAITING_PAYMENT_WEB_LN:
        return (
          <VStack width={'350px'} height={'335px'} justifyContent={'center'}>
            <VStack>
              <Loader />
              <Text>Awaiting Payment</Text>
            </VStack>
          </VStack>
        )
      case QRDisplayState.INVOICE_CANCELLED:
        return <InvoiceErrorView onRefreshSelected={refreshFundingInvoice} />

      case QRDisplayState.FUNDING_CANCELED:
        return <FundingErrorView error={error} />

      default:
        return <GeneratingInvoice refreshInvoice={refreshFundingInvoice} />
    }
  }, [
    error,
    fallbackAddress,
    hasCopiedLightning,
    hasCopiedOnchain,
    qrDisplayState,
    refreshFundingInvoice,
  ])

  return (
    <VStack spacing={4}>
      <VStack spacing={4}>
        <HStack
          spacing={4}
          display={
            qrDisplayState === QRDisplayState.AWAITING_PAYMENT ? 'flex' : 'none'
          }
        >
          <FaBitcoin fontSize={'120px'} />
          <Text fontSize={'10px'} fontWeight={400}>
            Fund with any on-chain or lightning wallet. If you are paying
            on-chain, make sure to send the exact amount, otherwise it will not
            be displayed. The transaction will be confirmed after 1
            confirmation.
          </Text>
        </HStack>
        {renderQrBox()}
      </VStack>
      <PaymentRequestCopyButton />
    </VStack>
  )
}

export const GeneratingInvoice = ({
  refreshInvoice,
}: {
  refreshInvoice: () => void
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setTimeout(onOpen, 15000)
  }, [])

  const handleRefresh = () => {
    refreshInvoice()
    onClose()
    setTimeout(onOpen, 15000)
  }

  return (
    <VStack width={'350px'} height={'335px'} justifyContent={'center'}>
      <VStack>
        <Loader />
        <Text>Generating Invoice</Text>
      </VStack>

      {isOpen && (
        <VStack>
          <Body2>
            Generating invoice is taking too long, if this continues please
            refresh the invoice.
          </Body2>
          <Button
            variant="primary"
            leftIcon={<IoMdRefresh />}
            onClick={handleRefresh}
          >
            refresh
          </Button>
        </VStack>
      )}
    </VStack>
  )
}
