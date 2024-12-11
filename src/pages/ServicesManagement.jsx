import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const ServicesManagement = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Basic Wash', price: 15.99, duration: 30 },
    { id: 2, name: 'Premium Wash', price: 25.99, duration: 45 },
    { id: 3, name: 'Full Detail', price: 99.99, duration: 180 },
  ]);

  const [newService, setNewService] = useState({
    name: '',
    price: '',
    duration: '',
  });

  const [editingService, setEditingService] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingService) {
      setEditingService((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewService((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingService) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingService.id ? editingService : service
        )
      );
      setEditingService(null);
      toast.success('Service updated successfully');
    } else {
      const serviceToAdd = {
        id: services.length + 1,
        name: newService.name,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration),
      };
      setServices((prev) => [...prev, serviceToAdd]);
      setNewService({ name: '', price: '', duration: '' });
      toast.success('Service added successfully');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setNewService({ name: '', price: '', duration: '' });
  };

  const handleDelete = (id) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
    toast.success('Service deleted successfully');
  };

  const handleCancel = () => {
    setEditingService(null);
    setNewService({ name: '', price: '', duration: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">
          {editingService ? 'Edit Service' : 'Add New Service'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Name</label>
            <Input
              type="text"
              name="name"
              value={editingService ? editingService.name : newService.name}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <Input
              type="number"
              name="price"
              value={editingService ? editingService.price : newService.price}
              onChange={handleInputChange}
              required
              step="0.01"
              min="0"
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <Input
              type="number"
              name="duration"
              value={editingService ? editingService.duration : newService.duration}
              onChange={handleInputChange}
              required
              min="1"
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-3 flex justify-end space-x-2">
            {editingService && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {editingService ? 'Update Service' : 'Add Service'}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Available Services</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${service.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.duration} mins
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="outline" onClick={() => handleEdit(service)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;