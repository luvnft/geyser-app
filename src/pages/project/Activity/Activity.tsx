import React, { useContext, useEffect, useState } from 'react';
import { ConnectTwitter } from '../../../components/molecules';
import { Card } from '../../../components/ui';
import {
	IFundingTx,
	IProject,
	IProjectFunding,
	EShippingDestination,
	EProjectType,
	IRewardFundingInput,
	IDonationFundingInput,
} from '../../../interfaces';
import { useLazyQuery, useMutation } from '@apollo/client';
import { MUTATION_FUND, MUTATION_FUND_WITH_REWARD } from '../../../graphql';
import { QUERY_GET_FUNDING } from '../../../graphql';
import { SuccessPage } from './SuccessPage';
import { QrPage } from './QrPage';
import { isDarkMode, isMobileMode, useNotification } from '../../../utils';
import { PaymentPage } from './PaymentPage';
import { AuthContext } from '../../../context';
import Loader from '../../../components/ui/Loader';
import { useDisclosure } from '@chakra-ui/react';
import classNames from 'classnames';
import { useStyles } from './styles';
import { InfoPage } from './InfoPage';
import { fundingStages, IFundingStages, stageList } from '../../../constants';
import {useFundState} from '../../../hooks';
import { useBtcContext } from '../../../context/btc';

