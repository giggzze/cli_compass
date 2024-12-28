"use client";

import {
  Edit,
  ChevronDown,
  ChevronUp,
  ListTodo,
  CalendarDays,
  Split,
} from "lucide-react";
import Link from "next/link";
import { StepList } from "./StepList";
import { IProcessStep } from "@/app/models/Process";
import { Button } from "../ui/button";
import { UserBadge } from "../shared/UserBadge";
import { PrivacyBadge } from "../shared/PrivacyBadge";

interface ProcessCardProps {
  id: string;
  title: string;
  steps: IProcessStep[];
  isExpanded: boolean;
  currentStep: number | undefined;
  createdAt: string;
  isPrivate: boolean;
  user?: {
    id: string;
    username: string;
    avatarUrl?: string;
  } | null;
  onToggleExpand: (id: string) => void;
  onStepClick: (processId: string, stepOrder: number) => void;
}

export function ProcessCard({
  id,
  title,
  steps,
  isExpanded,
  currentStep,
  createdAt,
  isPrivate,
  user,
  onToggleExpand,
  onStepClick,
}: ProcessCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
      <div className="p-4">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate mb-2">
              {title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <ListTodo className="h-4 w-4" />
                {steps.length} {steps.length === 1 ? "Step" : "Steps"}
              </span>
              <Split className="h-4 w-4" />
              <CalendarDays className="h-4 w-4" />
              <span>Created {new Date(createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user?.id && (
                <UserBadge
                  avatarUrl={user.avatarUrl}
                  username={user.username}
                />
              )}
              <PrivacyBadge isPrivate={isPrivate} />
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex gap-2 shrink-0">
            <Link href={`/private/process/edit/${id}`}>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit process</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpand(id)}
              className="h-8 px-2"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isExpanded ? "Collapse" : "Expand"} process
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      {isExpanded && steps.length > 0 && (
        <div className="border-t border-gray-100">
          <StepList
            processId={id}
            steps={steps}
            currentStep={currentStep}
            onStepClick={onStepClick}
          />
        </div>
      )}
    </div>
  );
}
