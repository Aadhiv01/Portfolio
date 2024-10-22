import { Routes, Route } from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

import Home from './components/Home';

import './App.css';

function App() {
  return (
    <div className="App">
        <Routes>
            <Route exact path="/" element={<Home />} />
        </Routes>
    </div>
  );
}

export default App;
