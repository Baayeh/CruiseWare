import { TablePagination } from '@mui/material';

interface PaginatorProps {
  page: number;
  rows: number;
  totalRecords: number | undefined;
  setPage: (first: number) => void;
  setRows: (rows: number) => void;
}

const PaginatorWrapper: React.FC<PaginatorProps> = ({
  page,
  rows,
  totalRecords,
  setPage,
  setRows,
}) => {
  const onPageChange = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const onRowsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRows(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TablePagination
        component="div"
        page={page}
        count={totalRecords!}
        onPageChange={onPageChange}
        rowsPerPageOptions={[10, 20, 30]}
        rowsPerPage={rows}
        onRowsPerPageChange={onRowsChange}
        labelRowsPerPage="Rows:"
        className="flex sm:block justify-center"
      />
    </>
  );
};

export default PaginatorWrapper;
