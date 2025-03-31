import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link href="/dashboard">Dashboard</Link>
            
            {/* Show create class link for admin/lecturer */}
            {(user?.role === 'admin' || user?.role === 'lecturer') && (
              <Link href="/classes/create">Create Class</Link>
            )}
            
            <Link href="/classes">My Classes</Link>
            {/* Other navigation items */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 