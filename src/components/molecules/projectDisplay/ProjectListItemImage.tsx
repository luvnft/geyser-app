import { Box, HTMLChakraProps, Image, SkeletonCircle } from '@chakra-ui/react';
import React from 'react';
import { ProjectImageListItemPlaceholder } from '..';
import { IProject } from '../../../interfaces';
import { Project } from '../../../types/generated/graphql';

type Props = HTMLChakraProps<'div'> & {
  imageSrc?: string;
  project: Project | IProject;
  boxSize?: string;
  borderRadius?: string;
};

export const ProjectListItemImage = ({
  imageSrc,
  project,
  boxSize = '42px',
  borderRadius = 'md',
  ...rest
}: Props) => {
  const imageSource = imageSrc ?? (project.image || '');

  return (
    <Box boxSize={boxSize} {...rest}>
      <Image
        flexShrink={0}
        src={imageSource}
        boxSize={boxSize}
        borderRadius={borderRadius}
        objectFit="cover"
        fallback={<ProjectImageListItemPlaceholder />}
        alt={`Main image for ${project.name}`}
      />
    </Box>
  );
};
