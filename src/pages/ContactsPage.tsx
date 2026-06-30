import { useEffect, useMemo, useState } from 'react';
import ContactDetailPanel from '../components/contacts/ContactDetailPanel';
import ContactFilters from '../components/contacts/ContactFilters';
import ContactList from '../components/contacts/ContactList';
import { useLayout } from '../context/LayoutContext';
import { useNavLayer } from '../context/NavigationHistoryContext';
import { useContactsList } from '../hooks/useContactsList';
import type { ContactListItem } from '../types/contact';
import { emptyContactFilters } from '../types/contact';
import {
  countMatchingContacts,
  filterContacts,
} from '../utils/filterContacts';
import { ingestPendingDonations } from '../services/contactsApi';

export default function ContactsPage({
  onGoToRecruitment,
  onGoToApplication,
}: {
  onGoToRecruitment?: (prospectId: string) => void;
  onGoToApplication?: (applicationId: string) => void;
}) {
  const [filters, setFilters] = useState(emptyContactFilters());
  const [selectedContact, setSelectedContact] =
    useState<ContactListItem | null>(null);

  const { requestClose: requestCloseContact } = useNavLayer(
    selectedContact !== null,
    () => setSelectedContact(null),
    `contact-${selectedContact?.id ?? 'none'}`,
  );

  const { contacts, loading, error, isMock, refetch } = useContactsList();

  const filtered = useMemo(
    () => filterContacts(contacts, filters),
    [contacts, filters],
  );

  const matchingCount = useMemo(
    () => countMatchingContacts(contacts, filters),
    [contacts, filters],
  );

  const showingDetail = selectedContact !== null;

  const { setDetailMode } = useLayout();

  useEffect(() => {
    setDetailMode(showingDetail);
    return () => setDetailMode(false);
  }, [showingDetail, setDetailMode]);

  useEffect(() => {
    let cancelled = false;

    async function syncDonations() {
      const synced = await ingestPendingDonations();
      if (!cancelled && synced.length > 0) {
        refetch();
      }
    }

    void syncDonations();

    return () => {
      cancelled = true;
    };
  }, [refetch]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-6 flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-crm-heading">Contacts</h1>
          {!showingDetail && (
            <>
              <p className="mt-2 text-crm-slate">
                Master list of volunteers, pastors, parents, and donors.
              </p>
              {!isMock && (
                <p className="mt-2 text-xs text-crm-slate">
                  Live data from monday.com Contacts board
                </p>
              )}
              {isMock && (
                <p className="mt-2 text-xs text-amber-700">
                  Mock data mode (VITE_USE_MOCK_DATA=true)
                </p>
              )}
            </>
          )}
        </div>
        {!isMock && !showingDetail && (
          <button
            type="button"
            onClick={refetch}
            disabled={loading}
            className="rounded-2xl border border-crm-taupe/20 bg-crm-surface px-4 py-2 text-sm font-medium text-crm-heading transition hover:bg-crm-taupe-50 disabled:opacity-50"
          >
            Refresh
          </button>
        )}
      </div>

      {showingDetail && selectedContact && (
        <ContactDetailPanel
          contact={selectedContact}
          onBack={requestCloseContact}
          onGoToRecruitment={onGoToRecruitment}
          onGoToApplication={onGoToApplication}
          onContactUpdated={refetch}
          onSelectContact={(id) => {
            const next = contacts.find((c) => c.id === id);
            if (next) setSelectedContact(next);
          }}
        />
      )}

      {!showingDetail && loading && (
        <div className="rounded-3xl border border-crm-taupe/20 bg-crm-surface p-8 text-center text-crm-slate">
          Loading contacts…
        </div>
      )}

      {!showingDetail && error && !loading && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-800">Could not load contacts</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <p className="mt-3 text-sm text-red-600">
            Set{' '}
            <code className="rounded bg-red-100 px-1">
              VITE_CONTACTS_BOARD_ID
            </code>{' '}
            in .env or enable mock mode.
          </p>
        </div>
      )}

      {!showingDetail && !loading && !error && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-crm-taupe/20 bg-crm-surface p-2 shadow-sm">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-crm-taupe/20 bg-crm-surface">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="p-4 pb-0">
                <ContactFilters
                  filters={filters}
                  onChange={setFilters}
                  onClear={() => setFilters(emptyContactFilters())}
                  matchingCount={matchingCount}
                  totalCount={contacts.length}
                />
              </div>
              <ContactList
                contacts={filtered}
                onSelect={setSelectedContact}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
