import {
  clickContribute,
  clickCopyLightningInvoiceButton,
  clickCopyOnChainButton,
  clickOnchainQrTab,
  enterAmountAndHitCheckout,
  enterCommentAndHitCheckout,
  enterRefundAddressAndClickRefund,
} from '../actions/funding'
import {
  commentScreenIsVisible,
  fundingAmountScreenIsVisible,
  lightningQrScreenIsVisible,
  onChainQrScreenIsVisible,
  onChainTransactionProcessingScreenIsVisible,
  refundInitiatedScreenIsVisible,
  successScreenIsVisible,
  transactionFailedScreenIsVisible,
} from '../assertions/funding'
import { MINE_BLOCK_ADDRESS } from '../contants'
import { mineBlockOptions, payLightningInvoice, payOnChainOptions } from '../utils/lncli'

const ONCHAIN_FUNDING_AMOUNT = 60000
const LIGHTNING_FUNDING_AMOUNT = 50
const FUNDING_COMMENT = 'This was the test comment'

export const testLightningSuccessFlow = () => {
  clickContribute()
  fundingAmountScreenIsVisible()

  enterAmountAndHitCheckout(LIGHTNING_FUNDING_AMOUNT)
  commentScreenIsVisible()

  enterCommentAndHitCheckout(FUNDING_COMMENT)
  lightningQrScreenIsVisible()

  clickCopyLightningInvoiceButton()

  cy.get('@copy')
    .its('lastCall.args.0')
    .then((value) => {
      const payLightningOptions = payLightningInvoice(value)
      cy.request(payLightningOptions).then(() => {
        successScreenIsVisible()
      })
    })
}

export const onChainSuccessFlow = () => {
  clickContribute()
  fundingAmountScreenIsVisible()

  enterAmountAndHitCheckout(ONCHAIN_FUNDING_AMOUNT)
  commentScreenIsVisible()

  enterCommentAndHitCheckout(FUNDING_COMMENT)
  lightningQrScreenIsVisible()

  clickOnchainQrTab()
  onChainQrScreenIsVisible()

  clickCopyOnChainButton()

  cy.get('@copy')
    .its('lastCall.args.0')
    .then((value) => {
      const onChainAddress = value.split(':')[1].split('?')[0]
      const payOnchain = payOnChainOptions(onChainAddress, ONCHAIN_FUNDING_AMOUNT)
      cy.request(payOnchain).then((response) => {
        onChainTransactionProcessingScreenIsVisible()

        const mineBlock = mineBlockOptions()
        cy.request(mineBlock).then(() => {
          successScreenIsVisible()
        })
      })
    })
}

export const onChainRefundFlow = () => {
  clickContribute()
  fundingAmountScreenIsVisible()

  enterAmountAndHitCheckout(ONCHAIN_FUNDING_AMOUNT)
  commentScreenIsVisible()

  enterCommentAndHitCheckout(FUNDING_COMMENT)
  lightningQrScreenIsVisible()

  clickOnchainQrTab()
  onChainQrScreenIsVisible()

  clickCopyOnChainButton()

  cy.get('@copy')
    .its('lastCall.args.0')
    .then((value) => {
      const onChainAddress = value.split(':')[1].split('?')[0]
      const payOnchain = payOnChainOptions(onChainAddress, ONCHAIN_FUNDING_AMOUNT - 1000)
      cy.request(payOnchain).then((response) => {
        transactionFailedScreenIsVisible()

        enterRefundAddressAndClickRefund(MINE_BLOCK_ADDRESS)

        refundInitiatedScreenIsVisible()
      })
    })
}
