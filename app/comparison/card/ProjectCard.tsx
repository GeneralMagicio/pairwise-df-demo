import React, { FC } from 'react';
import Image from 'next/image';
import GithubBox from './GithubBox';
import { IProject, ProjectMetadata } from '../utils/types';
import ProjectDescription from './ProjectDescription';
import styles from '@/app/styles/Project.module.css';
import { ExternalLinkIcon } from '@/public/assets/icon-components/ExternalLink';

enum ProjectSection {
  REPOS = 'repos',
  TESTIMONIALS = 'testimonials',
  IMPACT = 'impact',
  PRICING = 'pricing',
}

interface CollapsibleProps {
  title?: string
  children: React.ReactNode
  id: string
}

export interface AutoScrollAction {
  section: ProjectSection
  initiator: 'card1' | 'card2'
  action: boolean
}

// const ProjectSectionTitles = {
//   [ProjectSection.REPOS]: 'Repos, links, and contracts',
//   [ProjectSection.TESTIMONIALS]: 'Testimonials',
//   [ProjectSection.IMPACT]: 'Impact statement',
//   [ProjectSection.PRICING]: 'Pricing model',
// };

const Section: FC<CollapsibleProps> = ({
  title,
  children,
  id,
}) => {
  return (
    <>
      <div id={id} className="mb-2 pt-4 xxsl:mb-1 xxsl:pt-2">
        {title && (
          <div className="flex items-center justify-between gap-4 p-2">
            <button className="text-xl font-medium">{title}</button>
          </div>
        )}
        <section>
          {children}
        </section>
      </div>
    </>
  );
};

// function smoothScrollToElement(elementId: string) {
//   const element = document.getElementById(elementId);

//   if (element) {
//     element.scrollIntoView({
//       behavior: 'smooth',
//       block: 'start',
//     });
//   }
// }

interface Props {
  metadata: ProjectMetadata & IProject
  name: string
  aiMode: boolean
  setAi: () => void
}

// const NoneBox: FC = () => (
//   <div className="space-y-2">
//     <div className="max-w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
//       None
//     </div>
//   </div>
// );

export const ProjectCard: React.FC<Props> = ({
  metadata,
  name,
}) => {
  return (
    <div
      className={`container relative mx-auto my-4 h-[55vh] w-full
       rounded-xl border border-gray-200 
      bg-gray-50 px-4 pb-8 pt-4 xsl:h-[45vh] sl:h-[50vh]`}
    >
      <div className="gap-2 overflow-y-auto">
        <div className="mr-4 flex flex-col gap-3 xxsl:gap-1">
          {/* Cover Image and Profile Avatar */}
          <div className="relative flex h-auto flex-row items-center">
            <Image
              key={metadata.image}
              src={metadata.image || ''}
              unoptimized
              alt={metadata.name}
              width={64}
              height={64}
              className="rounded-md"
            />
            <h1
              className={`m-2 text-center text-3xl font-semibold ${styles.oneLineClamp}`}
            >
              {metadata.name}
            </h1>
            {metadata.metadata.id && (
              <a className="ml-2" href={metadata.metadata.id} target="__blank">
                <ExternalLinkIcon />
              </a>
            )}
          </div>

          <div>
            <ProjectDescription description={metadata.description} />
          </div>

          <Section
            id={`repos-${name}`}
          >
            <div className="space-y-4">
              <GithubBox key={metadata.id} {...metadata} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};
