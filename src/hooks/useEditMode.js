import { useState, useEffect, useCallback } from 'react';
import { PIN } from '../data/defaults';

const LOCK_TIMEOUT = 30 * 60 * 1000;

export function useEditMode() {
  const [editMode, setEditMode] = useStorage('em', false);
  const [showPin, setShowPin] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const touch = useCallback(() => setLastActivity(Date.now()), []);

  useEffect(() => {
    if (!editMode) return;
    const id = setInterval(() => {
      if (Date.now() - lastActivity > LOCK_TIMEOUT) {
        setEditMode(false);
      }
    }, 60000);
    return () => clearInterval(id);
  }, [editMode, lastActivity, setEditMode]);

  const toggleEdit = () => {
    if (editMode) {
      setEditMode(false);
      return;
    }
    setShowPin(true);
  };

  const unlockWithPin = (pin) => {
    if (pin === PIN) {
      setEditMode(true);
      setShowPin(false);
      setLastActivity(Date.now());
      return true;
    }
    return false;
  };

  return { editMode, showPin, setShowPin, toggleEdit, unlockWithPin, touch };
}

import { useStorage } from './useStorage';
