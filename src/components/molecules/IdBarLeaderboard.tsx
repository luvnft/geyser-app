import { Box, Text, HStack } from '@chakra-ui/layout';
import { HTMLChakraProps } from '@chakra-ui/system';
import React from 'react';
import { Badge, LinkableAvatar, AnonymousAvatar } from '../ui';
import { IProject, IFunder } from '../../interfaces';
import { SatoshiIconTilted } from '../icons';
import { getAvatarMetadata } from '../../helpers';
import { computeFunderBadges } from '../../helpers/computeBadges';
import { commaFormatted } from '../../utils/helperFunctions';

interface IIdBarLeaderboard extends HTMLChakraProps<'div'> {
	project: IProject
	funder: IFunder
	count: number
}

export const IdBarLeaderboard = ({ funder, count, project, ...rest }: IIdBarLeaderboard) => {
	const anonymous = !funder.user;
	const avatarMetadata = getAvatarMetadata({ funder });
	const badges = computeFunderBadges({ project, funder }).map(badge => (<Badge key={`${badge.badge}`} badge={`${badge.badge}`} />));

	return (
		<Box
			padding="10px 25px"
			mt={2}
			width="95%"
			boxShadow="0px 0px 10px rgba(0, 0, 0, 0.08)"
			_hover={{boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.08)'}}
			borderRadius="12px"
			{...rest}
		><Box
				display="flex"
				justifyContent="space-between"
			>
				<HStack>
					<Text fontWeight="bold" mr={2}>{count}</Text>
					{
						anonymous
							? <AnonymousAvatar seed={funder.id} />
							: <LinkableAvatar
								avatarMetadata={avatarMetadata}
								badges={badges}
							/>
					}
				</HStack>
				<Box display="flex" alignItems="center">
					<SatoshiIconTilted scale={0.7} /><Text>{`${commaFormatted(funder.amountFunded)}`} </Text>
				</Box>
			</Box>
		</Box>
	);
};
