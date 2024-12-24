import { HistoryTable } from "./components/history-table/HistoryTableContent";

export function HistoryView() {
  return (
    <div className="min-h-screen relative flex flex-col px-2 md:px-auto gap-10">
      <HistoryTable />
    </div>
  );
}
