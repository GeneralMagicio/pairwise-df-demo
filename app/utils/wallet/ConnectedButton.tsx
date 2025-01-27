import { FC, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowDownIcon } from '@/public/assets/icon-components/ArrowDown';
import { ArrowUpIcon } from '@/public/assets/icon-components/ArrowUp';
import { GithubIcon } from '@/public/assets/icon-components/Github';
import { LogOutIcon } from '@/public/assets/icon-components/Logout';
import { EditIcon } from '@/public/assets/icon-components/Edit';
interface Props {
  username: string
  onLogout: () => void
}

const LogoutButton: FC<Pick<Props, 'onLogout'>> = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="flex w-full items-center justify-start gap-2 p-2.5 py-2"
    >
      <LogOutIcon />
      <span className="text-sm text-[#344054]"> Log out </span>
    </button>
  );
};

const ConnectedButton: FC<Props> = ({ username, onLogout }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-fit w-44 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2 font-semibold"
      >
        <GithubIcon />
        <span className="text-sm text-gray-800">
          {username.length < 10 ? username : username.slice(0, 10) + '...'}
        </span>
        {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </button>
      {open && (
        <div className="focus:shadow-wite-focus-shadow absolute right-0 w-56 rounded-lg border border-[#D0D5DD] bg-white shadow-md hover:bg-wite-hover focus:bg-white">
          {pathname === '/allocation' && (
            <Link
              href="/evaluation"
              className="flex w-full items-center justify-start gap-2 p-2.5 py-2"
            >
              <EditIcon size="16" />
              <span className="text-sm text-[#344054]"> My Evaluation </span>
            </Link>
          )}
          <LogoutButton onLogout={onLogout} />
        </div>
      )}
    </div>
  );
};

export { ConnectedButton };
