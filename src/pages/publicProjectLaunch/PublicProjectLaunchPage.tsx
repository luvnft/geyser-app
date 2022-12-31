import {
  Text,
  Grid,
  Box,
  VStack,
  GridItem,
  UnorderedList,
  ListItem,
  Image,
  useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { createUseStyles } from 'react-jss';

import { TwitterConnect } from '../../components/molecules';
import { ButtonComponent } from '../../components/ui';
import { useAuthContext } from '../../context';
import { hasTwitterAccount, isMobileMode } from '../../utils';
import {
  LaunchProjectRocketUrl,
  colors,
  getPath,
  LaunchImage2Url,
} from '../../constants';

const useStyles = createUseStyles({
  backIcon: {
    fontSize: '25px',
  },
});

export const PublicProjectLaunchPage = () => {
  const isMobile = isMobileMode();
  const { loading, user } = useAuthContext();
  const history = useHistory();
  const classes = useStyles();

  const handleBack = () => {
    history.push('/');
  };

  const handleNext = () => {
    history.push(getPath('privateProjectLaunch'));
  };

  const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)');

  return (
    <Box
      background={'brand.bgGrey4'}
      position="relative"
      paddingTop="60px"
      height="100%"
      justifyContent="space-between"
    >
      <Grid
        width="100%"
        templateColumns={
          isLargerThan1280
            ? 'repeat(6, 1fr)'
            : isMobile
            ? 'repeat(2, 1fr)'
            : 'repeat(5, 1fr)'
        }
        padding={isMobile ? '10px' : '40px 40px 20px 40px'}
      >
        <GridItem
          colSpan={isLargerThan1280 ? 2 : 1}
          display="flex"
          justifyContent="flex-start"
        >
          <ButtonComponent
            onClick={handleBack}
            leftIcon={<BiLeftArrowAlt className={classes.backIcon} />}
          >
            {' '}
            Back
          </ButtonComponent>
        </GridItem>
        <GridItem
          display="flex"
          colSpan={isLargerThan1280 ? 2 : isMobile ? 2 : 3}
          justifyContent="center"
          alignContent="center"
        >
          <VStack
            spacing="30px"
            width="100%"
            maxWidth="350px"
            minWidth="350px"
            marginBottom="40px"
          >
            <Text
              color="brand.gray500"
              fontSize="30px"
              fontWeight={700}
              paddingTop={isMobile ? 5 : 0}
              paddingBottom="10%"
            >
              {' '}
              Create A New Project
            </Text>
            <VStack spacing="20px" width="100%" justifyContent="center">
              <Image src={LaunchImage2Url} />
              <Text fontSize="18px" fontWeight={600} color={colors.neutral900}>
                Transform your ideas into real world projects backed by your
                community
              </Text>
              <UnorderedList
                color={colors.neutral700}
                width="90%"
                fontSize="15px"
              >
                <ListItem>🌍 Raise funds from anywhere in the world.</ListItem>
                <ListItem>🔑 Remain in control of your funds.</ListItem>
                <ListItem>
                  🖋 Keep your community up to date by writing Entries.
                </ListItem>
                <ListItem>🎁 Reward your contributors with perks.</ListItem>
                <ListItem>
                  💸 Low 2% fees and no fees for node-runners.
                </ListItem>
              </UnorderedList>

              {!loading ? (
                !user ||
                (user && !user.id) ||
                (user && !hasTwitterAccount(user)) ? (
                  <VStack>
                    <Text color={colors.neutral700} paddingBottom={3}>
                      We require creators to login with Twitter to start their
                      Geyser projects.
                    </Text>

                    <TwitterConnect />

                    {isMobile ? (
                      <Text
                        fontSize={'11px'}
                        fontWeight={400}
                        color={'brand.gray500'}
                      >
                        {`If this button isn't opening a Twitter authentication
                        page, make sure pop-ups are enabled in your browser's
                        preferences.`}
                      </Text>
                    ) : null}
                  </VStack>
                ) : (
                  <Box width="100%" paddingTop={5}>
                    <ButtonComponent primary isFullWidth onClick={handleNext}>
                      Continue
                    </ButtonComponent>
                  </Box>
                )
              ) : null}
            </VStack>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
};
