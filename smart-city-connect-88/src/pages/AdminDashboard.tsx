import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, LogOut, Loader2, Eye } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

type Complaint = {
  id: number;
  citizen: string;
  name?: string;
  email?: string;
  phone?: string;

  subject: string;
  category: string;
  status: string;
  priority: string;
  description: string;
  remark: string;

  location?: string;
  ward?: string;
};

const ALL_STATUSES = ["Submitted", "Under Review", "In Progress", "Resolved"];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [remarkDraft, setRemarkDraft] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // AUTH
  useEffect(() => {
    if (!token || role !== "ADMIN") navigate("/admin/login");
  }, [navigate, token, role]);

  // FETCH
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/complaints/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const mapped = data.map((c: any) => ({
        id: c.id,
        citizen: c.citizen || c.name ||"Unknown",
        name: c.citizen || c.name,
        email: c.email,
        phone: c.phone,
        subject: c.subject,
        category: c.category,
        status: c.status,
        priority: c.priority,
        description: c.description,
        remark: c.remark || "",
        location: c.location || "N/A",
        ward: c.ward || "N/A",
      }));

      setComplaints(mapped);
    } catch (err) {
      console.error(err);
      alert("Error fetching complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // FILTER
  const filteredComplaints =
    statusFilter === "All"
      ? complaints
      : complaints.filter(c => c.status === statusFilter);

  const statusCounts: any = {};
  ["All", ...ALL_STATUSES].forEach(status => {
    statusCounts[status] =
      status === "All"
        ? complaints.length
        : complaints.filter(c => c.status === status).length;
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const handleQuickStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await fetch(`${API_BASE}/complaints/${id}/status?status=${status}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      setComplaints(prev =>
        prev.map(c => (c.id === id ? { ...c, status } : c))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    } finally {
      setUpdating(null);
    }
  };

  const openModal = (row: Complaint) => {
    setSelected(row);
    setNewStatus(row.status);
    setRemarkDraft(row.remark || "");
  };

  const handleSaveModal = async () => {
    if (!selected) return;

    setUpdating(selected.id);

    try {
      await fetch(`${API_BASE}/complaints/${selected.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          remark: remarkDraft,
        }),
      });

      setComplaints(prev =>
        prev.map(c =>
          c.id === selected.id
            ? { ...c, status: newStatus, remark: remarkDraft }
            : c
        )
      );

      setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Error saving complaint");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "text-green-400";
      case "In Progress":
        return "text-blue-400";
      case "Under Review":
        return "text-purple-400";
      case "Submitted":
        return "text-yellow-400";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* HEADER */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-primary glow-cyan">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Admin Panel</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-accent/10 border border-accent/40 text-accent px-4 py-2 rounded-md text-sm font-semibold hover:bg-accent/20 transition-all"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="pt-24 container mx-auto px-6">

        {/* FILTER */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {["All", ...ALL_STATUSES].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition
                ${statusFilter === status
                  ? "bg-primary text-white border-primary"
                  : "bg-background border-border hover:bg-primary/10"
                }`}
            >
              {status} ({statusCounts[status]})
            </button>
          ))}

          <button
            onClick={fetchComplaints}
            className="px-4 py-2 rounded-full text-sm font-semibold border border-indigo-400 text-indigo-400 hover:bg-indigo-500/10 transition"
          >
            Refresh
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
            <table className="w-full text-sm text-left">

              <thead className="bg-primary/70 text-white">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Citizen</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints.map(row => (
                  <tr key={row.id} className="border-b hover:bg-muted/40 transition">
                    <td className="px-6 py-3">{row.id}</td>
                    <td className="px-6 py-3">{row.citizen}</td>
                    <td className="px-6 py-3">{row.subject}</td>
                    <td className="px-6 py-3">{row.category}</td>

                    <td className="px-6 py-3">
                      {updating === row.id ? (
                        <Loader2 className="animate-spin mx-auto" />
                      ) : (
                        <select
                          value={row.status}
                          onChange={(e) =>
                            handleQuickStatus(row.id, e.target.value)
                          }
                          className={`bg-transparent font-semibold focus:outline-none cursor-pointer ${getStatusColor(row.status)}`}
                        >
                          {ALL_STATUSES.map(s => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td className="px-6 py-3">
                      <button
                        onClick={() => openModal(row)}
                        className="text-primary hover:opacity-70"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </main>

      {/* 🔥 MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">

          <div className="bg-[#0f172a] text-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto border border-white/10">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Complaint Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-red-400 text-xl">✕</button>
            </div>

            {/* PERSONAL */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div><span className="text-gray-400">Name</span><br />{selected.name}</div>
              <div><span className="text-gray-400">Email</span><br />{selected.email}</div>
              <div><span className="text-gray-400">Phone</span><br />{selected.phone}</div>
              <div><span className="text-gray-400">Ward</span><br />{selected.ward}</div>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-white/10 pt-4">
              <div>ID: {selected.id}</div>
              <div>Category: {selected.category}</div>
              <div>Priority: {selected.priority}</div>
              <div>Status: {selected.status}</div>

              <div className="col-span-2">Location: {selected.location}</div>
              <div className="col-span-2">Subject: {selected.subject}</div>
              <div className="col-span-2">Description: {selected.description}</div>
            </div>

            {/* UPDATE */}
            <div className="mt-6 border-t border-white/10 pt-4">

              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#1e293b] mb-3"
              >
                {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>

              <textarea
                value={remarkDraft}
                onChange={(e) => setRemarkDraft(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#1e293b] mb-3"
                placeholder="Add remark..."
              />

              <div className="flex justify-end gap-3">
                <button onClick={() => setSelected(null)} className="bg-gray-700 px-4 py-2 rounded">Cancel</button>
                <button onClick={handleSaveModal} className="bg-blue-600 px-4 py-2 rounded">
                  {updating === selected.id ? "Saving..." : "Save"}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}