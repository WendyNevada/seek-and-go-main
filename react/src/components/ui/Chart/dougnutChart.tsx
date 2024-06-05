import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import chart.js auto bundle

function getOrderStatusColor(status: string): string {
    switch (status) {
      case "NEW":
        return 'rgba(0, 0, 255, 0.5)'; // BIRU (BLUE)
      case "APV":
        return 'rgba(255, 255, 0, 0.5)'; // KUNING (YELLOW)
      case "RJT":
        return 'rgba(255, 0, 0, 0.5)'; // MERAH (RED)
      case "CAN":
        return 'rgba(0, 0, 0, 0.5)'; // ITEM (BLACK)
      case "PAY":
        return 'rgba(0, 255, 0, 0.5)'; // IJO (GREEN)
      case "CPY":
        return 'rgba(255, 165, 0, 0.5)'; // OREN (ORANGE)
      case "RTP":
        return 'rgba(128, 0, 128, 0.5)'; // UNGU (PURPLE)
      default:
        return 'rgba(0, 0, 0, 0.5)'; // Default color
    }
  }

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
      const backgroundColor = labels.map(status => getOrderStatusColor(status));

      // Create new chart instance
    //   const myChart = new Chart(chartRef.current, {
    //     type: 'doughnut',
    //     data: {
    //        labels: labels,
    //         //labels : ['red','blue', 'green'],
    //         datasets: [{
    //         label: 'Total Orders',
    //         data: data,
    //         //data: [10,20,30],
    //         backgroundColor: [
    //             'rgb(255, 99, 132)',//red
    //             'rgb(54, 162, 235)',//blue
    //             'rgb(255, 205, 86)',//yellow
    //             'rgb(75, 192, 192)', //navy
    //             'rgb(153, 102, 255)', //purple
    //             'rgb(255, 159, 64)', //orange
    //             'rgb(0, 0, 0)' // black
    //           ],
    //       }]
    //     },
    //     // options: {
    //     //   scales: {
    //     //     y: {
    //     //       beginAtZero: true
    //     //     }
    //     //   }
    //     // }
    //   });
    const myChart = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColor,
            borderWidth: 1
          }]
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
