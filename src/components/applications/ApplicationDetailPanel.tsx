import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavLayer } from "../../context/NavigationHistoryContext";
import { LONGTERM_REFERENCE_TYPE_LABELS } from "../../constants/longtermReferenceSlots";
import { getTimelineLabel } from "../../data/timelines";
import { buildLongtermReferenceSlots } from "../../data/mockLongtermReferences";
import { buildMockVolunteerDetail } from "../../data/mockVolunteerDetail";
import type { Volunteer } from "../../types/volunteer";
import {
  displayLocationPreference,
  hasDistinctAssignedLocation,
} from "../../utils/volunteerLocation";
import FormFieldsPanel, { findFormPdf } from "./FormFieldsPanel";
import ItineraryBubbles from "./ItineraryBubbles";
import LongtermReferencesPanel from "./LongtermReferencesPanel";
import OnboardingProgress from "./OnboardingProgress";
import SendEmailModal from "./SendEmailModal";
import TermNotesChat from "./TermNotesChat";
import VolunteerContactCard from "./VolunteerContactCard";
import ContactCallModal from "../contacts/ContactCallModal";

type DrillDownView = "application" | "pastor" | null;

interface ApplicationDetailPanelProps {
  volunteer: Volunteer;
  onBack: () => void;
  backLabel?: string;
  quickActionsBeforeFiles?: boolean;
}

