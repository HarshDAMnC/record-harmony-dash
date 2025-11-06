import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const InsertForm = ({ table, fields, onSubmit }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/${table}/insert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Insert failed: ${error.detail || 'Unknown error'}`);
        return;
      }

      alert('✅ Record inserted successfully');
      
      // Clear form
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
      
      if (onSubmit) onSubmit(); // refresh view if required
    } catch (error) {
      console.error('Insert error:', error);
      alert('❌ Error inserting record. Check backend.');
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Insert New Record</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>

            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
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
                required={field.required}
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default InsertForm;
