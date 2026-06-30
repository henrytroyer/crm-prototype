import { useCallback, useEffect, useState } from 'react';
import {
  fetchContactDetail,
  updateContactCoreFieldsApi,
} from '../services/contactsApi';
import type { ContactCoreFields } from '../services/contactStorage';
import type { ContactDetail } from '../types/contact';

export function useContactDetail(contactId: string | null) {
  const [detail, setDetail] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!contactId) {
      setDetail(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchContactDetail(contactId);
      setDetail(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load contact',
      );
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateCoreFields = useCallback(
    async (fields: ContactCoreFields) => {
      if (!contactId) return null;
      setSaving(true);
      setError(null);
      try {
        const updated = await updateContactCoreFieldsApi(contactId, fields);
        setDetail(updated);
        return updated;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to save contact',
        );
        return null;
      } finally {
        setSaving(false);
      }
    },
    [contactId],
  );

  return { detail, loading, saving, error, refetch: load, updateCoreFields };
}
