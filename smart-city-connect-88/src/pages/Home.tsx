import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  BarChart3,
  Wifi,
  Trash2,
  Zap,
  Droplets,
  AlertTriangle,
  TreePine,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import cityHero from "@/assets/city-hero.jpg";

const API_BASE = "http://localhost:8080/api";

const categories = [
  { icon: Zap, label: "Power Outage", color: "text-status-yellow" },
  { icon: Droplets, label: "Water Supply", color: "text-primary" },
  { icon: Wifi, label: "Connectivity", color: "text-primary" },
  { icon: Trash2, label: "Waste Management", color: "text-status-green" },
  { icon: AlertTriangle, label: "Road Damage", color: "text-accent" },
  { icon: TreePine, label: "Parks & Gardens", color: "text-status-green" },
  { icon: Shield, label: "Public Safety", color: "text-status-red" },
  { icon: BarChart3, label: "Other Issues", color: "text-muted-foreground" },
];

const steps = [
  {
    number: "01",
    title: "Submit Your Complaint",
    desc: "Fill out a simple form describing the issue with location and category.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Complaint Assigned",
    desc: "Our system routes your complaint to the relevant city department instantly.",
    icon: Shield,
  },
  {
    number: "03",
    title: "Track in Real-Time",
    desc: "Use your complaint ID to monitor status updates at any time.",
    icon: Search,
  },
  {
    number: "04",
    title: "Issue Resolved",
    desc: "Receive confirmation once the city team marks the issue as resolved.",
    icon: CheckCircle2,
  },
];

export default function Home() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/home/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      setStats([
        { value: "12,400+", label: "Complaints Resolved" },
        { value: "94%", label: "Resolution Rate" },
        { value: "2.3 Days", label: "Avg. Response Time" },
        { value: "8", label: "City Departments" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintClick = () => {
    if (isLoggedIn) navigate("/submit");
    else navigate("/login");
  };

  const handleTrackClick = () => {
    if (isLoggedIn) navigate("/track");
    else navigate("/login");
  };

  const handleCategoryClick = () => {
    if (isLoggedIn) navigate("/submit");
    else navigate("/login");
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={cityHero}
          alt="Smart City Skyline"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />

        <div className="relative z-10 container mx-auto px-4 text-center pt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
            Smart City Initiative — Citizen Portal
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up">
            Your Voice, <span className="text-gradient-cyan">Our Priority</span>
          </h1>

          <p className="text-xl text-gradient-cyan max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Report city issues, track complaint status, and help build a better
            smart city — all in one place.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={handleComplaintClick}
              className="inline-flex items-center gap-2 gradient-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-lg glow-cyan transition-all hover:opacity-90 hover:scale-105"
            >
              <FileText className="h-5 w-5" />
              File a Complaint
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleTrackClick}
              className="inline-flex items-center gap-2 border border-border bg-secondary/50 hover:bg-secondary text-foreground font-semibold px-8 py-3.5 rounded-lg transition-all hover:scale-105"
            >
              <Search className="h-5 w-5" />
              Track My Complaint
            </button>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.3s" }}>
            {loading ? (
              <div className="col-span-4 flex justify-center py-6">
                <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent" />
              </div>
            ) : (
              stats.map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4">
                  <div className="text-2xl md:text-3xl font-bold text-gradient-cyan">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complaint <span className="text-gradient-cyan">Categories</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We handle all kinds of city issues — select the right category for faster resolution.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {categories.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={handleCategoryClick}
                className="card-surface rounded-xl p-5 flex flex-col items-center gap-3 hover:border-primary/40 hover:scale-105 transition-all duration-200 group"
              >
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <span className="text-sm font-medium text-center text-foreground">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-navy-surface/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-gradient-amber">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A simple 4-step process to get your city complaint resolved quickly.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map(({ number, title, desc, icon: Icon }, i) => (
              <div key={number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border z-0" />
                )}
                <div className="card-surface rounded-xl p-6 relative z-10 h-full">
                  <div className="text-4xl font-black text-gradient-cyan opacity-40 mb-3">{number}</div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="card-surface rounded-2xl p-12 text-center max-w-3xl mx-auto border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Report an Issue?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of citizens making their city smarter — one complaint at a time.
            </p>
            <button
              onClick={handleComplaintClick}
              className="inline-flex items-center gap-2 gradient-primary text-primary-foreground font-semibold px-10 py-4 rounded-lg glow-cyan hover:opacity-90 hover:scale-105 transition-all"
            >
              Submit a Complaint
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-gradient-cyan font-bold">SmartCity</span>
            <span>Complaint Management System</span>
          </div>
          <p>© 2026 City Municipal Corporation. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}