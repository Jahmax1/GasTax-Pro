import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function TaxImpact() {
  const pieData = {
    labels: ['Roads', 'Education', 'Healthcare', 'Other'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336'],
        borderColor: ['#fff'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Tax Impact</h1>
      <div className="bg-gray-800 p-4 rounded-lg max-w-lg mx-auto card-hover">
        <h2 className="text-xl font-semibold mb-2">How Your Taxes Are Used</h2>
        <Pie
          data={pieData}
          options={{
            plugins: {
              legend: { labels: { color: 'white' } },
              tooltip: { backgroundColor: '#1f2937', titleColor: 'white', bodyColor: 'white' },
            },
          }}
        />
        <p className="mt-4 text-gray-300">
          Your fuel taxes contribute to public services like road maintenance, education,
          and healthcare. Thank you for supporting our community!
        </p>
      </div>
    </div>
  );
}

export default TaxImpact;