interface IActivityProps {
	project: IProject
	detailOpen: boolean
	setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const {
	national,
	international,
} = EShippingDestination;

const initialFunding = {
	id: '',
	invoiceId: '',
	status: 'unpaid',
	amount: 0,
	paymentRequest: '',
	address: '',
	canceled: false,
	comment: '',
	paidAt: '',
	onChain: false,
};

let fundInterval: any;

const Activity = ({ project, detailOpen, setDetailOpen }: IActivityProps) => {
	const { user } = useContext(AuthContext);
	const {btcRate} = useBtcContext();
	const { toast } = useNotification();
	const isDark = isDarkMode();
	const isMobile = isMobileMode();

	const [fundState, setFundState] = useState<IFundingStages>(fundingStages.initial);

	const {state, setTarget, setState, updateReward} = useFundState({rewards: project.rewards});

	const [fundingTx, setFundingTx] = useState<IFundingTx>(initialFunding);
	const [fundingTxs, setFundingTxs] = useState<IProjectFunding[]>([]);
	const { isOpen: twitterisOpen, onOpen: twitterOnOpen, onClose: twitterOnClose } = useDisclosure();
	const [fadeStarted, setFadeStarted] = useState(false);

	const classes = useStyles({ isMobile, detailOpen, fadeStarted });
	console.log(`[TODO] add shipping destination to form, possible values:  ${national}, ${international}`);

	const [fundProject, {
		data,
	}] = project.type === EProjectType.reward ? useMutation(MUTATION_FUND_WITH_REWARD) : useMutation(MUTATION_FUND);

	const [getFunding, { data: fundData, loading }] = useLazyQuery(QUERY_GET_FUNDING,
		{
			variables: { fundingTxId: fundingTx.id },
			fetchPolicy: 'network-only',
		},
	);

	useEffect(() => {
		if (project && project.fundingTxs) {
			const unsortedFundingTxs = [...project.fundingTxs];
			if (unsortedFundingTxs.length > 0) {
				unsortedFundingTxs.sort((a, b) => parseInt(b.paidAt, 10) - parseInt(a.paidAt, 10));
				setFundingTxs(unsortedFundingTxs);
			}
		}
	}, [project.fundingTxs]);

	useEffect(() => {
		if (user && user.id) {
			setState('anonymous', false);
		}
	}, [user]);

	useEffect(() => {
		if (!state.anonymous && (!user || !user.id)) {
			twitterOnOpen();
			setState('anonymous', true);
		}
	}, [state.anonymous]);

	useEffect(() => {
		if (fundData && fundData.getFundingTx) {
			if (fundData.getFundingTx.status === 'paid') {
				setFundingTxs([fundData.getFundingTx, ...fundingTxs]);
				clearInterval(fundInterval);
				gotoNextStage();
			}
		}
	}, [fundData]);

	useEffect(() => {
		if (fundState === fundingStages.completed || fundState === fundingStages.canceled) {
			clearInterval(fundInterval);
		}

		if (fundState === fundingStages.started) {
			fundInterval = setInterval(getFunding, 2000);
		}
	}, [fundState]);

	useEffect(() => {
		if (data && data.fund && data.fund.success && fundState !== fundingStages.started) {
			setFundingTx(data.fund.fundingTx);
			gotoNextStage();
		}
	}, [data]);

	const handleFundProject = () => {
		gotoNextStage();
	};

	const handleCloseButton = () => {
		setFundState(fundingStages.initial);
	};

	const handleFund = async () => {
		try {
			// TODO: change the variables to an input of type IFundingInput
			let input;

			if (project.type === EProjectType.reward) {
				const { amount, rewardsCost, rewards, ...formData } = state;
				const rewardsArray = Object.keys(rewards).map(key => ({
					projectRewardId: parseInt(key, 10),
					quantity: rewards[key],
				}));
				input = {
					projectId: Number(project.id),
					...formData,
					rewards: rewardsArray,
					donationAmount: amount,
					rewardsCost: Math.round(rewardsCost / btcRate),
				} as IRewardFundingInput;
			} else {
				const { amount, comment, anonymous } = state;
				input = {
					projectId: Number(project.id),
					amount,
					comment,
					anonymous,
				} as IDonationFundingInput;
			}

			await fundProject({ variables: { input } });
			gotoNextStage();
		} catch (_) {
			toast({
				title: 'Something went wrong',
				description: 'Please refresh the page and try again',
				status: 'error',
			});
		}
	};

	const handleFundClick = () => {
		setFadeStarted(true);
		setDetailOpen(true);
		setTimeout(() => {
			setFadeStarted(false);
		}, 500);
	};

	const gotoNextStage = () => {
		const currentIndex = stageList.indexOf(fundState);
		const nextState = stageList[currentIndex + 1];
		setFundState(nextState);
	};

	const renderActivity = () => {
		switch (fundState) {
			case fundingStages.loading:
				return <Loader />;
			case fundingStages.initial:
				return <InfoPage
					{...{
						project,
						handleFundClick,
						handleFundProject,
						loading,
						btcRate,
						fundingTxs,
					}}
				/>;
			case fundingStages.form:
				return <PaymentPage
					{...{
						isMobile,
						handleCloseButton,
						btcRate,
						state,
						setState,
						setTarget,
						updateReward,
						handleFund,
						rewards: project.rewards,
						type: 'reward-based',
					}}
				/>;
			case fundingStages.started:
				return 	<QrPage
					comment={state.comment}
					title={project.title}
					amount={state.amount}
					owners={project.owners.map(owner => owner.user.username)}
					qrCode={fundingTx.paymentRequest}
					handleCloseButton={handleCloseButton}
				/>;
			case fundingStages.completed:
				return <SuccessPage amount={state.amount} handleCloseButton={handleCloseButton} />;

			default:
				return null;
		}
	};

	return (
		<>
			<Card
				className={classNames(classes.container, {
					[classes.slideInRight]: isMobile && !detailOpen,
					[classes.fadeOut]: isMobile && fadeStarted,
				})}
				flex={!isMobile ? 2 : undefined}
				maxWidth={isMobile ? 'auto' : '450px'}
				width={isMobile ? '100%' : undefined}
				flexDirection="column"
				justifyContent="flex-start"
				alignItems="center"
				backgroundColor={isDark ? 'brand.bgGreyDark' : 'white'}
				height="100%"
			>
				{renderActivity()}
			</Card>
			<ConnectTwitter
				isOpen={twitterisOpen}
				onClose={twitterOnClose}
			/>
		</>
	);
};

export default Activity;
