import { Home } from 'lucide-react';

export const Logo = () => (
  <div className="flex items-center gap-2">
    <Home className="w-6 h-6 text-indigo-600" />
    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
      FlatShare
    </h1>
  </div>
);