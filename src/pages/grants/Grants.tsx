/* eslint-disable complexity */

import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, Image, Avatar, VStack, Link } from '@chakra-ui/react';
import { Footer } from '../../components/molecules';
import { InfoTooltip } from '../../components/ui';
import { SatoshiIcon } from '../../components/icons';
import { isMediumScreen, isMobileMode } from '../../utils';
import { IProject } from '../../interfaces';
import { Subscribe } from '../../components/nav/Subscribe';
import { RecipientButton } from './components/RecipientButton';
import { ContributeButton } from './components/ContributeButton';
import { REACT_APP_AIR_TABLE_KEY } from '../../constants';
import Brad from '../../assets/brad.png';
import Zucco from '../../assets/zucco.jpg';
import Lucas from '../../assets/lucas.jpg';

export const Grants = ({ project }: { project: IProject }) => {
	const [applicants, setApplicants] = useState(['loading']);

	const getGrantApplicants = async () => {
		fetch('https://api.airtable.com/v0/appyM7XlNIWVypuP5/tblwlFBSxMvV0JhzU?fields%5B%5D=Grant', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${REACT_APP_AIR_TABLE_KEY}`,
				'Content-Type': 'application/json',
			},
		}).then(response => response.json()).then(data => {
			setApplicants(data.records.filter((applicant: any) => applicant.fields.Grant === project.title));
		});
	};

	useEffect(() => {
		getGrantApplicants();
	}, []);

	const isMedium = isMediumScreen();
	const isMobile = isMobileMode();

	return (
		<>
			<Box py={isMedium ? 10 : 20} w={isMedium ? 'auto' : '900px'} margin="0 auto">

				<Box display={isMedium ? 'block' : 'flex'} justifyContent="center">

					<Box w={isMedium ? '100%' : '450px'}>
						<Text fontSize="4xl" fontWeight="bold" textAlign={isMedium ? 'center' : 'left'}>{project.title}</Text>
						<Text fontSize="xl" color="#6E6E6E" fontWeight="bold" textAlign={isMedium ? 'center' : 'left'}>ROUND 1: JULY 1-31</Text>
						<Image w={isMobile ? '300px' : '375px'} rounded="md" src={project.media[0] && project.media[0]} alt="grant" margin={isMedium ? '0 auto' : ''}/>
					</Box>

					<Box w={isMobile ? '100%' : isMedium ? '50%' : '450px'} margin={isMedium ? '10px auto' : ''}>
						<Text fontSize="lg" textAlign="justify" my={isMobile ? 2 : 0} mx={isMobile ? 5 : 0}>{project.description}</Text>
						<Box boxShadow="0px 0px 10px rgba(0, 0, 0, 0.08)" rounded="lg" p={6} mt={6}>
							<Box display="flex" justifyContent="end">
								<InfoTooltip
									title="APPLICATIONS OPEN JULY 1"
									description="Please check back then!"
									options={ { top: '-55px', left: '-125px' } }
									width="155px"
								/>
							</Box>
							<HStack justifyContent="center" spacing="21px" alignItems="center" my={3}>

								<Box>
									<HStack justifyContent="center" alignItems="center">
										<SatoshiIcon scale={0.8}/><Text fontWeight="bold" fontSize="lg">{(project.balance / 1000000).toFixed(project.balance === 0 ? 0 : 1)} M</Text>
									</HStack>
									<Text fontSize="sm" color="#5B5B5B" fontWeight="bold">CONTRIBUTED</Text>
								</Box>

								<Box>
									<HStack justifyContent="center">
										<SatoshiIcon scale={0.8} /><Text fontWeight="bold" fontSize="lg">{project.name === 'bitcoin-education' ? (0 / 1000000).toFixed(0) : project.name === 'bitcoin-builders' ? (0 / 1000000).toFixed(0) : project.name === 'bitcoin-culture' ? (0 / 1000000).toFixed(0) : ''} M</Text>
									</HStack>
									<Text fontSize="sm" color="#5B5B5B" fontWeight="bold">DISTRIBUTED</Text>
								</Box>

								<Box>
									<Text fontWeight="bold" textAlign="center" fontSize="lg">{applicants && applicants[0] === 'loading' ? '...' : applicants.length}</Text>
									<Text fontSize="sm" color="#5B5B5B" fontWeight="bold">APPLICANTS</Text>
								</Box>

							</HStack>
							<Box display="flex" justifyContent="center">
								<RecipientButton active={false} title="Apply" grant={project.title} image={project.media[0]}/>
							</Box>
						</Box>
					</Box>
				</Box>

				<Box display={isMedium ? 'block' : 'flex'} justifyContent="center" alignItems="center" mt={20}>
					<Box w={isMobile ? '90%' : isMedium ? '50%' : '450px'} pr={isMedium ? 0 : 20} margin={isMedium ? '0 auto' : ''}>
						<Text fontSize="3xl" fontWeight="bold" mb={2}>Contribute to this grant</Text>
						<Text fontSize="lg" mb={6}>Help bootstrap new Bitcoin projects and initiatives by joining the growing number of plebs and whales donating to this grant.<br/><br/>Funds will go directly to supporting {project.title}, and we currently accept on-chain donations only. To learn more, <Link isExternal href="https://t.me/bradmillscandoit" textDecoration="underline">get in touch!</Link></Text>
					</Box>

					<Box w={isMobile ? '90%' : isMedium ? '50%' : '450px'} boxShadow="0px 0px 10px rgba(0, 0, 0, 0.08)" rounded="lg" p={6} margin={isMedium ? '0 auto' : ''}>
						<HStack justifyContent="center" spacing="21px" alignItems="center" my={3}>

							<Box>
								<HStack justifyContent="center" alignItems="center">
									<SatoshiIcon scale={0.8}/><Text fontWeight="bold" fontSize="lg">{(project.balance / 1000000).toFixed(project.balance === 0 ? 0 : 1)} M</Text>
								</HStack>
								<Text fontSize="sm" color="#5B5B5B" fontWeight="bold">CONTRIBUTED</Text>
							</Box>

							<Box>
								<Text fontWeight="bold" textAlign="center" fontSize="lg">{project.funders ? project.funders.length + 1 : 1}</Text>
								<Text fontSize="sm" color="#5B5B5B" fontWeight="bold">CONTRIBUTORS</Text>
							</Box>

						</HStack>
						<Box display="flex" justifyContent="center">
							<ContributeButton active={project.active} title="Contribute" project={project}/>
						</Box>
					</Box>

				</Box>

				<Box w={isMobile ? '90%' : isMedium ? '50%' : '100%'} margin="0 auto" mt={20}>
					<Text fontSize="3xl" fontWeight="bold" mb={2}>The board</Text>
					<Text fontSize="lg" textAlign="justify" mb={2}>Meet the board who will help to establish the criteria for grant distribution and review your applications:</Text>

					<Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
						<Box key="brad" display="flex" justifyContent="center" alignItems="center" p={2} mx={2} mt={4} width="200px" height="200px" rounded="md" boxShadow="0px 0px 10px rgba(0, 0, 0, 0.08)" _hover={{boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.08)'}}>
							<Box>
								<Box display="flex" justifyContent="center" alignItems="center">
									<Avatar size="xl" src={Brad}/>
								</Box>
								<Text mt={4} mb={1} fontSize="lg" fontWeight="bold" textAlign="center">Brad Mills</Text>
								<Box display="flex" justifyContent="center">
									<Link _hover={{textDecoration: 'none'}} isExternal href="https://twitter.com/bradmillsca" color="#4C9AF4">@bradmillscan</Link>
								</Box>
							</Box>
						</Box>
						<Box key="zucco" display="flex" justifyContent="center" alignItems="center" p={2} mx={2} mt={4} width="200px" height="200px" rounded="md" boxShadow="0px 0px 10px rgba(0, 0, 0, 0.08)" _hover={{boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.08)'}}>
							<Box>
								<Box display="flex" justifyContent="center" alignItems="center">
									<Avatar size="xl" src={Zucco}/>
								</Box>
								<Text mt={4} mb={1} fontSize="lg" fontWeight="bold" textAlign="center">Giacomo von Zucco</Text>
								<Box display="flex" justifyContent="center">
									<Link _hover={{textDecoration: 'none'}} isExternal href="https://twitter.com/giacomozucco" color="#4C9AF4">@giacomozucco</Link>
								</Box>
							</Box>
						</Box>
						<Box key="lucas" display="flex" justifyContent="center" alignItems="center" p={2} mx={2} mt={4} width="200px" height="200px" rounded="md" boxShadow="0px 0px 10px rgba(0, 0, 0, 0.08)" _hover={{boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.08)'}}>
							<Box>
								<Box display="flex" justifyContent="center" alignItems="center">
									<Avatar size="xl" src={Lucas}/>
								</Box>
								<Text mt={4} mb={1} fontSize="lg" fontWeight="bold" textAlign="center">Lucas Ferreira</Text>
								<Box display="flex" justifyContent="center">
									<Link _hover={{textDecoration: 'none'}} isExternal href="https://twitter.com/lucasdcf" color="#4C9AF4">@lucasdcf</Link>
								</Box>
							</Box>
						</Box>
						<Box key="placeholder" display="flex" justifyContent="center" alignItems="center" p={2} mx={2} mt={4} width="200px" height="200px" rounded="md" boxShadow="0px 0px 10px rgba(0, 0, 0, 0.08)" _hover={{boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.08)'}}>
							<Box>
								<Box display="flex" justifyContent="center" alignItems="center">
									<Avatar size="xl" src="" bg="brand.bgGrey3" />
								</Box>
								<Box mt={4} mb={1} h="43px" w="111px" bg="brand.bgGrey3" borderRadius="md" />
							</Box>
						</Box>
					</Box>

				</Box>

				{project.sponsors
		&& <Box w={isMobile ? '90%' : isMedium ? '50%' : '100%'} margin="0 auto" mt={20}>
			<Text fontSize="3xl" fontWeight="bold" mb={2} textAlign="center">Grant Sponsors</Text>
			<Box display={isMobile ? 'block' : 'flex'} flexWrap="wrap" justifyContent="center" alignItems="center">
				{project.sponsors.map(sponsor => (
					<Link isExternal href={sponsor.url} key={sponsor.id} mx={project.sponsors.length > 1 ? isMobile ? 0 : 2.5 : 0}>
						<Box display="flex" justifyContent="center" alignItems="center" w={isMobile ? '100%' : '280px'} py={10} boxShadow="0px 0px 10px rgba(0, 0, 0, 0.08)" _hover={{boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.08)'}} mb={5}>
							<Image src={sponsor.image} w="200px"/>
						</Box>
					</Link>
				))}
			</Box>
		</Box>
				}

				<VStack margin="0 auto" mt="3.75rem" px={4}>
					<Subscribe style="inline" interest="grants" titleSize="3xl" />
				</VStack>

			</Box>
			<Footer/>
		</>
	);
};
