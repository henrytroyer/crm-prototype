import { useCallback, useEffect, useState } from "react";
import {
  addLocalTermNote,
  getLocalTermNotes,
} from "../services/termNoteStorage";
import type { TermNote } from "../types/volunteer";

interface UseTermNotesOptions {
  itemId: string;
  timelineId: string;
}

interface UseTermNotesReturn {
  notes: TermNote[];
  sending: boolean;
  error: string | null;
  addNote: (body: string) => Promise<void>;
}

export function useTermNotes({
  itemId,
  timelineId,
}: UseTermNotesOptions): UseTermNotesReturn {
  const [notes, setNotes] = useState<TermNote[]>(() =>
    getLocalTermNotes(itemId, timelineId),
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLocal = useCallback(() => {
    setNotes(getLocalTermNotes(itemId, timelineId));
  }, [itemId, timelineId]);

  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  const addNote = useCallback(
    async (body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;

      setSending(true);
      setError(null);

      try {
        const note = addLocalTermNote(itemId, timelineId, trimmed);
        setNotes((prev) => [...prev, note]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add note");
      } finally {
        setSending(false);
      }
    },
    [itemId, timelineId],
  );

  return { notes, sending, error, addNote };
}
