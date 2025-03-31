import React from 'react';
import CreateClass from '@/components/CreateClass';
import { useAuth } from '@/hooks/useAuth'; // Assuming you have an auth hook

const CreateClassPage = () => {
  const { user } = useAuth();

  // Check if user has permission to create class
  if (user?.role !== 'admin' && user?.role !== 'lecturer') {
    return (
      <div className="p-4">
        <h2>Access Denied</h2>
        <p>You don't have permission to create classes.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Class</h1>
      <CreateClass />
    </div>
  );
};

export default CreateClassPage; 