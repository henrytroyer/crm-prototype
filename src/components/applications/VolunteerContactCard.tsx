import { type ReactNode } from 'react';
import { getTimelineLabel } from '../../data/timelines';
import type { VolunteerDetail } from '../../types/volunteer';
import VolunteerFilesSection from './VolunteerFilesSection';
import {
  displayLocationPreference,
  hasDistinctAssignedLocation,
} from '../../utils/volunteerLocation';
import VolunteerAvatar from './VolunteerAvatar';

interface VolunteerContactCardProps {
  detail: VolunteerDetail;
}

export default function VolunteerContactCard({
  detail,
}: VolunteerContactCardProps) {
  const timelineLabel = getTimelineLabel(detail.timelineId);

  return (
    <div className="rounded-2xl border border-crm-taupe/20 bg-gradient-to-br from-crm-taupe-50 to-crm-surface p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <VolunteerAvatar
          name={detail.name}
          profilePhotoUrl={detail.profilePhotoUrl}
          size="lg"
        />

        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold text-crm-heading">{detail.name}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-crm-white px-3 py-1 text-sm text-crm-text">
              {displayLocationPreference(detail)}
            </span>
            {hasDistinctAssignedLocation(detail) && (
              <span className="rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-800">
                Assigned: {detail.location}
              </span>
            )}
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              {timelineLabel}
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
              {detail.status}
            </span>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <ContactField label="Email">
              {detail.email !== '—' ? (
                <a
                  href={`mailto:${detail.email}`}
                  className="font-medium text-crm-heading underline-offset-2 hover:underline"
                >
                  {detail.email}
                </a>
              ) : (
                <span className="text-crm-slate">Not provided</span>
              )}
            </ContactField>
            <ContactField label="Phone">
              {detail.phone !== '—' ? (
                <a
                  href={`tel:${detail.phone.replace(/\s/g, '')}`}
                  className="font-medium text-crm-heading underline-offset-2 hover:underline"
                >
                  {detail.phone}
                </a>
              ) : (
                <span className="text-crm-slate">Not provided</span>
              )}
            </ContactField>
          </dl>
        </div>
      </div>

      <VolunteerFilesSection
        volunteerName={detail.name}
        profilePhotoUrl={detail.profilePhotoUrl}
        files={detail.files}
        showOtherFiles
      />
    </div>
  );
}

function ContactField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-crm-surface/80 px-4 py-3 ring-1 ring-crm-taupe/20/80">
      <dt className="text-xs font-medium uppercase tracking-wide text-crm-slate">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
