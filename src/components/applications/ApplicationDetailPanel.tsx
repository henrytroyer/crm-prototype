import { useState, type ReactNode } from "react";
import { getTimelineLabel } from "../../data/timelines";
import { buildMockVolunteerDetail } from "../../data/mockVolunteerDetail";
import type { Volunteer } from "../../types/volunteer";
import {
  displayLocationPreference,
  hasDistinctAssignedLocation,
} from "../../utils/volunteerLocation";
import FormFieldsPanel, { findFormPdf } from "./FormFieldsPanel";
import ItineraryBubbles from "./ItineraryBubbles";
import OnboardingProgress from "./OnboardingProgress";
import SendEmailModal from "./SendEmailModal";
import TermNotesChat from "./TermNotesChat";
import VolunteerContactCard from "./VolunteerContactCard";

type DrillDownView = "application" | "pastor" | null;

interface ApplicationDetailPanelProps {
  volunteer: Volunteer;
  onBack: () => void;
}

export default function ApplicationDetailPanel({
  volunteer,
  onBack,
}: ApplicationDetailPanelProps) {
  const detail = buildMockVolunteerDetail(volunteer);
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [drillDown, setDrillDown] = useState<DrillDownView>(null);
  const timelineLabel = getTimelineLabel(volunteer.timelineId);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-200/60 p-2 shadow-sm">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="shrink-0 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to applications
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <VolunteerContactCard detail={detail} />

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

            {sendEmailOpen && (
              <SendEmailModal
                detail={detail}
                onClose={() => setSendEmailOpen(false)}
              />
            )}

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
                <h4 className="text-sm font-semibold text-slate-700">
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

        {drillDown && (
          <FormFieldsPanel
            title={
              drillDown === "application"
                ? `Full application — ${detail.name}`
                : `Pastor reference — ${detail.name}`
            }
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
            onClose={() => setDrillDown(null)}
          />
        )}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
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
      className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
    >
      <div className="font-semibold">{label}</div>
      <div className="mt-2 text-sm text-slate-500">Open and manage details</div>
    </button>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 font-semibold">{value}</div>
    </div>
  );
}

function TimelineEvent({ date, text }: { date: string; text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
        {date}
      </div>
      <div>{text}</div>
    </div>
  );
}
