import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import TableView from '../components/TableView';
import InsertForm from '../components/InsertForm';
import UpdateForm from '../components/UpdateForm';
import DeleteForm from '../components/DeleteForm';
import ViewQueries from '../components/ViewQueries';
import { Eye, Plus, Edit, Trash2 } from 'lucide-react';

const TablePage = () => {
  const { tableName } = useParams();
  const [activeTab, setActiveTab] = useState('view');
  const [tableData, setTableData] = useState([]);

  const baseURL = "http://localhost:8000";

  useEffect(() => {
    axios.get(`${baseURL}/${tableName}/all`)
      .then(res => setTableData(res.data))
      .catch(err => console.error("Error fetching data:", err));
  }, [tableName, activeTab]); // refresh on tab change (so updates reflect)

  const tableConfigs = {
    person: {
      title: 'Person Table',
      columns: ['personid', 'name', 'role', 'contact', 'biometric_data'],
      primaryKey: 'personid',
      primaryKeyLabel: 'Person ID',
      fields: [
        { name: 'personid', label: 'Person ID', type: 'number', required: true },
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'role', label: 'Role', type: 'select', required: true, options: [
          { value: 'Employee', label: 'Employee' },
          { value: 'Visitor', label: 'Visitor' },
          { value: 'Contractor', label: 'Contractor' },
        ]},
        { name: 'contact', label: 'Contact', type: 'text', required: true },
        { name: 'biometric_data', label: 'Biometric Data', type: 'text', required: true },
      ],
    },
    visitor: {
      title: 'Visitor Table',
      columns: ['visitorid', 'host_id', 'purpose', 'visit_bandid'],
      primaryKey: 'visitorid',
      primaryKeyLabel: 'Visitor ID',
      fields: [
        { name: 'visitorid', label: 'Visitor ID', type: 'number', required: true },
        { name: 'host_id', label: 'Host ID (Person)', type: 'number', required: true },
        { name: 'purpose', label: 'Purpose', type: 'text', required: true },
        { name: 'visit_bandid', label: 'Visit Band ID', type: 'number', required: true },
      ],
    },
    visitor_band: {
      title: 'Visitor Band Table',
      columns: ['visit_bandid', 'issue_date', 'expiry_date'],
      primaryKey: 'visit_bandid',
      primaryKeyLabel: 'Visit Band ID',
      fields: [
        { name: 'visit_bandid', label: 'Visit Band ID', type: 'number', required: true },
        { name: 'issue_date', label: 'Issue Date', type: 'date', required: true },
        { name: 'expiry_date', label: 'Expiry Date', type: 'date', required: true },
      ],
    },
    vehicle: {
      title: 'Vehicle Table',
      columns: ['license_plate', 'type', 'personid'],
      primaryKey: 'license_plate',
      primaryKeyLabel: 'License Plate',
      fields: [
        { name: 'license_plate', label: 'License Plate', type: 'text', required: true },
        { name: 'type', label: 'Vehicle Type', type: 'text', required: true },
        { name: 'personid', label: 'Person ID', type: 'number', required: true },
      ],
    },
  };

  const config = tableConfigs[tableName] || tableConfigs.person;

  const tabs = [
    { id: 'view', label: 'View', icon: Eye },
    { id: 'insert', label: 'Insert', icon: Plus },
    { id: 'update', label: 'Update', icon: Edit },
    { id: 'delete', label: 'Delete', icon: Trash2 },
  ];

  const queries = [
  { 
    id: 'all_visitors', 
    name: 'All Visitors',
    sql: 'SELECT * FROM visitor',
  },
  { 
    id: 'all_vehicles', 
    name: 'All Vehicles Linked to Person',
    sql: 'SELECT v.*, p.name FROM vehicle v JOIN person p ON v.personid = p.personid',
  },
  { 
    id: 'active_bands', 
    name: 'Active Visitor Bands',
    sql: 'SELECT * FROM visitor_band WHERE expiry_date >= CURRENT_DATE',
  },
];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">{config.title}</h1>

        <div className="mb-6 flex gap-2 p-2 bg-card border rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "view" && (
  <div className="space-y-6">
    <TableView 
      data={tableData}
      columns={config.columns}
      title={`${config.title} Records`}
    />

    <ViewQueries
      queries={queries}
      onRunQuery={(selectedQuery) => {
        axios.get(`http://localhost:8000/query/${selectedQuery}`)
          .then(res => {
            setTableData(Array.isArray(res.data) ? res.data : []);
            setActiveTab("view");
          })
          .catch(err => console.error("Query failed:", err));
      }}
    />
  </div>
)}

        {activeTab === "insert" && (
          <InsertForm table={tableName} fields={config.fields} />
        )}

        {activeTab === "update" && (
          <UpdateForm table={tableName} fields={config.fields} primaryKey={config.primaryKey} />
        )}

        {activeTab === "delete" && (
          <DeleteForm table={tableName} primaryKey={config.primaryKey} primaryKeyLabel={config.primaryKeyLabel} />
        )}
      </div>
    </div>
  );
};

export default TablePage;
