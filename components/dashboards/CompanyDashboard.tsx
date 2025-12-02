import React, { useState, useEffect, useCallback } from 'react';
import { User, Car, CarCondition, InsuranceStatus, CarStatus } from '../../types';

const CompanyDashboard: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [myListings, setMyListings] = useState<Car[]>([]);
  const [view, setView] = useState<'listings' | 'add'>('listings');

  // New car form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState(0);
  const [vin, setVin] = useState('');
  const [serviceHistory, setServiceHistory] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<CarCondition>(CarCondition.New);
  const [image, setImage] = useState<string | null>(null);


  const fetchMyListings = useCallback(() => {
    const allCars: Car[] = JSON.parse(localStorage.getItem('cars') || '[]');
    setMyListings(allCars.filter(car => car.ownerId === currentUser.id));
  }, [currentUser.id]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

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
      make, model, year, price, description, condition, vin, serviceHistory,
      ownerId: currentUser.id,
      listedBy: currentUser.name,
      imageUrl: image,
      insuranceStatus: InsuranceStatus.NotRequested,
      status: CarStatus.Available,
    };
    allCars.push(newCar);
    localStorage.setItem('cars', JSON.stringify(allCars));
    alert('Car listed successfully!');
    // Reset form and refetch
    setMake(''); setModel(''); setYear(new Date().getFullYear()); setPrice(0); setDescription(''); setCondition(CarCondition.New); setVin(''); setServiceHistory(''); setImage(null);
    fetchMyListings();
    setView('listings');
  };

  const handleMarkAsSold = (carId: string) => {
    const allCars: Car[] = JSON.parse(localStorage.getItem('cars') || '[]');
    const updatedCars = allCars.map(c => 
      c.id === carId ? { ...c, status: CarStatus.Sold } : c
    );
    localStorage.setItem('cars', JSON.stringify(updatedCars));
    fetchMyListings();
  };

  const renderMyListings = () => (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Our Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myListings.length > 0 ? myListings.map(car => (
          <CarCard key={car.id} car={car} onMarkAsSold={handleMarkAsSold} />
        )) : <p className="text-gray-400 col-span-full">You have no cars listed for sale.</p>}
      </div>
    </div>
  );

  const renderAddCarForm = () => (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">List a New Car</h2>
      <form onSubmit={handleListCar} className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 space-y-4">
        <input className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" type="text" placeholder="Make" value={make} onChange={e => setMake(e.target.value)} required />
        <input className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" type="text" placeholder="Model" value={model} onChange={e => setModel(e.target.value)} required />
        <input className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" type="number" placeholder="Year" value={year} onChange={e => setYear(parseInt(e.target.value))} required />
        <input className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" type="number" placeholder="Price ($)" value={price} onChange={e => setPrice(parseFloat(e.target.value))} required />
        <input className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" type="text" placeholder="VIN" value={vin} onChange={e => setVin(e.target.value)} required />
        <select value={condition} onChange={e => setCondition(e.target.value as CarCondition)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500">
          {Object.values(CarCondition).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
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

        <button type="submit" className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-md transition-colors">List Car</button>
      </form>
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="flex space-x-2 mb-8 border-b border-gray-700">
        <TabButton label="Our Listings" active={view === 'listings'} onClick={() => setView('listings')} />
        <TabButton label="Add New Car" active={view === 'add'} onClick={() => setView('add')} />
      </div>

      {view === 'listings' && renderMyListings()}
      {view === 'add' && renderAddCarForm()}
    </div>
  );
};

const CarCard: React.FC<{car: Car, onMarkAsSold: (id: string) => void}> = ({ car, onMarkAsSold }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
      <div>
        <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover" />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white pr-2">{car.year} {car.make} {car.model}</h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${car.status === CarStatus.Available ? 'bg-cyan-500 text-cyan-900' : 'bg-gray-600 text-gray-200'}`}>{car.status}</span>
          </div>
          <div className="flex justify-between items-baseline">
              <p className="text-cyan-400 text-lg font-semibold">${car.price.toLocaleString()}</p>
              <span className="px-2 py-1 text-xs font-semibold bg-gray-600 text-gray-200 rounded-full">{car.condition}</span>
          </div>
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">{car.description}</p>
        </div>
      </div>
      <div className="p-4 pt-0">
          <div className="mt-4">
              <button 
                onClick={() => onMarkAsSold(car.id)} 
                disabled={car.status === CarStatus.Sold}
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                  {car.status === CarStatus.Available ? 'Mark as Sold' : 'Sold'}
              </button>
          </div>
      </div>
    </div>
);

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

export default CompanyDashboard;