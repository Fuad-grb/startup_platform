import React, { useState } from 'react';
import Button from './ui/Button';

const StartupCard = ({ name, description, category }) => (
  <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold mb-2">{name}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{category}</span>
  </div>
);

const StartupsPage = () => {
  const [filter, setFilter] = useState('All');
  
  // Mock data for startups
  const startups = [
    { id: 1, name: "EcoTech Solutions", description: "Developing sustainable energy solutions for urban environments.", category: "CleanTech" },
    { id: 2, name: "HealthAI", description: "AI-powered health diagnostics and personalized treatment plans.", category: "HealthTech" },
    { id: 3, name: "FinSmart", description: "Revolutionizing personal finance with machine learning algorithms.", category: "FinTech" },
    { id: 4, name: "EduVR", description: "Virtual reality platforms for immersive educational experiences.", category: "EdTech" },
  ];

  const categories = ['All', 'CleanTech', 'HealthTech', 'FinTech', 'EdTech'];

  const filteredStartups = filter === 'All' ? startups : startups.filter(startup => startup.category === filter);

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Startups</h1>
        
        <div className="mb-8">
          {categories.map(category => (
            <Button 
              key={category}
              onClick={() => setFilter(category)}
              className={`mr-2 mb-2 ${filter === category ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map(startup => (
            <StartupCard key={startup.id} {...startup} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartupsPage;