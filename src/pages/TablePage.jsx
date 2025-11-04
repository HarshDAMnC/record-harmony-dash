import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TableView from '../components/TableView';
import InsertForm from '../components/InsertForm';
import UpdateForm from '../components/UpdateForm';
import DeleteForm from '../components/DeleteForm';
import ViewQueries from '../components/ViewQueries';
import { Eye, Plus, Edit, Trash2 } from 'lucide-react';

const TablePage = () => {
  const { tableName } = useParams();
  const [activeTab, setActiveTab] = useState('view');
  
  // Table configurations
  const tableConfigs = {
    person: {
      title: 'Person Table',
      columns: ['personid', 'name', 'role', 'contact', 'biometric_data'],
      primaryKey: 'personid',
      primaryKeyLabel: 'Person ID',
      data: [
        { personid: 1, name: 'John Doe', role: 'Employee', contact: 'john@example.com', biometric_data: 'FP001' },
        { personid: 2, name: 'Jane Smith', role: 'Visitor', contact: 'jane@example.com', biometric_data: 'FP002' },
      ],
      fields: [
        { name: 'personid', label: 'Person ID', type: 'number', required: true },
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'role', label: 'Role', type: 'select', required: true, options: [
          { value: 'Employee', label: 'Employee' },
          { value: 'Visitor', label: 'Visitor' },
          { value: 'Contractor', label: 'Contractor' },
        ]},
        { name: 'contact', label: 'Contact', type: 'email', required: true },
        { name: 'biometric_data', label: 'Biometric Data', type: 'text', required: true },
      ],
    },
    visitor: {
      title: 'Visitor Table',
      columns: ['visitorid', 'host_id', 'purpose', 'visit_bandid'],
      primaryKey: 'visitorid',
      primaryKeyLabel: 'Visitor ID',
      data: [
        { visitorid: 1, host_id: 1, purpose: 'Meeting', visit_bandid: 'VB001' },
        { visitorid: 2, host_id: 3, purpose: 'Interview', visit_bandid: 'VB002' },
      ],
      fields: [
        { name: 'visitorid', label: 'Visitor ID', type: 'number', required: true },
        { name: 'host_id', label: 'Host ID (Person)', type: 'number', required: true },
        { name: 'purpose', label: 'Purpose', type: 'text', required: true },
        { name: 'visit_bandid', label: 'Visit Band ID', type: 'text', required: true },
      ],
    },
    visitor_band: {
      title: 'Visitor Band Table',
      columns: ['visit_bandid', 'issue_date', 'expiry_date'],
      primaryKey: 'visit_bandid',
      primaryKeyLabel: 'Visit Band ID',
      data: [
        { visit_bandid: 'VB001', issue_date: '2024-01-15', expiry_date: '2024-01-15' },
        { visit_bandid: 'VB002', issue_date: '2024-01-16', expiry_date: '2024-01-16' },
      ],
      fields: [
        { name: 'visit_bandid', label: 'Visit Band ID', type: 'text', required: true },
        { name: 'issue_date', label: 'Issue Date', type: 'date', required: true },
        { name: 'expiry_date', label: 'Expiry Date', type: 'date', required: true },
      ],
    },
    vehicle: {
      title: 'Vehicle Table',
      columns: ['license_plate', 'type', 'personid'],
      primaryKey: 'license_plate',
      primaryKeyLabel: 'License Plate',
      data: [
        { license_plate: 'ABC123', type: 'Car', personid: 1 },
        { license_plate: 'XYZ789', type: 'Motorcycle', personid: 3 },
      ],
      fields: [
        { name: 'license_plate', label: 'License Plate', type: 'text', required: true },
        { name: 'type', label: 'Vehicle Type', type: 'select', required: true, options: [
          { value: 'Car', label: 'Car' },
          { value: 'Motorcycle', label: 'Motorcycle' },
          { value: 'Truck', label: 'Truck' },
          { value: 'Van', label: 'Van' },
        ]},
        { name: 'personid', label: 'Person ID', type: 'number', required: true },
      ],
    },
  };
  
  const queries = [
    { 
      id: 'all_visitors', 
      name: 'All Visitors',
      description: 'SELECT * FROM visitor',
      dummyData: [
        { visitorid: 1, host_id: 1, purpose: 'Meeting', visit_bandid: 'VB001' },
        { visitorid: 2, host_id: 3, purpose: 'Interview', visit_bandid: 'VB002' },
      ]
    },
    { 
      id: 'all_vehicles', 
      name: 'All Vehicles Linked to Person',
      description: 'SELECT v.*, p.name FROM vehicle v JOIN person p ON v.personid = p.personid',
      dummyData: [
        { license_plate: 'ABC123', type: 'Car', personid: 1, name: 'John Doe' },
        { license_plate: 'XYZ789', type: 'Motorcycle', personid: 3, name: 'Bob Johnson' },
      ]
    },
    { 
      id: 'active_bands', 
      name: 'Active Visitor Bands',
      description: 'SELECT * FROM visitor_band WHERE expiry_date >= CURRENT_DATE',
      dummyData: [
        { visit_bandid: 'VB001', issue_date: '2024-01-15', expiry_date: '2024-12-31' },
      ]
    },
  ];
  
  const config = tableConfigs[tableName] || tableConfigs.person;
  
  const tabs = [
    { id: 'view', label: 'View', icon: Eye },
    { id: 'insert', label: 'Insert', icon: Plus },
    { id: 'update', label: 'Update', icon: Edit },
    { id: 'delete', label: 'Delete', icon: Trash2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{config.title}</h1>
          <p className="text-muted-foreground">Manage records and execute operations</p>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2 bg-card p-2 rounded-xl border border-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div>
          {activeTab === 'view' && (
            <div className="space-y-6">
              <TableView 
                data={config.data}
                columns={config.columns}
                title={`${config.title} Records`}
              />
              <ViewQueries queries={queries} />
            </div>
          )}
          
          {activeTab === 'insert' && (
            <InsertForm 
              table={tableName}
              fields={config.fields}
            />
          )}
          
          {activeTab === 'update' && (
            <UpdateForm 
              table={tableName}
              fields={config.fields}
              primaryKey={config.primaryKey}
            />
          )}
          
          {activeTab === 'delete' && (
            <DeleteForm 
              table={tableName}
              primaryKey={config.primaryKey}
              primaryKeyLabel={config.primaryKeyLabel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TablePage;
