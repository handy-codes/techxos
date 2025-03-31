import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import { UserResource } from '@/types/user';

const Sidebar = () => {
  const { user } = useUser() as { user: UserResource | null };

  return (
    <nav className="p-4">
      {/* Other menu items */}
      
      {/* Only show create class link to admin/lecturer */}
      {(user?.role === 'ADMIN' || user?.role === 'LECTURER') && (
        <Link 
          href="/classes/create" 
          className="block py-2 px-4 hover:bg-gray-100 rounded"
        >
          Create Class
        </Link>
      )}
    </nav>
  );
};

export default Sidebar; 