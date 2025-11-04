import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableView from '../components/TableView';
import { Users, UserCheck, CreditCard, Car } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  
  // Dummy person data
  const personData = [
    { personid: 1, name: 'John Doe', role: 'Employee', contact: 'john@example.com', biometric_data: 'FP001' },
    { personid: 2, name: 'Jane Smith', role: 'Visitor', contact: 'jane@example.com', biometric_data: 'FP002' },
    { personid: 3, name: 'Bob Johnson', role: 'Employee', contact: 'bob@example.com', biometric_data: 'FP003' },
    { personid: 4, name: 'Alice Brown', role: 'Contractor', contact: 'alice@example.com', biometric_data: 'FP004' },
    { personid: 5, name: 'Charlie Davis', role: 'Employee', contact: 'charlie@example.com', biometric_data: 'FP005' },
  ];
  
  const personColumns = ['personid', 'name', 'role', 'contact', 'biometric_data'];
  
  const tables = [
    { name: 'Person', path: '/table/person', icon: Users, color: 'text-blue-600' },
    { name: 'Visitor', path: '/table/visitor', icon: UserCheck, color: 'text-green-600' },
    { name: 'Visitor Band', path: '/table/visitor_band', icon: CreditCard, color: 'text-purple-600' },
    { name: 'Vehicle', path: '/table/vehicle', icon: Car, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Database Management System</h1>
          <p className="text-muted-foreground">Manage and view all database records</p>
        </div>
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tables.map(table => (
            <button
              key={table.path}
              onClick={() => navigate(table.path)}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left group"
            >
              <table.icon className={`h-8 w-8 ${table.color} mb-3`} />
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {table.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">View & manage</p>
            </button>
          ))}
        </div>
        
        <TableView 
          data={personData}
          columns={personColumns}
          title="Person Table"
        />
      </div>
    </div>
  );
};

export default Home;
