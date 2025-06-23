import { useState, useCallback } from "react";

export interface UseModalOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * Custom hook for managing modal state
 * Provides consistent state management and callbacks for modals
 */
export const useModal = ({
  defaultOpen = false,
  onOpen,
  onClose,
}: UseModalOptions = {}): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
};

/**
 * Hook for managing multiple modals with named keys
 * Useful when you have multiple modals in a single component
 */
export const useModals = (
  modalNames: string[],
): Record<string, UseModalReturn> => {
  const modals = modalNames.reduce(
    (acc, name) => {
      acc[name] = useModal();
      return acc;
    },
    {} as Record<string, UseModalReturn>,
  );

  return modals;
};

export default useModal;
