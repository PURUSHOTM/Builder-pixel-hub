import React, { useCallback, useEffect, useRef } from "react";
import Modal, { ModalProps } from "./Modal";
import { Button } from "../ui/button";

export interface FormModalProps extends Omit<ModalProps, "children"> {
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  showFooter?: boolean;
  submitButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  footerContent?: React.ReactNode;
}

/**
 * FormModal component that wraps Modal with form-specific functionality
 * Handles form submission, prevents default behavior, and manages loading states
 */
const FormModal: React.FC<FormModalProps> = ({
  children,
  onSubmit,
  onCancel,
  onClose,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  isSubmitting = false,
  showFooter = true,
  submitButtonVariant = "default",
  disabled = false,
  footerContent,
  ...modalProps
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  // Handle form submission
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isSubmitting || disabled) return;

      try {
        await onSubmit(event);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [onSubmit, isSubmitting, disabled],
  );

  // Handle cancel action
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  }, [onCancel, onClose]);

  // Prevent form submission on Enter key in input fields (except textarea)
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      event.preventDefault();

      // Find the submit button and trigger form submission
      const form = formRef.current;
      if (form) {
        form.requestSubmit();
      }
    }
  }, []);

  // Focus the first input when modal opens
  useEffect(() => {
    if (modalProps.isOpen && formRef.current) {
      const firstInput = formRef.current.querySelector(
        'input:not([type="hidden"]), textarea, select',
      ) as HTMLElement;

      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }, [modalProps.isOpen]);

  return (
    <Modal {...modalProps} onClose={onClose}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="space-y-4"
        noValidate
      >
        {children}

        {showFooter && (
          <Modal.Footer>
            {footerContent || (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  {cancelLabel}
                </Button>
                <Button
                  type="submit"
                  variant={submitButtonVariant}
                  disabled={isSubmitting || disabled}
                  className="flex-1 sm:flex-none"
                >
                  {isSubmitting ? "Loading..." : submitLabel}
                </Button>
              </div>
            )}
          </Modal.Footer>
        )}
      </form>
    </Modal>
  );
};

export default FormModal;
