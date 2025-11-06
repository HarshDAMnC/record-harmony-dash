import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TableView from '../components/TableView';
import { Users, UserCheck, CreditCard, Car } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const [personData, setPersonData] = useState([]);
  const personColumns = ['personid', 'name', 'role', 'contact', 'biometric_data'];

  // Fetch data on component mount
  useEffect(() => {
    axios.get("http://localhost:8000/person/all")
      .then(response => {
        // Assuming backend returns: { users: [...] }
        setPersonData(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error("Error fetching person data:", error);
      });
  }, []);

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
