import React, { useState } from 'react';
import HeroList from './components/HeroList';
import HeroGraph from './components/HeroGraph';

const App: React.FC = () => {
  const [selectedHero, setSelectedHero] = useState<any | null>(null);

  return (
      <div>
        <h1>Star Wars Heroes</h1>
        <HeroList onSelect={setSelectedHero} />
        {selectedHero && <HeroGraph heroId={selectedHero.id} />}
      </div>
  );
};

export default App;