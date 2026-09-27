import { InventoryApp } from './components/InventoryApp';
import { InventoryProvider } from './context/InventoryContext';
import './App.css';

function App() {
  return (
    <InventoryProvider>
      <InventoryApp />
    </InventoryProvider>
  );
}

export default App;
