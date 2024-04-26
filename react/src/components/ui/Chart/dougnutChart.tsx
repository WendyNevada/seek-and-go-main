import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import chart.js auto bundle

interface OrderStatus {
  order_status: string;
  total: number;
}

interface ChartProps {
  orderData: OrderStatus[];
}

function DoughnutChart({ orderData }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null); // Explicitly specify the ref type

  useEffect(() => {
    if (chartRef.current && orderData) {
      const labels = orderData.map(order => order.order_status);
      const data = orderData.map(order => order.total);

      // Create new chart instance
      const myChart = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Orders',
            data: data,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      // Return a cleanup function to destroy the chart when the component unmounts
      return () => {
        myChart.destroy();
      };
    }
  }, [orderData]);

  return (
    <div>
      {/* Use a callback ref to store the canvas reference */}
      <canvas id="myChart" ref={chartRef}></canvas>
    </div>
  );
}

export default DoughnutChart;
