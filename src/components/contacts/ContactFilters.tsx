import {
  CONTACT_TAGS,
  CONTACT_TAG_LABELS,
  type ContactFilterState,
} from '../../types/contact';
import { hasActiveContactFilters, toggleContactTag } from '../../utils/filterContacts';
import { contactTagFilterSelectedClass } from '../../utils/contactTagStyles';

interface ContactFiltersProps {
  filters: ContactFilterState;
  onChange: (filters: ContactFilterState) => void;
  onClear: () => void;
  matchingCount: number;
  totalCount: number;
}

const inputClass =
  'mt-2 w-full rounded-2xl border border-crm-taupe/20 bg-crm-surface px-4 py-2.5 text-sm text-crm-text outline-none focus:border-crm-slate focus:ring-2 focus:ring-crm-taupe/20';

export default function ContactFilters({
  filters,
  onChange,
  onClear,
  matchingCount,
  totalCount,
}: ContactFiltersProps) {
  const active = hasActiveContactFilters(filters);

  return (
    <div className="mb-8 rounded-3xl border border-crm-taupe/20 bg-crm-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-crm-heading">Filters</h2>
        {active && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-2xl border border-crm-taupe/20 px-4 py-2 text-sm font-medium text-crm-heading transition hover:bg-crm-taupe-50"
          >
            Clear all
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-crm-slate">
        Showing {matchingCount} of {totalCount} contacts
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <label
            htmlFor="contact-search"
            className="text-sm font-medium text-crm-heading"
          >
            Search by name or email
          </label>
          <input
            id="contact-search"
            type="search"
            placeholder="Search contacts..."
            value={filters.searchQuery}
            onChange={(e) =>
              onChange({ ...filters, searchQuery: e.target.value })
            }
            className={inputClass}
          />
        </div>

        <div>
          <span className="text-sm font-medium text-crm-heading">Tags</span>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...filters, tags: [] })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filters.tags.length === 0
                  ? 'bg-crm-indigo-50 text-crm-heading font-medium ring-1 ring-crm-indigo/10'
                  : 'bg-crm-white text-crm-text hover:bg-crm-taupe-100'
              }`}
            >
              All
            </button>
            {CONTACT_TAGS.map((tag) => {
              const selected = filters.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      tags: toggleContactTag(filters.tags, tag),
                    })
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? contactTagFilterSelectedClass(tag)
                      : 'bg-crm-white text-crm-text hover:bg-crm-taupe-100'
                  }`}
                >
                  {CONTACT_TAG_LABELS[tag]}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-crm-slate">
            Choose All or one or more tags to narrow the list.
          </p>
        </div>
      </div>
    </div>
  );
}
