import { useMemo } from "react";
import NavigationCard from "../components/NavigationCard";

function NavigationView({ emergency, onPickup, busy, message }) {
  const isToPatient = emergency?.phase === "to_patient";
  const isToHospital = emergency?.phase === "to_hospital";

  const patientCardRows = useMemo(() => {
    if (!emergency?.requestId) {
      return [];
    }

    return [
      { label: "Patient", value: emergency.patient.name },
      { label: "Location", value: `${emergency.patient.lat}, ${emergency.patient.lng}` },
      { label: "ETA", value: emergency.eta === 0 ? "Arrived" : `${emergency.eta} mins` }
    ];
  }, [emergency]);

  const hospitalRows = useMemo(() => {
    if (!emergency?.requestId) {
      return [];
    }

    return [
      { label: "Hospital", value: emergency.hospital.name },
      { label: "Beds / ICU", value: `${emergency.hospital.beds} / ${emergency.hospital.icu}` },
      { label: "Emergency Status", value: emergency.emergencyStatus }
    ];
  }, [emergency]);

  return (
    <div className="space-y-4">
      <NavigationCard
        title="Navigation"
        description={isToHospital ? "Route updated: Proceed to hospital" : "Route to patient"}
        badge={isToHospital ? "To Hospital" : "To Patient"}
        rows={patientCardRows}
        actions={[
          {
            label: "Call Patient",
            onClick: () => window.alert("Calling patient..."),
            disabled: !emergency?.requestId,
            primary: false
          },
          {
            label: "Reached Patient",
            onClick: onPickup,
            disabled: busy || !isToPatient,
            primary: true
          }
        ]}
      />

      <NavigationCard
        title="Hospital Route"
        description="Destination after pickup"
        badge={emergency?.hospital?.confirmed ? "Bed Confirmed" : "Awaiting Bed Confirm"}
        rows={hospitalRows}
        actions={[
          {
            label: "Reached Hospital",
            onClick: () => window.alert("Hospital arrival auto-updates from tracking simulation."),
            disabled: !isToHospital,
            primary: true
          }
        ]}
      />

      <NavigationCard
        title="Driver Notes"
        description="Live dispatch updates"
        rows={[{ label: "Latest", value: message }]}
      />
    </div>
  );
}

export default NavigationView;
