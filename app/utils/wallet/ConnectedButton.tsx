import { FC, useState } from 'react';
import { ArrowDownIcon } from '@/public/assets/icon-components/ArrowDown';
import { ArrowUpIcon } from '@/public/assets/icon-components/ArrowUp';
import { PowerIcon } from '@/public/assets/icon-components/Power';
import { GithubIcon } from '@/public/assets/icon-components/Github';
interface Props {
  username: string
  onLogout: () => void
}

const LogoutButton: FC<Pick<Props, 'onLogout'>> = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="flex w-full items-center justify-center gap-2 py-2"
    >
      <PowerIcon />
      <span className="text-primary"> Log out </span>
    </button>
  );
};

const ConnectedButton: FC<Props> = ({ username, onLogout }) => {
  const [open, setOpen] = useState(false);

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
        <div className="absolute left-0 w-44 rounded-lg border border-gray-300 bg-white shadow-md">
          <LogoutButton onLogout={onLogout} />
        </div>
      )}
    </div>
  );
};

export { ConnectedButton };
