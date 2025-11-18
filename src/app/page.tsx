import { CalculatorForm } from '@/components/calculator-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Emissions Calculator
              </h1>
          
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Calculate the environmental impact of private jet flights. Compare emissions across 48+ aircraft models 
                and understand the carbon footprint of luxury aviation.
              </p>
        </div>
        
        <CalculatorForm />
        
        <div className="mt-12 text-center text-sm text-slate-400">
          <p>
            Data based on industry-standard fuel consumption rates and emission factors. 
            Results are estimates for educational purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
