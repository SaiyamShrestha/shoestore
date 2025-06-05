import Link from 'next/link';
import ShoeIcon from '@/components/icons/ShoeIcon';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/90">
      <ShoeIcon className="h-7 w-7" />
      <span className="font-headline">Sole Mate</span>
    </Link>
  );
};

export default Logo;
