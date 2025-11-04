import { useState } from 'react';
import { Edit } from 'lucide-react';

const UpdateForm = ({ table, fields, primaryKey, onSubmit }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await fetch(`/api/${table}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      alert('Updated successfully (dummy)');
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
      
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Edit className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Update Record</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <p className="text-sm text-muted-foreground">
            Enter the {primaryKey} and the fields you want to update
          </p>
        </div>
        
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label}
              {field.name === primaryKey && <span className="text-destructive ml-1">*</span>}
            </label>
            
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.name === primaryKey}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.name === primaryKey}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
          </div>
        ))}
        
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateForm;
