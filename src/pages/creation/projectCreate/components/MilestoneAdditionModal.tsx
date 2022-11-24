import { useMutation } from '@apollo/client';
import { CloseIcon } from '@chakra-ui/icons';
import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { AmountInputWithSatoshiToggle } from '../../../../components/molecules';
import { ButtonComponent, TextInputBox } from '../../../../components/ui';
import { colors } from '../../../../constants';
import { MilestoneValidations } from '../../../../constants/validations';
import {
  MUTATION_CREATE_PROJECT_MILESTONE,
  MUTATION_DELETE_PROJECT_MILESTONE,
  MUTATION_UPDATE_PROJECT_MILESTONE,
} from '../../../../graphql/mutations';
import { useBTCConverter } from '../../../../helpers';
import { Satoshis, USDollars } from '../../../../types/types';
import { useNotification } from '../../../../utils';
import { TMilestone } from '../types';

type Props = {
  isOpen: boolean;
  onClose: (newMilestones: TMilestone[]) => void;
  onSubmit: (newMilestones: TMilestone[]) => void;
  availableMilestones: TMilestone[];
  projectId?: number;
};

export const defaultMilestone = {
  name: '',
  projectId: 0,
  description: '',
  amount: 0,
};

export const MilestoneAdditionModal = ({
  isOpen,
  projectId,
  onClose,
  availableMilestones,
  onSubmit,
}: Props) => {
  const { toast } = useNotification();
  const { getUSDCentsAmount, getSatoshisAmount } = useBTCConverter();

  const [_milestones, _setMilestones] =
    useState<TMilestone[]>(availableMilestones);

  const milestones = useRef(_milestones);

  const setMilestones = (value: TMilestone[]) => {
    milestones.current = value;
    _setMilestones(value);
  };

  const [isFormInputUsingSatoshis, setIsFormInputUsingSatoshis] =
    useState(true);

  const [formError, setFormError] = useState<any>([]);

  const handleAddMilestone = () => {
    setMilestones([...milestones.current, defaultMilestone]);
  };

  const getFilteredMilestones = (): TMilestone[] => {
    return milestones.current.filter(
      (milestone: TMilestone) => milestone.amount > 0 && milestone.name,
    );
  };

  const getMutationConvertedMilestoneAmount = (
    amount: Satoshis | USDollars,
  ): Satoshis => {
    return isFormInputUsingSatoshis ? amount : getSatoshisAmount(amount * 100);
  };

  const getFormConvertedMilestoneAmount = (
    satoshiAmount: Satoshis,
  ): Satoshis | USDollars => {
    if (isFormInputUsingSatoshis) {
      return satoshiAmount;
    }

    const usdCentsAmount = getUSDCentsAmount(satoshiAmount);

    // Dollar value rounded to two decimal places
    return Math.round(usdCentsAmount) / 100;
  };

  const handleAmountChange = (newAmount: number, itemIndex: number) => {
    const newMilestone = { ...milestones.current[itemIndex] };

    if (newMilestone) {
      newMilestone.amount = newAmount;

      milestones.current[itemIndex] = newMilestone;
    }

    setFormError([]);
    setMilestones(milestones.current);
  };

  const handleTextChange = (event: any, itemIndex: number) => {
    if (event) {
      const newMilestones = milestones.current.map((milestone, index) => {
        if (index === itemIndex) {
          return { ...milestone, name: event.target.value };
        }

        return milestone;
      });
      setFormError([]);
      setMilestones(newMilestones);
    }
  };

  const handleModalClose = () => {
    const isValid = validateMilestones();

    if (!isValid) {
      onClose(milestones.current);
    }

    onClose(getFilteredMilestones());
  };

  /**
   * TODO: REFACTOR -- This updates all milestones, even unchanged ones.
   * We should refactor it to only update the relevant milestones.
   */
  const handleConfirmMilestone = async () => {
    const isValid = validateMilestones();

    if (!isValid) {
      return;
    }

    const filteredMilestones = getFilteredMilestones();

    try {
      const newMilestones = await Promise.all(
        filteredMilestones.map(async (milestone) => {
          const createMilestoneInput = {
            ...milestone,
            projectId,
          };

          if (milestone.id) {
            await updateMilestone({
              variables: {
                input: {
                  projectMilestoneId: milestone.id,
                  name: milestone.name,
                  description: milestone.description,
                  amount: milestone.amount,
                },
              },
            });

            return milestone;
          }

          const { data } = await createMilestone({
            variables: { input: createMilestoneInput },
          });
          if (data?.createProjectMilestone?.id) {
            return {
              id: data.createProjectMilestone.id,
              ...milestone,
            };
          }

          throw Error('missing id for created project milestone');
        }),
      );
      onSubmit(newMilestones);
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        status: 'error',
      });
    }
  };

  const handleRemoveMilestone = async (itemIndex: number) => {
    const currentMilestone = milestones.current.find(
      (milestone, index) => index === itemIndex,
    );
    const newMilestones = milestones.current.filter(
      (milestone, index) => index !== itemIndex,
    );

    if (currentMilestone && currentMilestone.id) {
      try {
        await removeMilestone({
          variables: { projectMilestoneId: currentMilestone.id },
        });
        setMilestones(newMilestones);
      } catch (error) {
        toast({
          title: 'Something went wrong',
          description: `${error}`,
          status: 'error',
        });
      }
    } else {
      setMilestones(newMilestones);
    }
  };

  const [createMilestone, { loading: createMilestoneLoading }] = useMutation(
    MUTATION_CREATE_PROJECT_MILESTONE,
  );

  const [updateMilestone, { loading: updateMilestoneLoading }] = useMutation(
    MUTATION_UPDATE_PROJECT_MILESTONE,
  );

  const [removeMilestone, { loading: removeMilestoneLoading }] = useMutation(
    MUTATION_DELETE_PROJECT_MILESTONE,
  );

  const validateMilestones = () => {
    let isValid = true;
    const totalErrors: any = [];

    milestones.current.map((milestone) => {
      const errors: any = {};
      if (!milestone.name) {
        errors.name = 'Name is a required field.';
        isValid = false;
      } else if (milestone.name.length > MilestoneValidations.name.maxLength) {
        errors.name = `Name cannot be longer than ${MilestoneValidations.name.maxLength} characters.`;
        isValid = false;
      }

      if (!milestone.amount || milestone.amount < 1) {
        errors.amount = 'Amount needs to be at least 1 satoshi';
        isValid = false;
      }

      if (
        milestone.description &&
        milestone.description.length >
          MilestoneValidations.description.maxLength
      ) {
        errors.description = `Description cannot be longer than ${MilestoneValidations.description.maxLength} characters.`;
        isValid = false;
      }

      totalErrors.push(errors);
    });

    if (!isValid) {
      setFormError(totalErrors);
    }

    return isValid;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent display="flex" alignItems="flex-start" padding="20px 0px">
        <ModalHeader paddingX="20px">
          <Text fontSize="18px" fontWeight={600}>
            Select Milestones
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody width="100%">
          <VStack
            width="100%"
            paddingBottom="20px"
            marginBottom="20px"
            borderBottom="1px solid"
            borderBottomColor={colors.gray300}
            maxHeight="600px"
            overflowY="auto"
            spacing="15px"
          >
            {milestones.current.map((milestone, index) => (
              <VStack
                key={index}
                width="100%"
                alignItems="flex-start"
                paddingX="2px"
              >
                <HStack justifyContent="space-between" width="100%">
                  <Text marginTop="10px" marginBottom="5px">
                    {`Milestone ${index + 1}`}
                  </Text>
                  <ButtonComponent
                    size="xs"
                    padding="7px"
                    rounded="full"
                    onClick={() => handleRemoveMilestone(index)}
                  >
                    <CloseIcon fontSize="10px" />
                  </ButtonComponent>
                </HStack>
                <TextInputBox
                  placeholder={'Enter a Milestone Title'}
                  value={milestone.name}
                  onChange={(event: any) => handleTextChange(event, index)}
                  error={formError[index] && formError[index].name}
                />

                <AmountInputWithSatoshiToggle
                  isUsingSatoshis={isFormInputUsingSatoshis}
                  onUnitTypeChanged={setIsFormInputUsingSatoshis}
                  value={getFormConvertedMilestoneAmount(milestone.amount)}
                  onValueChanged={(newAmount: Satoshis | USDollars) =>
                    handleAmountChange(
                      getMutationConvertedMilestoneAmount(newAmount),
                      index,
                    )
                  }
                  error={formError[index] && formError[index].amount}
                />
              </VStack>
            ))}
          </VStack>
          <VStack spacing="10px">
            <ButtonComponent isFullWidth onClick={handleAddMilestone}>
              Add a Milestone
            </ButtonComponent>
            <ButtonComponent
              isFullWidth
              primary
              isLoading={
                createMilestoneLoading ||
                updateMilestoneLoading ||
                removeMilestoneLoading
              }
              onClick={handleConfirmMilestone}
            >
              Confirm
            </ButtonComponent>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
