import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Quick Actions Section */}
      <div className="grid gap-4 mb-8">
        {(user?.role === 'admin' || user?.role === 'lecturer') && (
          <Link 
            href="/classes/create"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Create New Class
          </Link>
        )}
        
        {/* Other dashboard content */}
      </div>
    </div>
  );
};

export default Dashboard; 