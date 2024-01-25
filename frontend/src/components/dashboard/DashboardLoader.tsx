const DashboardLoader = () => {
  return (
    <div className="dashboard-loader absolute inset-x-0 top-[8rem] bottom-0 grid place-items-center z-40 bg-[color:var(--glass-bg)]">
      <div className="flex flex-col items-center justify-center gap-y-8">
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p>Fetching data...</p>
      </div>
    </div>
  );
};
export default DashboardLoader;
