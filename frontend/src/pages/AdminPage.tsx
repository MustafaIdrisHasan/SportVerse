import React from 'react';
import Layout from '../components/layout/Layout';
import SyncPanel from '../components/admin/SyncPanel';

const AdminPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage sports data synchronization and monitor system status
          </p>
        </div>
        
        <SyncPanel />
      </div>
    </Layout>
  );
};

export default AdminPage; 