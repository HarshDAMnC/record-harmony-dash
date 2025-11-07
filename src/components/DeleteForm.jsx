import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const DeleteForm = ({ table, primaryKey, primaryKeyLabel, onSubmit }) => {
  const [id, setId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      alert(`${primaryKeyLabel} is required`);
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this record?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8000/${table}/delete/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Delete failed: ${error.detail || 'Unknown error'}`);
        return;
      }

      alert('🗑️ Record deleted successfully');
      setId('');
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Error deleting record. Check backend.");
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trash2 className="h-6 w-6 text-destructive" />
        <h3 className="text-xl font-bold text-foreground">Delete Record</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-destructive/10 p-4 rounded-lg mb-4">
          <p className="text-sm text-destructive font-medium">
            Warning: This action cannot be undone.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {primaryKeyLabel} <span className="text-destructive ml-1">*</span>
          </label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            placeholder={`Enter ${primaryKeyLabel.toLowerCase()}`}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-destructive text-destructive-foreground py-3 rounded-lg font-semibold hover:bg-destructive/90 transition-colors shadow-md"
        >
          Delete
        </button>
      </form>
    </div>
  );
};

export default DeleteForm;
