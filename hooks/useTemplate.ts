"use client";

import { useState, useCallback } from "react";
import { parseTemplate, hasTemplateVariables } from "@/lib/templateParser";

interface UseTemplateReturn {
  showTemplateModal: boolean;
  currentTemplate: string | null;
  openTemplateModal: (template: string) => boolean;
  closeTemplateModal: () => void;
  copyCommand: (command: string) => Promise<boolean>;
}

/**
 * Hook for handling command templates with variables
 *
 * Usage:
 * ```tsx
 * const { showTemplateModal, currentTemplate, openTemplateModal, closeTemplateModal, copyCommand } = useTemplate();
 *
 * const handleCopyClick = (code: string) => {
 *   // If command has variables, open the modal
 *   // Otherwise, copy directly
 *   const opened = openTemplateModal(code);
 *   if (!opened) {
 *     copyCommand(code);
 *   }
 * };
 *
 * return (
 *   <>
 *     <button onClick={() => handleCopyClick(command.code)}>Copy</button>
 *     {showTemplateModal && currentTemplate && (
 *       <TemplateModal
 *         isOpen={showTemplateModal}
 *         onClose={closeTemplateModal}
 *         template={currentTemplate}
 *         onCopy={() => closeTemplateModal()}
 *       />
 *     )}
 *   </>
 * );
 * ```
 */
export function useTemplate(): UseTemplateReturn {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);

  /**
   * Open the template modal if the command has variables
   * Returns true if modal was opened, false if no variables found
   */
  const openTemplateModal = useCallback((template: string): boolean => {
    if (hasTemplateVariables(template)) {
      setCurrentTemplate(template);
      setShowTemplateModal(true);
      return true;
    }
    return false;
  }, []);

  const closeTemplateModal = useCallback(() => {
    setShowTemplateModal(false);
    setCurrentTemplate(null);
  }, []);

  /**
   * Copy a command directly (no variable handling)
   */
  const copyCommand = useCallback(async (command: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(command);
      return true;
    } catch (err) {
      console.error("Failed to copy:", err);
      return false;
    }
  }, []);

  return {
    showTemplateModal,
    currentTemplate,
    openTemplateModal,
    closeTemplateModal,
    copyCommand,
  };
}
