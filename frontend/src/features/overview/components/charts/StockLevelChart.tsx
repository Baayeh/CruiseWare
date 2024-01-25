import Chart from 'react-apexcharts';

/**
 * Renders a stock level chart.
 *
 * @return {JSX.Element} The rendered stock level chart.
 */
const StockLevelChart = () => {
  const theme = localStorage.getItem('app_theme');
  const series = [
    {
      name: 'Marine Sprite',
      data: [44, 55, 41, 37, 22, 43, 21],
    },
    {
      name: 'Striking Calf',
      data: [53, 32, 33, 52, 13, 43, 32],
    },
    {
      name: 'Tank Picture',
      data: [12, 17, 11, 9, 15, 11, 20],
    },
    {
      name: 'Bucket Slope',
      data: [9, 7, 5, 8, 6, 9, 4],
    },
    {
      name: 'Reborn Kid',
      data: [25, 12, 19, 32, 25, 24, 10],
    },
  ];

  const options: ApexCharts.ApexOptions = {
    title: {
      text: 'Stock Levels',
      style: {
        color: 'var(--text-secondary)',
      },
    },
    chart: {
      stacked: true,
      fontFamily: 'Poppins, sans-serif',
      height: '750px',
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontSize: '13px',
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
      labels: {
        colors: 'var(--text-secondary)',
      },
    },
    tooltip: {
      theme: theme === 'dark' ? 'dark' : 'light',
    },
    responsive: [
      {
        breakpoint: 1280,
        options: {},
      },
    ],
  };

  return (
    <div className="stock-levels-chart mt-10 sm:mt-0 border border-[color:var(--border-color)] rounded-xl p-5">
      <Chart options={options} series={series} type="bar" height={400} />
    </div>
  );
};
export default StockLevelChart;
