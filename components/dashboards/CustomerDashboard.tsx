import React, { useState, useEffect, useCallback } from 'react';
import { User, Car, CarCondition, InsuranceStatus, CarStatus } from '../../types';

const CustomerDashboard: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [myCars, setMyCars] = useState<Car[]>([]);
  const [view, setView] = useState<'marketplace' | 'mycars' | 'sell'>('marketplace');

  // New car form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [vin, setVin] = useState('');
  const [serviceHistory, setServiceHistory] = useState('');
  const [image, setImage] = useState<string | null>(null);


  const fetchCars = useCallback(() => {
    const allCars: Car[] = JSON.parse(localStorage.getItem('cars') || '[]');
    // Marketplace shows available cars not owned by the current user
    setCars(allCars.filter(car => car.ownerId !== currentUser.id && car.status === CarStatus.Available));
    // My Cars shows cars owned by the current user
    setMyCars(allCars.filter(car => car.ownerId === currentUser.id));
  }, [currentUser.id]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListCar = (e: React.FormEvent) => {
    e.preventDefault();
     if (!image) {
      alert('Please upload an image for the car.');
      return;
    }
    const allCars: Car[] = JSON.parse(localStorage.getItem('cars') || '[]');
    const newCar: Car = {
      id: Date.now().toString(),
      make, model, year, price, description, vin, serviceHistory,
      ownerId: currentUser.id,
      listedBy: currentUser.name,
      condition: CarCondition.Used,
      imageUrl: image,
      insuranceStatus: InsuranceStatus.NotRequested,
      status: CarStatus.Available,
    };
    allCars.push(newCar);
    localStorage.setItem('cars', JSON.stringify(allCars));
    alert('Car listed successfully!');
    // Reset form and refetch cars
    setMake(''); setModel(''); setYear(new Date().getFullYear()); setPrice(0); setDescription(''); setVin(''); setServiceHistory(''); setImage(null);
    fetchCars();
    setView('mycars');
  };

  const renderMarketplace = () => (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.length > 0 ? cars.map(car => (
          <CarCard key={car.id} car={car} />
        )) : <p className="text-gray-400 col-span-full">No cars available in the marketplace right now.</p>}
      </div>
    </div>
  );

  const renderMyCars = () => (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">My Garage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myCars.length > 0 ? myCars.map(car => (
          <CarCard key={car.id} car={car} isOwner={true} />
        )) : <p className="text-gray-400 col-span-full">You don't own any cars yet.</p>}
      </div>
    </div>
  );
  
  const renderSellForm = () => (
     <div>
      <h2 className="text-3xl font-bold text-white mb-6">Sell Your Car</h2>
      <form onSubmit={handleListCar} className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 space-y-4">
        <input className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" type="text" placeholder="Make (e.g., Toyota)" value={make} onChange={e => setMake(e.target.value)} required />
        <input className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" type="text" placeholder="Model (e.g., Camry)" value={model} onChange={e => setModel(e.target.value)} required />
        <input className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" type="number" placeholder="Year" value={year} onChange={e => setYear(parseInt(e.target.value))} required />
        <input className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" type="number" placeholder="Price ($)" value={price} onChange={e => setPrice(parseFloat(e.target.value))} required />
        <input className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" type="text" placeholder="VIN" value={vin} onChange={e => setVin(e.target.value)} required />
        <textarea className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" placeholder="Description (condition, mileage, etc.)" value={description} onChange={e => setDescription(e.target.value)} required />
        <textarea className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" placeholder="Service History Notes" value={serviceHistory} onChange={e => setServiceHistory(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Car Photo</label>
          <input 
            type="file" 
            onChange={handleImageChange} 
            accept="image/png, image/jpeg, image/webp" 
            required
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 cursor-pointer"
          />
        </div>
        {image && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-300 mb-2">Image Preview:</p>
            <img src={image} alt="Preview" className="rounded-lg w-full h-auto max-h-48 object-contain bg-gray-900" />
          </div>
        )}
        <button type="submit" className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-md transition-colors">List My Car</button>
      </form>
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="flex space-x-2 mb-8 border-b border-gray-700">
        <TabButton label="Marketplace" active={view === 'marketplace'} onClick={() => setView('marketplace')} />
        <TabButton label="My Garage" active={view === 'mycars'} onClick={() => setView('mycars')} />
        <TabButton label="Sell a Car" active={view === 'sell'} onClick={() => setView('sell')} />
      </div>

      {view === 'marketplace' && renderMarketplace()}
      {view === 'mycars' && renderMyCars()}
      {view === 'sell' && renderSellForm()}
    </div>
  );
};

const CarCard: React.FC<{car: Car, isOwner?: boolean}> = ({ car, isOwner }) => {
    const getInsuranceBadgeColor = (status: InsuranceStatus) => {
        switch(status) {
            case InsuranceStatus.Approved: return 'bg-green-500 text-green-900';
            case InsuranceStatus.Pending: return 'bg-yellow-500 text-yellow-900';
            case InsuranceStatus.Rejected: return 'bg-red-500 text-red-900';
            default: return 'bg-gray-600 text-gray-200';
        }
    }
    const getStatusBadgeColor = (status: CarStatus) => {
        return status === CarStatus.Available ? 'bg-blue-500 text-blue-900' : 'bg-gray-500 text-gray-900';
    }
  
    return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 transform hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
      <div>
        <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover" />
        <div className="p-4">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{car.year} {car.make} {car.model}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap ${getStatusBadgeColor(car.status)}`}>
                    {car.status}
                </span>
            </div>
            <p className="text-cyan-400 text-lg font-semibold">${car.price.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-1">Sold by: {car.listedBy}</p>
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="mt-2 flex justify-between items-center">
            {isOwner ? (
                 <span className={`px-2 py-1 text-xs font-bold rounded-full ${getInsuranceBadgeColor(car.insuranceStatus)}`}>
                    {car.insuranceStatus}
                 </span>
            ) : (
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-md transition-colors">
                    View Details
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{label: string, active: boolean, onClick: () => void}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
      active ? 'bg-gray-700 text-white border-b-2 border-cyan-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    {label}
  </button>
);


export default CustomerDashboard;