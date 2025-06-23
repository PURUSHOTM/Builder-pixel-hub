import React, { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  preventBodyScroll?: boolean;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export interface ModalHeaderProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const Modal: React.FC<ModalProps> & {
  Header: React.FC<ModalHeaderProps>;
  Footer: React.FC<ModalFooterProps>;
} = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  overlayClassName,
  preventBodyScroll = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  // Store the previously focused element when modal opens
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;

    // Get all focusable elements
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    firstFocusableElement.current = focusableElements[0] as HTMLElement;
    lastFocusableElement.current = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // Focus the first focusable element or the modal itself
    const elementToFocus = firstFocusableElement.current || modal;
    setTimeout(() => elementToFocus.focus(), 0);

    // Return focus to previously focused element when modal closes
    return () => {
      if (previouslyFocusedElement.current) {
        setTimeout(() => previouslyFocusedElement.current?.focus(), 0);
      }
    };
  }, [isOpen]);

  // Body scroll prevention
  useEffect(() => {
    if (!isOpen || !preventBodyScroll) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, preventBodyScroll]);

  // Keyboard event handling
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        if (!firstFocusableElement.current || !lastFocusableElement.current) {
          return;
        }

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableElement.current) {
            event.preventDefault();
            lastFocusableElement.current.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableElement.current) {
            event.preventDefault();
            firstFocusableElement.current.focus();
          }
        }
      }
    },
    [isOpen, closeOnEscape, onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose],
  );

  // Prevent event bubbling inside modal content
  const handleModalClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    [],
  );

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        overlayClassName,
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div
        ref={modalRef}
        className={cn(
          "relative w-full bg-background border shadow-lg rounded-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "max-h-[90vh] overflow-y-auto",
          sizeClasses[size],
          className,
        )}
        onClick={handleModalClick}
        tabIndex={-1}
      >
        {/* Close button */}
        {showCloseButton && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 z-10 h-6 w-6 p-0 opacity-70 hover:opacity-100"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Header */}
        {(title || description) && (
          <Modal.Header title={title} description={description} />
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Modal Header component
const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  title,
  description,
  className,
}) => (
  <div className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}>
    {title && (
      <h2
        id="modal-title"
        className="text-lg font-semibold leading-none tracking-tight"
      >
        {title}
      </h2>
    )}
    {description && (
      <p id="modal-description" className="text-sm text-muted-foreground">
        {description}
      </p>
    )}
    {children}
  </div>
);

// Modal Footer component
const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0",
      className,
    )}
  >
    {children}
  </div>
);

Modal.Header = ModalHeader;
Modal.Footer = ModalFooter;

export default Modal;
