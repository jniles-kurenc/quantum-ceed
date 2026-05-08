import { useCallback, useEffect, useState } from 'react';
import { getLog, saveLog } from './storage';
import type { DailyLog } from './types';

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useDailyLog(dateISO: string = todayISO()) {
  const [log, setLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    let alive = true;
    getLog(dateISO).then((l) => {
      if (alive) setLog(l);
    });
    return () => {
      alive = false;
    };
  }, [dateISO]);

  const toggle = useCallback(
    async (taskId: string) => {
      if (!log) return;
      const next: DailyLog = {
        ...log,
        completed: { ...log.completed, [taskId]: !log.completed[taskId] },
      };
      setLog(next);
      await saveLog(next);
    },
    [log],
  );

  const setPhoto = useCallback(
    async (taskId: string, uri: string) => {
      if (!log) return;
      const next: DailyLog = {
        ...log,
        photos: { ...log.photos, [taskId]: uri },
        completed: { ...log.completed, [taskId]: true },
      };
      setLog(next);
      await saveLog(next);
    },
    [log],
  );

  const setSpermTest = useCallback(
    async (data: NonNullable<DailyLog['spermTest']>) => {
      if (!log) return;
      const next: DailyLog = { ...log, spermTest: data };
      setLog(next);
      await saveLog(next);
    },
    [log],
  );

  return { log, toggle, setPhoto, setSpermTest };
}
