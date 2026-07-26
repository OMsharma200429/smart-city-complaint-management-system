import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

type Status = "Submitted" | "Under Review" | "In Progress" | "Resolved";

type ComplaintType = {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high";
  location: string;
  submittedBy: string;
  date: string;
  status: Status;
  timeline: { status: string; date: string; note: string; done: boolean }[];
};

const statusColors: Record<Status, string> = {
  "Submitted": "text-status-yellow border-status-yellow bg-status-yellow/10",
  "Under Review": "text-primary border-primary bg-primary/10",
  "In Progress": "text-accent border-accent bg-accent/10",
  "Resolved": "text-status-green border-status-green bg-status-green/10",
};

const priorityColors = {
  low: "text-status-green bg-status-green/10 border-status-green",
  medium: "text-accent bg-accent/10 border-accent",
  high: "text-destructive bg-destructive/10 border-destructive",
};

export default function TrackComplaint() {
  const [email, setEmail] = useState("");
  const [complaints, setComplaints] = useState<ComplaintType[]>([]);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ComplaintType | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const res = await fetch(`http://localhost:8080/api/complaints/${query}`);

      if (!res.ok) {
        throw new Error("Not Found");
      }

      const data = await res.json();

      const formatted: ComplaintType = {
        id: data.complaintId,
        subject: data.subject,
        category: data.category,
        priority: data.priority,
        location: data.location,
        submittedBy: data.citizen || "N/A",
        date: new Date(data.createdAt).toLocaleDateString(),
        status: data.status,
        timeline: data.timeline || [],
      };

      setResult(formatted);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const findComplaints = async () => {
    if (!email.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/complaints/search?email=${email}`
      );

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((c: any) => ({
          id: c.complaintId,
          subject: c.subject,
          category: c.category,
          priority: c.priority,
          location: c.location,
          submittedBy: c.citizen || "N/A",
          date: new Date(c.createdAt).toLocaleDateString(),
          status: c.status,
          timeline: c.timeline || [],
        }));
        setComplaints(formatted);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error(err);
      setComplaints([]);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">
            Track Your <span className="text-gradient-cyan">Complaint</span>
          </h1>
          <p className="text-muted-foreground">
            Enter your complaint ID to check the current status and timeline.
          </p>
        </div>

        {/* Search Box */}
        <div className="card-surface rounded-2xl p-6 mb-6">
          <label className="block text-sm font-medium mb-2">Complaint ID</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. CMP-XYZ123"
              className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="gradient-primary px-5 py-2.5 rounded-lg flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Track
            </button>
          </div>

          {notFound && <p className="mt-2 text-red-500 text-sm">Complaint not found</p>}
          {result && (
            <div className="mt-4 p-4 border rounded-lg bg-secondary">
              <p><b>ID:</b> {result.id}</p>
              <p><b>Subject:</b> {result.subject}</p>
              <p><b>Status:</b> {result.status}</p>
              <p><b>Submitted By:</b> {result.submittedBy}</p>
              <p><b>Date:</b> {result.date}</p>
            </div>
          )}
        </div>

        {/* EMAIL SEARCH */}
        <div className="card-surface rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Forgot Complaint ID?</h3>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm"
            />
            <button
              onClick={findComplaints}
              className="gradient-primary px-5 py-2.5 rounded-lg"
            >
              Find
            </button>
          </div>
        </div>

        {/* EMAIL RESULTS */}
        {complaints.length > 0 && (
          <div className="card-surface rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Your Complaints</h3>
            {complaints.map((c) => (
              <div key={c.id} className="mb-4 border-b pb-3">
                <p><b>ID:</b> {c.id}</p>
                <p><b>Subject:</b> {c.subject}</p>
                <p><b>Status:</b> {c.status}</p>
                <p><b>Submitted By:</b> {c.submittedBy}</p>
                <p><b>Date:</b> {c.date}</p>
              </div>
            ))}
          </div>
        )}

        {complaints.length === 0 && email && (
          <p className="text-center text-muted-foreground mt-4">
            No complaints found for this email
          </p>
        )}

      </div>
    </main>
  );
}