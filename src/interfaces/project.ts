import { IParticipant, IFunder, ISponsor, IGrantee } from './participant';
import { IFundingTx } from './funding';
import { IUser } from './user';

export type IProjectType = 'reward' | 'grant' | 'donation';

export interface IProject {
  id: string;
  title: string;
  name: string;
  description: string;
  type: IProjectType;
  balance: number;
  fundingGoal: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  image?: string;
  active: boolean;
  ownerConfirmed: string;
  fundsClaimed: string;
  creationConfirmed: string;
  media: string[];
  owners: IParticipant[];
  ambassadors: IParticipant[];
  funders: IFunder[];
  sponsors: ISponsor[];
  grantees: IGrantee[];
  fundingTxs: IFundingTx[];
  rewards?: IProjectReward[];
  milestones?: IProjectMilestone[];
  entries?: IProjectListEntryItem[];
  wallets?: IProjectWallet[];
}

export interface IProjectWallet {
  id: number;
  name: string;
  connectionDetails: {
    macaroon: string;
    tlsCertificate: string;
    hostname: string;
    grpcPort: string;
    lndNodeType: string;
    pubkey: string;
  };
}

export interface IProjectReward {
  id: number;
  cost: number;
  currency: string;
  name: string;
  description: string;
  backers: number;
  image?: string;
}

export interface IProjectDetail {
  problem: string;
  idea: string;
  blocks: IProjectBlock[];
  ownerIntro: string;
  images?: string[];
}

export interface IProjectBlock {
  key: string;
  title: string;
  body: string[];
  tweet?: string;
  images?: number[];
  youtube?: string;
  podcast?: string;
  vimeo?: string;
  link?: string[];
  blockType: string;
}

export interface IProjectUpdate {
  updateTitle: string;
  date: number;
  tweet?: string;
  type: string;
  bodyTitle?: string;
  body?: string[];
  images?: number[];
  youtube?: string;
}

export interface IProjectMilestone {
  id: number;
  name: string;
  description: string;
  amount: number;
}

/**
 * Corresponds to https://github.com/geyserfund/geyser-server/blob/fa64826471/src/typeDefs/entry.ts#L47
 */
export interface IProjectListEntryItem {
  id: number;
  title: string;
  description: string;

  /**
   * A URL path for the image source.
   */
  image: string;

  /**
   * The type of the entry.
   *
   * TODO: These should be strongly-typed as a set
   * of constants.
   */
  type: string;

  creator: IUser;
  fundersCount: number;
  amountFunded: number;
  published: boolean;
  project: IProject;
}

export interface IRewardCount {
  id: number;
  count: number;
}
