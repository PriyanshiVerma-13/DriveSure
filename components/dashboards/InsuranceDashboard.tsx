import React, { useState, useEffect, useCallback } from 'react';
import { Car, InsuranceStatus } from '../../types';
import { getInsuranceAssessment } from '../../services/geminiService';
import { ShieldCheckIcon } from '../common/Icons';

const InsuranceDashboard: React.FC = () => {
  const [carsForReview, setCarsForReview] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [aiAssessment, setAiAssessment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [premium, setPremium] = useState('');

  const fetchCarsForReview = useCallback(() => {
    const allCars: Car[] = JSON.parse(localStorage.getItem('cars') || '[]');
    // For this demo, we assume any car is available for insurance review.
    // In a real app, this would be based on explicit requests.
    // We'll also seed a request for demo purposes.
    if (allCars.length > 0 && allCars[0].insuranceStatus === InsuranceStatus.NotRequested) {
        allCars[0].insuranceStatus = InsuranceStatus.Pending;
        localStorage.setItem('cars', JSON.stringify(allCars));
    }
    setCarsForReview(allCars.filter(c => c.insuranceStatus === InsuranceStatus.Pending));
  }, []);

  useEffect(() => {
    fetchCarsForReview();
  }, [fetchCarsForReview]);

  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
    setAiAssessment('');
    setError('');
    setPremium('');
  };

  const handleGetAssessment = async () => {
    if (!selectedCar) return;
    setIsLoading(true);
    setError('');
    try {
      const assessment = await getInsuranceAssessment(selectedCar);
      setAiAssessment(assessment);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecision = (decision: 'approve' | 'reject') => {
    if (!selectedCar) return;

    if (decision === 'approve' && (!premium || isNaN(parseFloat(premium)))) {
        setError('Please enter a valid annual premium to approve.');
        return;
    }

    const allCars: Car[] = JSON.parse(localStorage.getItem('cars') || '[]');
    const carIndex = allCars.findIndex(c => c.id === selectedCar.id);
    if(carIndex !== -1) {
        allCars[carIndex].insuranceStatus = decision === 'approve' ? InsuranceStatus.Approved : InsuranceStatus.Rejected;
        if(decision === 'approve') {
            allCars[carIndex].insurancePremium = parseFloat(premium);
        } else {
            delete allCars[carIndex].insurancePremium;
        }
        localStorage.setItem('cars', JSON.stringify(allCars));
    }
    setSelectedCar(null);
    fetchCarsForReview();
  };

  return (
    <div className="container mx-auto flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/3">
        <h2 className="text-3xl font-bold text-white mb-6">Pending Reviews</h2>
        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
            {carsForReview.length > 0 ? carsForReview.map(car => (
            <div key={car.id} onClick={() => handleSelectCar(car)} className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${selectedCar?.id === car.id ? 'bg-cyan-900/50 border-cyan-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}>
                <p className="font-bold text-white">{car.year} {car.make} {car.model}</p>
                <p className="text-sm text-gray-400">Owner: {car.listedBy}</p>
                 <p className="text-xs text-gray-500">VIN: {car.vin}</p>
            </div>
            )) : <p className="text-gray-400">No pending insurance reviews.</p>}
        </div>
      </div>

      <div className="lg:w-2/3">
        {selectedCar ? (
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">Reviewing: {selectedCar.year} {selectedCar.make} {selectedCar.model}</h3>
            <img src={selectedCar.imageUrl} alt="Car" className="w-full h-64 object-cover rounded-lg mb-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <p><strong className="text-gray-300">VIN:</strong> {selectedCar.vin}</p>
              <p><strong className="text-gray-300">Condition:</strong> {selectedCar.condition}</p>
              <p><strong className="text-gray-300">Price:</strong> ${selectedCar.price.toLocaleString()}</p>
            </div>
            
            <p className="text-sm"><strong className="text-gray-300">Description:</strong> {selectedCar.description}</p>

            {selectedCar.serviceHistory && (
                <div className="mt-4 bg-gray-900/50 p-3 rounded-md">
                    <p className="text-sm font-semibold text-gray-300">Service History Notes:</p>
                    <p className="text-sm text-gray-400 whitespace-pre-wrap">{selectedCar.serviceHistory}</p>
                </div>
            )}
            
            <div className="my-6 p-4 bg-gray-900 rounded-lg">
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">AI Underwriter Assistant</h4>
                {aiAssessment ? (
                    <p className="text-gray-300 italic">{aiAssessment}</p>
                ) : (
                    <button onClick={handleGetAssessment} disabled={isLoading} className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-md transition-colors disabled:bg-gray-600">
                        {isLoading ? 'Assessing...' : 'Get AI Assessment'}
                    </button>
                )}
            </div>
            
            {aiAssessment && (
                 <div className="mt-4">
                    <label htmlFor="premium" className="block text-sm font-medium text-gray-300">Proposed Annual Premium ($)</label>
                    <input 
                        type="number"
                        id="premium"
                        value={premium}
                        onChange={(e) => setPremium(e.target.value)}
                        placeholder="e.g., 1500"
                        className="mt-1 w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                 </div>
            )}

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

            <div className="flex space-x-4 mt-6">
                <button onClick={() => handleDecision('approve')} className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors">Approve</button>
                <button onClick={() => handleDecision('reject')} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors">Reject</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-800 p-10 rounded-xl border border-dashed border-gray-700">
            <ShieldCheckIcon className="h-16 w-16 text-gray-600 mb-4" />
            <p className="text-xl font-semibold text-gray-400">Select a car to review</p>
            <p className="text-gray-500">Details and AI assessment tools will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceDashboard;