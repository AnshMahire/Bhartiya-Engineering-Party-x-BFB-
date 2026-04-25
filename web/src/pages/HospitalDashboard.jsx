import { useEffect, useMemo, useState } from "react";
import { confirmHospital, getHospitalAlert } from "../services/api";
import ActionButton from "../components/ActionButton";
import NotificationBanner from "../components/NotificationBanner";
import LoadingAnimation from "../components/LoadingAnimation";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import Sidebar from "../components/ui/Sidebar";
import Topbar from "../components/ui/Topbar";
import Table from "../components/ui/Table";

function getToneFromMessage(message) {
  if (message?.toLowerCase().includes("confirmed")) {
    return "success";
  }
  if (message?.toLowerCase().includes("unable") || message?.toLowerCase().includes("failed")) {
    return "danger";
  }
  return "info";
}

function HospitalDashboard() {
  const [emergency, setEmergency] = useState(null);
  const [message, setMessage] = useState("No incoming patient");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tone, setTone] = useState("info");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const load = async () => {
      const data = await getHospitalAlert();
      setEmergency(data);
      setLoading(false);
    };

    load();
    const timer = setInterval(load, 2000);
    return () => clearInterval(timer);
  }, []);

  const onConfirm = async () => {
    setBusy(true);
    try {
      const next = await confirmHospital();
      setEmergency(next);
      const updatedMessage = "Bed allocation confirmed";
      setMessage(updatedMessage);
      setTone(getToneFromMessage(updatedMessage));
    } catch {
      const updatedMessage = "Unable to confirm bed allocation";
      setMessage(updatedMessage);
      setTone(getToneFromMessage(updatedMessage));
    } finally {
      setBusy(false);
    }
  };

  const requestRows = useMemo(
    () =>
      emergency?.requestId
        ? [
            {
              id: emergency.requestId,
              request: emergency.requestId,
              patient: emergency.patient?.name || "-",
              ambulance: emergency.ambulance?.id || "-",
              eta: `${emergency.eta ?? 0} mins`,
              priority: "High"
            }
          ]
        : [],
    [emergency]
  );

  const bedCards = useMemo(() => {
    const hasEmergency = Boolean(emergency?.requestId);
    const confirmed = Boolean(emergency?.hospital?.confirmed);

    return [
      {
        id: "bed-1",
        label: "Bed A1",
        status: hasEmergency ? "Occupied" : "Free",
        patient: hasEmergency ? emergency?.patient?.name || "Unknown" : "-"
      },
      {
        id: "bed-2",
        label: "Bed B2",
        status: confirmed ? "Occupied" : "Maintenance",
        patient: confirmed ? emergency?.patient?.name || "Unknown" : "-"
      },
      {
        id: "bed-3",
        label: "Bed C3",
        status: hasEmergency && !confirmed ? "Occupied" : "Free",
        patient: hasEmergency && !confirmed ? emergency?.patient?.name || "Unknown" : "-"
      },
      {
        id: "bed-4",
        label: "Bed D4",
        status: "Free",
        patient: "-"
      }
    ];
  }, [emergency]);

  const renderDashboardSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Incoming Patient"
          value={emergency?.patient?.name || "-"}
          trend="Live triage stream"
          trendTone="blue"
        />
        <StatCard
          title="Avg Response"
          value={`${emergency?.eta ?? 0} min`}
          trend="Current ETA window"
          trendTone="yellow"
        />
        <StatCard
          title="Assigned Ambulance"
          value={emergency?.ambulance?.id || "-"}
          trend={emergency?.ambulance?.driverName || "Driver not assigned"}
          trendTone="red"
        />
        <StatCard
          title="Bed Status"
          value={emergency?.hospital?.confirmed ? "Ready" : "Pending"}
          trend="Allocation state"
          trendTone={emergency?.hospital?.confirmed ? "green" : "yellow"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card title="Ambulance Tracking" subtitle="Map placeholder for hospital operations" className="xl:col-span-2">
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
            Live map panel placeholder
          </div>
        </Card>

        <Card title="Incoming Queue" subtitle="Latest emergency context">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Request ID</span>
              <span className="font-medium text-slate-800">{emergency?.requestId || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Emergency Status</span>
              <StatusBadge
                label={emergency?.emergencyStatus || "idle"}
                tone={emergency?.emergencyStatus === "completed" ? "green" : "red"}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Hospital</span>
              <span className="font-medium text-slate-800">{emergency?.hospital?.name || "-"}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRequestsSection = () => (
    <div className="space-y-4">
      <Card title="Incoming Requests" subtitle="Emergency queue and preparation actions">
        <Table
          columns={[
            { key: "request", label: "Request" },
            { key: "patient", label: "Patient" },
            { key: "ambulance", label: "Ambulance" },
            { key: "eta", label: "ETA" },
            { key: "priority", label: "Priority" }
          ]}
          rows={requestRows.map((row) => ({
            ...row,
            priority: <StatusBadge label={row.priority} tone="red" />
          }))}
          emptyMessage="No active incoming requests"
          renderActions={() => (
            <div className="flex flex-wrap gap-2">
              <ActionButton variant="ghost" className="text-xs">
                Prepare Bed
              </ActionButton>
              <ActionButton variant="success" className="text-xs" onClick={onConfirm} disabled={busy || !emergency?.requestId}>
                Mark Ready
              </ActionButton>
            </div>
          )}
        />
      </Card>

      <Card title="Operations Map" subtitle="Visual request location placeholder">
        <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
          Incoming request map placeholder
        </div>
      </Card>
    </div>
  );

  const renderBedsSection = () => (
    <div className="space-y-4">
      <Card title="Bed Management" subtitle="Color-coded availability overview">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {bedCards.map((bed) => {
            const borderTone =
              bed.status === "Occupied"
                ? "border-red-200"
                : bed.status === "Free"
                  ? "border-green-200"
                  : "border-blue-200";

            const badgeTone =
              bed.status === "Occupied"
                ? "red"
                : bed.status === "Free"
                  ? "green"
                  : "blue";

            return (
              <div key={bed.id} className={`rounded-2xl border bg-white p-4 shadow-sm ${borderTone}`}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800">{bed.label}</p>
                  <StatusBadge label={bed.status} tone={badgeTone} />
                </div>
                <p className="mt-3 text-sm text-gray-500">Patient</p>
                <p className="text-sm font-medium text-slate-800">{bed.patient}</p>
                <div className="mt-4 flex gap-2">
                  <ActionButton variant={bed.status === "Free" ? "success" : "ghost"} className="text-xs">
                    {bed.status === "Free" ? "Assign" : "Details"}
                  </ActionButton>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  const renderAnalyticsSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Patients" value={emergency?.requestId ? "1" : "0"} trend="Today" trendTone="blue" />
        <StatCard title="Avg Response Time" value={`${emergency?.eta ?? 0} min`} trend="Current stream" trendTone="yellow" />
        <StatCard title="Outcome Rate" value={emergency?.hospital?.confirmed ? "94%" : "76%"} trend="Recovery KPI" trendTone="green" />
        <StatCard title="Admissions" value={emergency?.emergencyStatus === "completed" ? "1" : "0"} trend="Resolved cases" trendTone="red" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Response Trend" subtitle="Chart placeholder" className="lg:col-span-2">
          <div className="h-48 rounded-xl bg-gradient-to-r from-red-50 via-blue-50 to-green-50" />
        </Card>
        <Card title="Outcome Donut" subtitle="UI-only donut chart placeholder">
          <div className="mx-auto mt-2 flex h-40 w-40 items-center justify-center rounded-full border-[18px] border-red-200 border-t-green-400 border-r-blue-400">
            <span className="text-sm font-semibold text-slate-700">KPI</span>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    if (activeTab === "requests") {
      return renderRequestsSection();
    }

    if (activeTab === "beds") {
      return renderBedsSection();
    }

    if (activeTab === "analytics") {
      return renderAnalyticsSection();
    }

    if (activeTab === "settings") {
      return (
        <Card title="Settings" subtitle="UI-only panel to match dashboard shell">
          <p className="text-sm text-gray-500">Settings controls can be integrated here without backend changes.</p>
        </Card>
      );
    }

    return renderDashboardSection();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4">
        {loading ? <LoadingAnimation label="Checking incoming alerts..." /> : null}
      </div>

      <NotificationBanner message={message} tone={tone} />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[250px_1fr]">
        <div>
          <Sidebar activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="space-y-4">
          <Topbar
            title="Hospital Emergency Dashboard"
            subtitle="Manage incoming requests, beds, and live operations"
            emergencyStatus={emergency?.emergencyStatus || "idle"}
          />

          {renderActiveSection()}

          <Card title="Critical Action" subtitle="Keep existing confirm handler intact">
            <div className="flex flex-wrap items-center gap-2">
              <ActionButton
                onClick={onConfirm}
                disabled={busy || !emergency?.requestId}
                variant="success"
              >
                Confirm Bed Allocation
              </ActionButton>
              <StatusBadge
                label={emergency?.hospital?.confirmed ? "Allocation Confirmed" : "Allocation Pending"}
                tone={emergency?.hospital?.confirmed ? "green" : "yellow"}
              />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default HospitalDashboard;
