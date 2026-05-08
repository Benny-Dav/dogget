import { useMemo, useState } from "react";
import { CalendarClock, Download, Wallet, X } from "lucide-react";
import { formatMoney } from "../lib/api";
import { payoutRuns } from "../features/vendor/vendorMock";
import { useUIStore } from "../stores/uiStore";

const statusFilters = ["All", "Pending", "Paid", "Failed"];

const statusClass = {
  Pending: "bg-[#fff5e6] text-[#8a5a08]",
  Paid: "bg-emerald-50 text-emerald-700",
  Failed: "bg-rose-50 text-rose-600",
};

const addMoney = (items) => ({
  amount: items.reduce((sum, item) => sum + item.amount, 0),
  currency: items[0]?.currency ?? "GHS",
});

const VendorPayoutsPage = () => {
  const toast = useUIStore((s) => s.toast);
  const [filter, setFilter] = useState("All");
  const [selectedRunId, setSelectedRunId] = useState(null);

  const filteredRuns = filter === "All" ? payoutRuns : payoutRuns.filter((run) => run.status === filter);
  const selectedRun = payoutRuns.find((run) => run.id === selectedRunId);

  const summary = useMemo(() => {
    const pending = payoutRuns.filter((run) => run.status === "Pending");
    const paid = payoutRuns.filter((run) => run.status === "Paid");

    return {
      available: addMoney(pending.map((run) => run.net)),
      paid: addMoney(paid.map((run) => run.net)),
      nextDate: pending[0]?.scheduledFor ?? "Not scheduled",
    };
  }, []);

  return (
    <div className="px-5 py-5">
      <h2 className="text-2xl font-bold text-[#2f2f2f]">Payouts</h2>
      <p className="mt-1 text-sm text-gray-500">Track earnings, commission, net payouts, and payout status.</p>

      <section className="mt-6 rounded-[1.75rem] bg-[#2f2f2f] p-5 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <Wallet className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">Available payout</p>
            <p className="text-2xl font-extrabold">{formatMoney(summary.available)}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs text-white/50">Paid to date</p>
            <p className="mt-1 font-bold">{formatMoney(summary.paid)}</p>
          </div>
          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs text-white/50">Next payout</p>
            <p className="mt-1 font-bold">{summary.nextDate}</p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[1.5rem] bg-white p-4 text-sm text-gray-600 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-start gap-3">
          <CalendarClock className="mt-0.5 h-5 w-5 text-[#f4a52c]" />
          <div>
            <p className="font-bold text-[#2f2f2f]">Weekly payout schedule</p>
            <p className="mt-1 leading-6">Payouts are reviewed weekly. Minimum payout threshold is GHS 100 after commission.</p>
          </div>
        </div>
      </section>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map((status) => {
          const count = status === "All" ? payoutRuns.length : payoutRuns.filter((run) => run.status === status).length;
          const isActive = filter === status;

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                isActive ? "bg-[#f4a52c] text-white" : "bg-white text-gray-500 ring-1 ring-gray-100"
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        {filteredRuns.map((run) => (
          <button
            key={run.id}
            type="button"
            onClick={() => setSelectedRunId(run.id)}
            className="w-full rounded-[1.5rem] bg-white p-5 text-left shadow-sm ring-1 ring-gray-100"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{run.id}</p>
                <h3 className="mt-1 text-lg font-bold text-[#2f2f2f]">{run.period}</h3>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[run.status]}`}>
                {run.status}
              </span>
            </div>
            <div className="mt-5 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>Gross</span><span>{formatMoney(run.gross)}</span></div>
              <div className="flex justify-between"><span>Dogget commission</span><span>{formatMoney(run.commission)}</span></div>
              <div className="flex justify-between border-t border-gray-100 pt-3 font-bold text-gray-900"><span>Net payout</span><span>{formatMoney(run.net)}</span></div>
            </div>
          </button>
        ))}
      </div>

      {selectedRun && (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/35">
          <button className="absolute inset-0 cursor-default" type="button" onClick={() => setSelectedRunId(null)} aria-label="Close payout detail" />
          <section className="relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[2rem] bg-white px-5 pb-8 pt-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f4a52c]">Payout detail</p>
                <h3 className="mt-1 text-xl font-bold text-[#2f2f2f]">{selectedRun.id}</h3>
              </div>
              <button onClick={() => setSelectedRunId(null)} className="rounded-full bg-gray-100 p-2 text-gray-500" type="button">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#fcfcfb] p-4 text-sm text-gray-600 ring-1 ring-gray-100">
              <div className="flex justify-between"><span>Period</span><span className="font-bold text-gray-900">{selectedRun.period}</span></div>
              <div className="mt-2 flex justify-between"><span>Orders</span><span className="font-bold text-gray-900">{selectedRun.orderCount}</span></div>
              <div className="mt-2 flex justify-between"><span>Reference</span><span className="font-bold text-gray-900">{selectedRun.reference}</span></div>
            </div>

            <div className="mt-5 space-y-2 rounded-2xl bg-[#2f2f2f] p-5 text-sm text-white/80">
              <div className="flex justify-between"><span>Gross sales</span><span>{formatMoney(selectedRun.gross)}</span></div>
              <div className="flex justify-between"><span>Dogget commission</span><span>-{formatMoney(selectedRun.commission)}</span></div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-base font-bold text-white"><span>Net payout</span><span>{formatMoney(selectedRun.net)}</span></div>
            </div>

            <section className="mt-5">
              <h4 className="font-bold text-[#2f2f2f]">Payout method</h4>
              <div className="mt-3 rounded-2xl bg-[#fcfcfb] p-4 text-sm leading-6 text-gray-600 ring-1 ring-gray-100">
                <p><span className="font-semibold text-gray-900">Method:</span> {selectedRun.method}</p>
                <p><span className="font-semibold text-gray-900">Account:</span> {selectedRun.accountName}</p>
                <p><span className="font-semibold text-gray-900">Number:</span> {selectedRun.accountRef}</p>
              </div>
            </section>

            <section className="mt-5">
              <h4 className="font-bold text-[#2f2f2f]">Timeline</h4>
              <div className="mt-3 space-y-3">
                {selectedRun.timeline.map((event) => (
                  <div key={`${event.label}-${event.at}`} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f4a52c]" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{event.label}</p>
                      <p className="text-xs text-gray-400">{event.at}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={() => toast(`${selectedRun.id} receipt export is a mock action`, "info")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f4a52c] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[#f4a52c]/25"
            >
              <Download className="h-4 w-4" />
              Download receipt
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default VendorPayoutsPage;
