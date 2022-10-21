import {
  Box,
  CloseButton,
  Divider,
  HStack,
  Text,
  VStack,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  useDisclosure,
  Image,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { SatoshiIconTilted, GifIcon } from '../../../components/icons';
import {
  ButtonComponent,
  SatoshiAmount,
  SectionTitle,
  SelectComponent,
  TextArea,
  TextBox,
} from '../../../components/ui';
import {
  colors,
  MAX_FUNDING_AMOUNT_USD,
  projectTypes,
  SelectCountryOptions,
} from '../../../constants';
import { useFundCalc } from '../../../helpers/fundingCalculation';
import { IFundForm } from '../../../hooks';
import { IProjectReward, IProjectType } from '../../../interfaces';
import { DonationBased, RewardBased } from '../../project/FundForm';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { IGif } from '@giphy/js-types';
import { hasShipping, useNotification } from '../../../utils';
import { ProjectReward } from '../../../types/generated/graphql';

interface IPaymentPageProps {
  isMobile: boolean;
  fundLoading: boolean;
  handleCloseButton: () => void;
  btcRate: number;
  state: IFundForm;
  setTarget: (_: any) => void;
  updateReward: any;
  setState: any;
  handleFund: () => void;
  type: IProjectType;
  rewards?: ProjectReward[];
  name: string;
}

export const PaymentPage = ({
  isMobile,
  fundLoading,
  handleCloseButton,
  btcRate,
  handleFund,
  state,
  setTarget,
  setState,
  updateReward,
  type,
  rewards,
  name,
}: IPaymentPageProps) => {
  const { getShippingCost, getTotalAmount, getRewardsQuantity } =
    useFundCalc(state);
  const [gifSearch, setGifSearch] = useState('bitcoin');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGif, setSelectedGif] = useState<IGif | null>(null);
  const [gifHover, setGifHover] = useState(false);
  const [focus, setFocus] = useState(true);
  const { toast } = useNotification();

  const submit = () => {
    const valid = validateFundingAmount();
    if (valid) {
      handleFund();
    }
  };

  // TODO: remove hardcoded API key
  const gf = new GiphyFetch('AqeIUD33qyHnMwLDSDWP0da9lCSu0LXx');
  const fetchGifs = (offset: number) =>
    gf.search(gifSearch, { offset, sort: 'relevant', limit: 9 });

  const validateFundingAmount = () => {
    if (getTotalAmount('dollar', name) >= MAX_FUNDING_AMOUNT_USD) {
      toast({
        title: `Payment above ${MAX_FUNDING_AMOUNT_USD} is not allowed at the moment.`,
        description:
          'Please update the amount, or contact us for donating a higher amount.',
        status: 'error',
      });
      return false;
    }

    if (getTotalAmount('sats', name) < 1) {
      toast({
        title: 'The payment minimum is 1 satoshi.',
        description: 'Please update the amount.',
        status: 'error',
      });
      return false;
    }

    if (state.rewardsCost && !state.email) {
      toast({
        title: 'Email is a required field when donating for a reward.',
        description: 'Please enter an email.',
        status: 'error',
      });
      return false;
    }

    return true;
  };

  const renderFundForm = () => {
    switch (type) {
      case projectTypes.donation:
        return <DonationBased setState={setState} />;

      case projectTypes.reward:
        return (
          <Box width="100%" overflowY="auto">
            <RewardBased {...{ rewards, setState, updateReward, state }} />
            <Divider
              borderTopWidth="3px"
              borderBottomWidth="0px"
              orientation="horizontal"
              marginTop="0px !important"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const rewardCountString = () => {
    const count = getRewardsQuantity();
    if (count === 0) {
      return '';
    }

    if (count === 1) {
      return '1 reward';
    }

    return `${count} rewards`;
  };

  return (
    <VStack
      padding={isMobile ? '20px 10px' : '20px'}
      // margin="10px 15px"
      spacing="12px"
      width="100%"
      height="100%"
      position="relative"
      alignItems="flex-start"
      backgroundColor="#FFFFFF"
    >
      <CloseButton
        position="absolute"
        right={0}
        top={0}
        _hover={{ bg: 'none' }}
        _active={{ bg: 'none' }}
        onClick={handleCloseButton}
      />
      {renderFundForm()}
      <VStack spacing="5px" width="100%" alignItems="flex-start">
        <SectionTitle>Comment</SectionTitle>
        <Box width="100%" position="relative">
          <TextArea
            pr={16}
            placeholder="Leave a comment and drop a GIF."
            fontSize="14px"
            resize="none"
            value={state.comment}
            maxLength={280}
            name="comment"
            onChange={setTarget}
          />
          {gifHover && selectedGif && (
            <CloseIcon position="absolute" top="31px" right="29px" />
          )}
          {selectedGif ? (
            <Image
              src={`${selectedGif.images.preview_webp.url}`}
              alt="gif"
              width="50px"
              height="50px"
              zIndex="10"
              position="absolute"
              top="3.5"
              right="3"
              cursor="pointer"
              opacity={gifHover ? '0.25' : '1'}
              onMouseEnter={() => {
                setGifHover(true);
              }}
              onMouseLeave={() => {
                setGifHover(false);
              }}
              onClick={() => {
                setSelectedGif(null);
                setGifHover(false);
              }}
            />
          ) : (
            <Button
              zIndex="10"
              position="absolute"
              top="20px"
              right="3"
              bg="none"
              p={0}
              onClick={onOpen}
            >
              <GifIcon />
            </Button>
          )}
        </Box>
        <Modal
          onClose={() => {
            setGifSearch('bitcoin');
            onClose();
          }}
          isOpen={isOpen}
          isCentered
        >
          <ModalOverlay />
          <ModalContent mt={focus && isMobile ? 100 : 0}>
            <ModalBody p={2}>
              <InputGroup mb={2}>
                <InputLeftElement>
                  <SearchIcon />
                </InputLeftElement>
                <Input
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  placeholder="Search"
                  variant="filled"
                  focusBorderColor="brand.primary"
                  bg="#DDFFF8"
                  onChange={(e) => setGifSearch(e.target.value)}
                />
                <ModalCloseButton mt="5px" ml="7px" />
              </InputGroup>
              <Box height="450px" overflow="auto">
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  cursor="pointer"
                >
                  <Grid
                    width={isMobile ? 350 : 400}
                    columns={3}
                    fetchGifs={fetchGifs}
                    noLink={true}
                    hideAttribution={true}
                    key={gifSearch}
                    onGifClick={(gif) => {
                      setSelectedGif(gif);
                      setState('media', gif.images.original.webp);
                      onClose();
                    }}
                  />
                </Box>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
        {state.rewardsCost && hasShipping(name) && (
          <Box width="100%">
            <SelectComponent
              name="shippingDestination"
              fontSize="14px"
              placeholder={
                <Text color={colors.grayPlaceholder}>Delivery Rewards...</Text>
              }
              options={SelectCountryOptions}
              onChange={setState}
              value={SelectCountryOptions.find(
                (val) => val.value === state.shippingDestination,
              )}
            />
          </Box>
        )}
        {state.rewardsCost && (
          <Box width="100%">
            <TextBox
              type="email"
              name="email"
              fontSize="14px"
              placeholder="Contact Email"
              value={state.email}
              onChange={setTarget}
            />
          </Box>
        )}
      </VStack>
      {type === projectTypes.reward && (
        <HStack
          width="100%"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <VStack alignItems="flex-start" spacing="0px">
            <SectionTitle>Total</SectionTitle>
            <SatoshiAmount label="Donation">
              {state.donationAmount + Math.round(state.rewardsCost / btcRate)}
            </SatoshiAmount>
            {state.rewardsCost && (
              <Text>{`Rewards: ${rewardCountString()}`}</Text>
            )}
            {state.rewardsCost && hasShipping(name) && (
              <SatoshiAmount label="Shipping">
                {getShippingCost()}
              </SatoshiAmount>
            )}
          </VStack>
          <VStack alignItems="flex-end" spacing="0px">
            <SatoshiAmount color="#1A1A1A" fontWeight="bold" fontSize="24px">
              {getTotalAmount('sats', name)}
            </SatoshiAmount>
            <Text> {`$${getTotalAmount('dollar', name)}`}</Text>
          </VStack>
        </HStack>
      )}
      <Box width="100%" paddingBottom="10px">
        <ButtonComponent
          isLoading={fundLoading}
          primary
          standard
          leftIcon={<SatoshiIconTilted />}
          width="100%"
          onClick={submit}
        >
          Fund project
        </ButtonComponent>
      </Box>
    </VStack>
  );
};
