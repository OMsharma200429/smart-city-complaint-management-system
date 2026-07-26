import { useState } from "react";
import { CheckCircle2, Upload, MapPin, AlertCircle } from "lucide-react";

const categories = [
  "Power Outage",
  "Water Supply",
  "Road Damage",
  "Waste Management",
  "Street Lighting",
  "Sewage/Drainage",
  "Parks & Gardens",
  "Public Safety",
  "Noise Pollution",
  "Air Pollution",
  "Internet/Connectivity",
  "Other",
];

const priorities = [
  { value: "low", label: "Low", desc: "Non-urgent, minor inconvenience" },
  { value: "medium", label: "Medium", desc: "Moderate impact on daily life" },
  { value: "high", label: "High", desc: "Significant disruption or safety risk" },
];

function generateId() {
  return "CMP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function SubmitComplaint() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [form, setForm] = useState({
    citizen: "",
    email: "",
    phone: "",
    category: "",
    priority: "medium",
    subject: "",
    description: "",
    location: "",
    ward: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.citizen.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  };

  const handleChange = (key: string, value: string) => {
  setForm((prev) => ({
    ...prev,
    [key]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [key]: "",
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    return;
  }

  try {
    setLoading(true);

    const id = generateId();

    const res = await fetch("http://localhost:8080/api/complaints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complaintId: id,
        ...form,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to submit");
    }

    setComplaintId(id);
    setSubmitted(true);
    
    setForm({
  citizen: "",
  email: "",
  phone: "",
  category: "",
  priority: "medium",
  subject: "",
  description: "",
  location: "",
  ward: "",
});

  } catch (err) {
    console.error(err);
    alert("Error submitting complaint");
  } finally {
    setLoading(false);
  }
};

  if (submitted) {
    return (
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="card-surface rounded-2xl p-12 flex flex-col items-center gap-6">
            <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center glow-cyan animate-pulse-glow">
              <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Complaint Submitted!</h1>
            <p className="text-muted-foreground">
              Your complaint has been successfully registered. Use your ID to track progress.
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-xl px-8 py-4 w-full">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Your Complaint ID</div>
              <div className="text-3xl font-black text-gradient-cyan tracking-widest">{complaintId}</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Please save this ID. A confirmation will be sent to <strong className="text-foreground">{form.email}</strong>
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => { setSubmitted(false); setForm({ citizen: "", email: "", phone: "", category: "", priority: "medium", subject: "", description: "", location: "", ward: "" }); }}
                className="flex-1 border border-border bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2.5 rounded-lg transition-all"
              >
                Submit Another
              </button>
              <a
                href="/track"
                className="flex-1 gradient-primary text-primary-foreground font-medium py-2.5 rounded-lg text-center glow-cyan hover:opacity-90 transition-all"
              >
                Track Status
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">
            Submit a <span className="text-gradient-cyan">Complaint</span>
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below and our team will address your concern promptly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface rounded-2xl p-8 flex flex-col gap-6">
          {/* Personal Info */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={form.citizen}
                  onChange={(e) => handleChange("citizen", e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full bg-secondary border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.name ? "border-destructive" : "border-border"}`}
                />
                {errors.name && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full bg-secondary border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.email ? "border-destructive" : "border-border"}`}
                />
                {errors.email && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Ward / Zone</label>
                <input
                  type="text"
                  value={form.ward}
                  onChange={(e) => handleChange("ward", e.target.value)}
                  placeholder="e.g. Ward 14 - North"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Complaint Details */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">
              Complaint Details
            </h2>
            <div className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className={`w-full bg-secondary border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.category ? "border-destructive" : "border-border"}`}
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {priorities.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => handleChange("priority", p.value)}
                        className={`flex-1 py-2 px-2 rounded-lg border text-xs font-medium transition-all ${
                          form.priority === p.value
                            ? p.value === "high"
                              ? "bg-destructive/10 border-destructive text-destructive"
                              : p.value === "medium"
                              ? "bg-accent/10 border-accent text-accent"
                              : "bg-status-green/10 border-status-green text-status-green"
                            : "border-border text-muted-foreground hover:border-foreground"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Subject *</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="Brief title of the issue"
                  className={`w-full bg-secondary border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.subject ? "border-destructive" : "border-border"}`}
                />
                {errors.subject && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  placeholder="Describe the issue in detail — when it started, how it affects you, etc."
                  className={`w-full bg-secondary border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${errors.description ? "border-destructive" : "border-border"}`}
                />
                {errors.description && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  <MapPin className="inline h-3.5 w-3.5 mr-1 text-primary" />
                  Location / Address *
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Street address, landmark, or GPS coordinates"
                  className={`w-full bg-secondary border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.location ? "border-destructive" : "border-border"}`}
                />
                {errors.location && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.location}</p>}
              </div>

              {/* File Upload (visual only) */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Attach Photos / Evidence</label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload or drag & drop</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</span>
                  <input type="file" className="hidden" multiple accept="image/*,.pdf" />
                </label>
              </div>
            </div>
          </div>

          <button
  type="submit"
  disabled={loading}
  className="w-full gradient-primary text-primary-foreground font-semibold py-3.5 rounded-lg"
>
  {loading ? "Submitting..." : "Submit Complaint"}
</button>
        </form>
      </div>
    </main>
  );  
}
