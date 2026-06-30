import { LayoutProvider } from './context/LayoutContext';
import { NavigationHistoryProvider } from './context/NavigationHistoryContext';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <LayoutProvider>
      <NavigationHistoryProvider>
        <Dashboard />
      </NavigationHistoryProvider>
    </LayoutProvider>
  );
}
