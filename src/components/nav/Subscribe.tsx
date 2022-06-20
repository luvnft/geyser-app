import React, { useState } from 'react';
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	Link,
	IconButton,
	HStack,
	VStack,
	Input,
	Box,
	Icon,
} from '@chakra-ui/react';
import { ButtonComponent, TextBox } from '../ui';
import { createCreatorRecord } from '../../api';
import { useNotification, validateEmail, isMobileMode } from '../../utils';
import { FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import { CheckIcon } from '@chakra-ui/icons';
import { GeyserTelegramUrl, GeyserTwitterUrl } from '../../constants';

    interface ISubscribe {
        isOpen?: boolean;
        onClose?: any
				style: string
				interest?: string
    }

export const Subscribe = ({isOpen, onClose, style, interest}:ISubscribe) => {
	const { toast } = useNotification();
	const isMobile = isMobileMode();
	const [submitting, setSubmitting] = useState(false);
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const handleEmail = (event:any) => {
		if (error) {
			setError('');
		}

		setEmail(event.target.value);
	};

	const handleConfirm = async () => {
		const res = validateEmail(email);
		if (!res) {
			setError('Please enter a valid email address.');
			return;
		}

		try {
			setSubmitting(true);
			let records;
			if (interest === 'grants') {
				records = [{
					fields: {
						Email: email,
						Type: [
							'Subscriber',
						],
						fldOWbMeUVrRjXrYu: ['Geyser Grants'],
					},
				}];
			} else {
				records = [{
					fields: {
						Email: email,
						Type: [
							'Subscriber',
						],
					},
				}];
			}

			await createCreatorRecord({records});

			setSubmitting(false);
			setSuccess(true);
			toast({
				title: 'Succesfully subscribed to Geyser',
				status: 'success',
			});
		} catch (error) {
			console.log('checking error', error);
			toast({
				title: 'Something went wrong',
				description: 'Please try again',
				status: 'error',
			});
		}
	};

	const handleClose = () => {
		setSuccess(false);
		setEmail('');
		onClose();
	};

	return (
		<>
			{style === 'button-modal' && isOpen !== undefined && onClose !== undefined
				? <Modal isOpen={isOpen} onClose={handleClose} isCentered>
					<ModalOverlay />
					<ModalContent display="flex" alignItems="center" padding="20px 15px">
						<ModalHeader><Text fontSize="16px" fontWeight={600}>{success ? 'Success!' : 'Subscribe'}</Text></ModalHeader>
						<ModalCloseButton />
						<ModalBody width="100%">
							<VStack spacing="15px" width="100%">
								<Text>
									{success ? 'Thanks for signing up. We’ll be sharing more info about Geyser projects and product soon. To join our community find us on Telegram and Twitter.' : 'To get information on the latest Geyser projects and product, subscribe by dropping your email below.'}
								</Text>
								{!success && <TextBox value={email} placeholder="Contact Email" onChange={handleEmail}/>}
								{error && <Text fontSize={'12px'}>{error}</Text>}
								{success
									&& <HStack>
										<Link href={GeyserTwitterUrl} isExternal>
											<IconButton
												size="sm"
												background={'none'}
												aria-label="twitter"
												icon={<FaTwitter fontSize="20px" />}
												color={'brand.gray500'}
											/>
										</Link>
										<Link href={GeyserTelegramUrl} isExternal>
											<IconButton
												size="sm"
												background={'none'}
												aria-label="telegram"
												icon={<FaTelegramPlane fontSize="20px" />}
												color={'brand.gray500'}
											/>
										</Link>
									</HStack>
								}
								<ButtonComponent isFullWidth primary onClick={success ? handleClose : handleConfirm} disabled={!email} isLoading={submitting}>
									{success ? 'Close' : 'Confirm'}
								</ButtonComponent>
							</VStack>
						</ModalBody>
					</ModalContent>
				</Modal>
				: <VStack>
					<Text fontWeight="bold" fontSize="2xl">{success ? 'Success!' : 'Stay up to date with Geyser Grants'}</Text>
					{success
						&& <Box bg="brand.primary" borderRadius="full" width="75px" height="75px" display="flex" justifyContent="center" alignItems="center">
							<CheckIcon w={7} h={7}/>
						</Box>
					}
					<Text textAlign={isMobile ? 'left' : 'center'} w={isMobile ? '100%' : '400px'}>
						{success ? 'Thanks for signing up. We’ll be sharing more info about Geyser Grants soon.' : 'Get news on recent and upcoming Grants by joining our newsletter or joining our community on Telegram.'}
					</Text>
					{!success
						&& <>
							<HStack>
								<Input focusBorderColor="#20ECC7" type="email" isRequired={true} placeholder="satoshi@geyser.fund" value={email} onChange={handleEmail} />
								<ButtonComponent primary size="md" disabled={!email} onClick={handleConfirm} isLoading={submitting}>Subscribe</ButtonComponent>
							</HStack>
							{error && <Text fontSize={'12px'}>{error}</Text>}
						</>
					}
					<Link href={GeyserTelegramUrl} _hover={{textDecoration: 'none'}} isExternal bg="black" borderRadius="md" py={2} px={3} color="white" fontWeight="bold" display="flex" justifyContent="center" alignItems="center">
						<Icon
							boxSize={8}
							aria-label="telegram"
							as={FaTelegramPlane}
							mr={2}
						/>
					Join us on Telegram
					</Link>
				</VStack>
			}
		</>
	);
};
