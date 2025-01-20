import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from 'primereact/button';

export const NotFound = () => {
 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-3xl font-semibold text-gray-800">Page Not Found</p>
        <p className="text-gray-600 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            
          >
            <ArrowLeft size={20} />
            Go Back
          </Button>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => window.location.href = '/login'}
          >
            <Home size={20} />
            Home Page
          </Button>
        </div>
      </div>
    </div>
  );
};

