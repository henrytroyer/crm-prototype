import { useMemo, useState } from "react";
import ApplicationDetailPanel from "../components/applications/ApplicationDetailPanel";
import ApplicationFilters from "../components/applications/ApplicationFilters";
import PipelineSection from "../components/applications/PipelineSection";
import {
  applicationPipeline,
  countVolunteers,
} from "../data/mockApplications";
import type { ApplicationFilterState, Volunteer } from "../types/volunteer";
import {
  countMatchingVolunteers,
  emptyFilters,
  filterPipeline,
} from "../utils/filterApplications";

export default function ApplicationsPage() {
  const [filters, setFilters] = useState<ApplicationFilterState>(emptyFilters);
  const [selectedApplication, setSelectedApplication] =
    useState<Volunteer | null>(null);

  const totalCount = useMemo(
    () => countVolunteers(applicationPipeline),
    [],
  );

  const matchingCount = useMemo(
    () => countMatchingVolunteers(applicationPipeline, filters),
    [filters],
  );

  const filteredPipeline = useMemo(
    () => filterPipeline(applicationPipeline, filters),
    [filters],
  );

  const showingDetail = selectedApplication !== null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-4xl font-bold">Applications</h1>
        {!showingDetail && (
          <p className="mt-2 text-slate-500">
            Track volunteers through onboarding, references, placement, and
            deployment.
          </p>
        )}
      </div>

      {showingDetail && selectedApplication && (
        <ApplicationDetailPanel
          volunteer={selectedApplication}
          onBack={() => setSelectedApplication(null)}
        />
      )}

      {!showingDetail && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ApplicationFilters
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(emptyFilters)}
            matchingCount={matchingCount}
            totalCount={totalCount}
          />

          {filteredPipeline.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No volunteers match these filters
              </p>
              <p className="mt-2 text-slate-500">
                Try clearing filters or selecting different locations or timelines.
              </p>
              <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="mt-6 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-8 pb-4">
              {filteredPipeline.map((section) => (
                <PipelineSection
                  key={section.stage}
                  section={section}
                  onSelectVolunteer={setSelectedApplication}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
