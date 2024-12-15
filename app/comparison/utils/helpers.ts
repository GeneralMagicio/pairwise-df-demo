import { JWTPayload } from '@/app/utils/wallet/types';

export const convertCategoryNameToId = (category: JWTPayload['category']) => {
  switch (category) {
    case 'web3.js':
      return 38;
    case 'account-abstraction':
      return 39;
    case 'remix-project':
      return 40;
    default:
      throw new Error(`Invalid category name: ${category}`);
  }
};

export const convertCategoryToLabel = (category: JWTPayload['category']) => {
  const labels = {
    'web3.js': 'Web3.js',
    'account-abstraction': 'Account Abstraction',
    'remix-project': 'Remix Project',
  };

  if (!(category in labels)) return '';

  return labels[category];
};

export const categoryIdSlugMap = new Map([
  [38, 'web3.js'],
  [39, 'account-abstraction'],
  [40, 'remix-project'],
]);

export const categoryIdTitleMap = new Map([
  [38, 'web3.js'],
  [39, 'Account Abstraction'],
  [40, 'Remix Project'],
]);

export const categorySlugIdMap = new Map([
  ['web3.js', 38],
  ['account-abstraction', 39],
  ['remix-project', 40],
]);

// export const getCategoryCount = (category: JWTPayload['category']) => {
//   const labels = {
//     GOVERNANCE_LEADERSHIP: 30,
//     GOVERNANCE_INFRA_AND_TOOLING: 29,
//     GOVERNANCE_ANALYTICS: 20,
//   };
//   return category in labels ? labels[category] : 30;
// };

export function shortenWalletAddress(
  address: string,
  startLength: number = 7,
  endLength: number = 7
): string {
  // Check if the address is valid (starts with '0x' and has 42 characters)
  if (!address.startsWith('0x') || address.length !== 42) {
    throw new Error('Invalid wallet address format');
  }

  // Ensure start and end lengths are not greater than half the remaining address length
  const maxLength = Math.floor((address.length - 2) / 2);
  startLength = Math.min(startLength, maxLength);
  endLength = Math.min(endLength, maxLength);

  // Extract the start and end parts of the address
  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);

  // Combine the parts with ellipsis
  return `${start}...${end}`;
}

export function formatBudget(budget: number | undefined): string {
  if (budget === undefined) {
    return 'N/A';
  }
  return budget.toLocaleString('en-US');
}
