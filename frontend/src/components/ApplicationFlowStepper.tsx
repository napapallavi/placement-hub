import React from 'react';
import { ApplicationStatus } from '../types';
import { Check, X } from 'lucide-react';

interface Props {
  currentStatus: ApplicationStatus;
}

const FLOW_STEPS: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
];

export const ApplicationFlowStepper: React.FC<Props> = ({ currentStatus }) => {
  const isRejected = currentStatus === 'Rejected';
  const currentIndex = FLOW_STEPS.indexOf(currentStatus as ApplicationStatus);

  return (
    <div className="status-flow-stepper">
      <div className="stepper-track" />
      {FLOW_STEPS.map((step, idx) => {
        let stepClass = 'stepper-step';
        let isDone = false;
        let isActive = false;

        if (isRejected) {
          if (idx === 0) isDone = true;
          if (idx === FLOW_STEPS.length - 1) {
            step = 'Rejected' as any;
            stepClass += ' rejected';
            isActive = true;
          }
        } else {
          if (idx < currentIndex) {
            stepClass += ' completed';
            isDone = true;
          } else if (idx === currentIndex) {
            stepClass += ' active';
            isActive = true;
          }
        }

        return (
          <div key={step} className={stepClass}>
            <div className="step-node">
              {isDone ? (
                <Check size={14} />
              ) : isRejected && idx === FLOW_STEPS.length - 1 ? (
                <X size={14} />
              ) : (
                idx + 1
              )}
            </div>
            <div className="step-label">{step}</div>
          </div>
        );
      })}
    </div>
  );
};