export default function ApplicationDetailPanel({
  volunteer,
  onBack,
  backLabel = "← Back to short-term applications",
  quickActionsBeforeFiles = false,
}: ApplicationDetailPanelProps) {
  const detail = buildMockVolunteerDetail(volunteer);
  const referenceSlots = useMemo(
    () =>
      quickActionsBeforeFiles
        ? buildLongtermReferenceSlots(volunteer.id)
        : [],
    [quickActionsBeforeFiles, volunteer.id],
  );
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [referenceReminderSlot, setReferenceReminderSlot] = useState<
    number | null
  >(null);
  const [callOpen, setCallOpen] = useState(false);
  const [drillDown, setDrillDown] = useState<DrillDownView>(null);
  const [selectedReferenceSlot, setSelectedReferenceSlot] = useState<
    number | null
  >(null);
  const timelineLabel = getTimelineLabel(volunteer.timelineId);

  const selectedReference = referenceSlots.find(
    (slot) => slot.slotIndex === selectedReferenceSlot,
  );

  const { requestClose: requestCloseDrillDown } = useNavLayer(
    drillDown !== null,
    () => setDrillDown(null),
    `form-${drillDown ?? "none"}-${volunteer.id}`,
  );

  const { requestClose: requestCloseReference } = useNavLayer(
    selectedReferenceSlot !== null,
    () => setSelectedReferenceSlot(null),
    `reference-${selectedReferenceSlot ?? "none"}-${volunteer.id}`,
  );

  const { requestClose: requestCloseEmail } = useNavLayer(
    sendEmailOpen,
    () => {
      setSendEmailOpen(false);
      setReferenceReminderSlot(null);
    },
    `send-email-${volunteer.id}`,
  );

  const { requestClose: requestCloseCall } = useNavLayer(
    callOpen,
    () => setCallOpen(false),
    `call-${volunteer.id}`,
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !drillDown &&
        !sendEmailOpen &&
        !callOpen &&
        selectedReferenceSlot === null
      ) {
        onBack();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onBack, drillDown, sendEmailOpen, callOpen, selectedReferenceSlot]);

  const quickActions = (
    <Panel title="Quick Actions">
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ActionButton
          label="View Full Application"
          onClick={() => setDrillDown("application")}
        />
        <ActionButton
          label="View Pastor Reference"
          onClick={() => setDrillDown("pastor")}
        />
        <ActionButton
          label="Send email"
          onClick={() => setSendEmailOpen(true)}
        />
        <ActionButton label="Open Full CRM Profile" />
      </div>
    </Panel>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-crm-taupe/20 bg-crm-surface p-2 shadow-sm">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-crm-taupe/20 bg-crm-surface">
        <div className="shrink-0 border-b border-crm-taupe/20 bg-crm-taupe-50 px-6 py-4">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-crm-slate hover:text-crm-heading"
          >
            {backLabel}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <VolunteerContactCard
              detail={detail}
              onEmailClick={() => setSendEmailOpen(true)}
              onPhoneClick={() => setCallOpen(true)}
              beforeFiles={quickActionsBeforeFiles ? quickActions : undefined}
              splitFilesRow={quickActionsBeforeFiles}
              besideFiles={
                quickActionsBeforeFiles ? (
                  <LongtermReferencesPanel
                    slots={referenceSlots}
                    onSelectReference={setSelectedReferenceSlot}
                    onSendReminder={(slotIndex) => {
                      setReferenceReminderSlot(slotIndex);
                      setSendEmailOpen(true);
                    }}
                  />
                ) : undefined
              }
            />

            {!quickActionsBeforeFiles && quickActions}

            <Panel title="Onboarding Progress">
              <OnboardingProgress
                steps={detail.onboardingSteps}
                volunteerName={volunteer.name}
              />
            </Panel>

            <Panel title="Placement Details">
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Location preference"
                  value={displayLocationPreference(volunteer)}
                />
                {hasDistinctAssignedLocation(volunteer) && (
                  <InfoCard
                    label="Assigned location"
                    value={volunteer.location}
                  />
                )}
                <InfoCard label="Signup timeline" value={timelineLabel} />
                <InfoCard label="Coordinator" value={detail.coordinator} />
                <InfoCard label="Housing" value={detail.housing} />
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-crm-heading">
                  Itinerary
                </h4>
                <div className="mt-3">
                  <ItineraryBubbles itinerary={detail.itinerary} />
                </div>
              </div>
            </Panel>

            <TermNotesChat
              itemId={volunteer.id}
              timelineId={volunteer.timelineId}
            />

            <Panel title="Application Timeline">
              <div className="mt-4 space-y-3">
                <TimelineEvent date="May 4" text="Application Submitted" />
                <TimelineEvent date="May 6" text="Invoice Sent" />
                <TimelineEvent date="May 10" text="Invoice Paid" />
                <TimelineEvent date="May 15" text="Added To Chat Group" />
              </div>
            </Panel>
          </div>
        </div>

        {sendEmailOpen && (
          <SendEmailModal
            detail={detail}
            onClose={requestCloseEmail}
            initialTemplateId={
              referenceReminderSlot !== null ? "reference-reminder" : undefined
            }
            initialRecipientRole={
              referenceReminderSlot !== null ? "volunteer" : undefined
            }
            extraMergeContext={
              referenceReminderSlot !== null
                ? {
                    referenceType:
                      referenceSlots[referenceReminderSlot]?.type ?? "",
                    referenceTypeLabel:
                      LONGTERM_REFERENCE_TYPE_LABELS[
                        referenceSlots[referenceReminderSlot]?.type ?? "friend"
                      ],
                  }
                : undefined
            }
          />
        )}

        {callOpen && detail.phone !== '—' && (
          <ContactCallModal
            contactName={detail.name}
            phone={detail.phone}
            onClose={requestCloseCall}
          />
        )}

        {selectedReference &&
          selectedReference.status === "received" &&
          selectedReference.formFields && (
            <FormFieldsPanel
              title={`${LONGTERM_REFERENCE_TYPE_LABELS[selectedReference.type]} reference — ${selectedReference.refereeName}`}
              backLabel={detail.name}
              fields={selectedReference.formFields}
              emptyMessage="No reference fields on this item."
              onClose={requestCloseReference}
            />
          )}

        {drillDown && (
          <FormFieldsPanel
            title={
              drillDown === "application"
                ? `Full application — ${detail.name}`
                : `Pastor reference — ${detail.name}`
            }
            backLabel={detail.name}
            fields={
              drillDown === "application"
                ? detail.applicationFormFields
                : detail.pastorReferenceFormFields
            }
            emptyMessage={
              drillDown === "application"
                ? "No additional application fields on this item."
                : "No pastor reference fields on this item."
            }
            pdfFile={
              drillDown === "application"
                ? findFormPdf(detail.files, /application.*form/i)
                : findFormPdf(detail.files, /pastor.*reference/i)
            }
            onClose={requestCloseDrillDown}
          />
        )}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-crm-taupe/20 bg-crm-white p-5">
      <h3 className="text-lg font-semibold text-crm-heading">{title}</h3>
      {children}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-crm-taupe/20 bg-crm-surface p-4 text-left transition hover:bg-crm-taupe-50"
    >
      <div className="font-semibold">{label}</div>
      <div className="mt-2 text-sm text-crm-slate">Open and manage details</div>
    </button>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-crm-surface p-4 ring-1 ring-crm-taupe/20">
      <div className="text-sm text-crm-slate">{label}</div>
      <div className="mt-2 font-semibold">{value}</div>
    </div>
  );
}

function TimelineEvent({ date, text }: { date: string; text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-crm-surface p-4 ring-1 ring-crm-taupe/20">
      <div className="rounded-full bg-crm-white px-3 py-1 text-sm font-semibold">
        {date}
      </div>
      <div>{text}</div>
    </div>
  );
}
