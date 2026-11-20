import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { DashboardSkeleton } from "../../components/common/LoadingSkeleton";

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api
      .get(API_PATHS.TASKS.USER_DASHBOARD)
      .then(({ data: result }) => {
        if (active) setData(result);
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load your dashboard.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-100 bg-white p-5 text-sm text-rose-700"
      >
        {error}
      </div>
    );
  }

  const statistics = data?.statistics || {};
  const cards = [
    ["Total Tasks", statistics.totalTasks],
    ["Pending", statistics.pendingTasks],
    ["Completed", statistics.completedTasks],
    ["Overdue", statistics.overdueTasks],
  ];

  return (
    <section className="mx-auto w-full max-w-[1120px]">
      <h1 className="text-[26px] font-bold leading-tight text-[#0F172A]">
        My Dashboard
      </h1>
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-slate-900">{value ?? 0}</h2>
            <p className="mt-1 text-xs font-medium uppercase text-slate-400">
              {label}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Recent Tasks</h2>
        <div className="mt-3 divide-y divide-slate-100">
          {(data?.recentTasks || []).map((task) => (
            <Link
              key={task._id}
              to={`/user/task-details/${task._id}`}
              className="block py-3 text-sm hover:bg-slate-50"
            >
              <span className="font-semibold text-slate-800">{task.title}</span>
              <span className="ml-3 text-slate-500">
                {task.status} · {task.priority}
              </span>
            </Link>
          ))}
          {!data?.recentTasks?.length && (
            <p className="py-6 text-center text-sm text-slate-500">
              No recent tasks.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
