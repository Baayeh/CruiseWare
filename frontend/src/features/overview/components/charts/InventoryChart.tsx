import { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useAppSelector, useFetch } from '../../../../hooks';
import { selectInventory, setAllInventories } from '../../../inventories';

/**
 * Renders the InventoryChart component.
 *
 * @return {JSX.Element} The rendered InventoryChart component.
 */
const InventoryChart = () => {
  const { allInventories } = useAppSelector(selectInventory);

  const { fetchData } = useFetch('inventory', setAllInventories);

  const labels = allInventories?.map((inventory) => inventory.name);
  const series =
    (allInventories?.map((inventory) =>
      Number(inventory.productCount)
    ) as number[]) || [];

  useEffect(() => {
    fetchData();
  }, []);

  const options: ApexCharts.ApexOptions = {
    title: {
      text: 'Distribution of Products',
      style: {
        color: 'var(--text-secondary)',
      },
    },
    noData: {
      text: 'Loading...',
    },
    chart: {
      id: 'inventory-chart',
      fontFamily: 'Poppins, sans-serif',
    },
    labels: labels,
    legend: {
      labels: {
        colors: 'var(--text-secondary)',
      },
    },
    responsive: [
      {
        breakpoint: 885,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div className="inventory-chart border border-[color:var(--border-color)] rounded-xl p-5">
      <Chart
        options={options}
        series={series}
        type="pie"
        width={600}
        height={400}
      />
    </div>
  );
};
export default InventoryChart;
