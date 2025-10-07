import React from 'react';
import Card from '../components/Card';

function Dashboard() {
  return (
    <div className="p-6 flex flex-wrap gap-6">
      <Card title="Signages Active" value="12" />
      <Card title="Content Scheduled" value="34" />
      <Card title="Errors" value="2" />
    </div>
  );
}

export default Dashboard;
