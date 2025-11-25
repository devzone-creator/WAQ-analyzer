import { WACWizard } from './components/WACWizard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <WACWizard
            onSubmit={(wikitext) => {
              console.log('Submitted wikitext:', wikitext);
            }}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 md:mt-16 text-center text-gray-600 pb-6 md:pb-8 px-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs md:text-sm font-medium text-gray-700">AID Tool</span>
            <span className="text-xs md:text-sm font-bold text-gray-900">v1.0</span>
          </div>
          <p className="text-xs text-gray-500">
            Wikipedia Article Creation Assistant • Toolforge • MIT License
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
