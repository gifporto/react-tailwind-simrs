/**
 * Hospital Management System - Theme Color Reference
 * 
 * This file provides TypeScript constants for theme colors and utility functions
 * to help maintain consistency across the application.
 */

export const BRAND_COLORS = {
  primary: '#1C3C6E',      // Deep professional blue
  secondary: '#ED8123',    // Vibrant orange
} as const;

/**
 * Status badge classes for common healthcare states
 */
export const STATUS_CLASSES = {
  // Patient Status
  patient: {
    admitted: 'status-admitted',
    discharged: 'status-discharged',
    emergency: 'status-emergency',
    observation: 'status-observation',
  },
  
  // Payment Status
  payment: {
    paid: 'payment-paid',
    pending: 'payment-pending',
    overdue: 'payment-overdue',
    partial: 'payment-partial',
  },
  
  // Appointment Status
  appointment: {
    scheduled: 'appointment-scheduled',
    confirmed: 'appointment-confirmed',
    completed: 'appointment-completed',
    cancelled: 'appointment-cancelled',
    noshow: 'appointment-noshow',
  },
  
  // Lab Result Status
  lab: {
    pending: 'lab-pending',
    inProgress: 'lab-inprogress',
    completed: 'lab-completed',
    critical: 'lab-critical',
  },
  
  // Queue Status
  queue: {
    waiting: 'queue-waiting',
    called: 'queue-called',
    serving: 'queue-serving',
    completed: 'queue-completed',
  },
  
  // Priority
  priority: {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  },
} as const;

/**
 * Button variant classes
 */
export const BUTTON_CLASSES = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  success: 'bg-success text-success-foreground hover:bg-success/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
} as const;

/**
 * Input variant classes for validation states
 */
export const INPUT_CLASSES = {
  default: 'input-enhanced',
  error: 'input-enhanced input-error',
  success: 'input-enhanced input-success',
  warning: 'input-enhanced input-warning',
} as const;

/**
 * Helper function to get patient status class
 */
export function getPatientStatusClass(status: string): string {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
  
  switch (normalizedStatus) {
    case 'admitted':
    case 'rawatinap':
      return STATUS_CLASSES.patient.admitted;
    case 'discharged':
    case 'pulang':
      return STATUS_CLASSES.patient.discharged;
    case 'emergency':
    case 'darurat':
    case 'igd':
      return STATUS_CLASSES.patient.emergency;
    case 'observation':
    case 'observasi':
      return STATUS_CLASSES.patient.observation;
    default:
      return 'status-admitted';
  }
}

/**
 * Helper function to get payment status class
 */
export function getPaymentStatusClass(status: string): string {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
  
  switch (normalizedStatus) {
    case 'paid':
    case 'lunas':
    case 'dibayar':
      return STATUS_CLASSES.payment.paid;
    case 'pending':
    case 'menunggu':
      return STATUS_CLASSES.payment.pending;
    case 'overdue':
    case 'terlambat':
    case 'telat':
      return STATUS_CLASSES.payment.overdue;
    case 'partial':
    case 'sebagian':
      return STATUS_CLASSES.payment.partial;
    default:
      return STATUS_CLASSES.payment.pending;
  }
}

/**
 * Helper function to get appointment status class
 */
export function getAppointmentStatusClass(status: string): string {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
  
  switch (normalizedStatus) {
    case 'scheduled':
    case 'dijadwalkan':
      return STATUS_CLASSES.appointment.scheduled;
    case 'confirmed':
    case 'dikonfirmasi':
      return STATUS_CLASSES.appointment.confirmed;
    case 'completed':
    case 'selesai':
      return STATUS_CLASSES.appointment.completed;
    case 'cancelled':
    case 'dibatalkan':
      return STATUS_CLASSES.appointment.cancelled;
    case 'noshow':
    case 'tidakhadir':
      return STATUS_CLASSES.appointment.noshow;
    default:
      return STATUS_CLASSES.appointment.scheduled;
  }
}

/**
 * Helper function to get lab result status class
 */
export function getLabStatusClass(status: string): string {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
  
  switch (normalizedStatus) {
    case 'pending':
    case 'menunggu':
      return STATUS_CLASSES.lab.pending;
    case 'inprogress':
    case 'processing':
    case 'diproses':
      return STATUS_CLASSES.lab.inProgress;
    case 'completed':
    case 'selesai':
      return STATUS_CLASSES.lab.completed;
    case 'critical':
    case 'kritis':
      return STATUS_CLASSES.lab.critical;
    default:
      return STATUS_CLASSES.lab.pending;
  }
}

/**
 * Helper function to get queue status class
 */
export function getQueueStatusClass(status: string): string {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
  
  switch (normalizedStatus) {
    case 'waiting':
    case 'menunggu':
      return STATUS_CLASSES.queue.waiting;
    case 'called':
    case 'dipanggil':
      return STATUS_CLASSES.queue.called;
    case 'serving':
    case 'dilayani':
      return STATUS_CLASSES.queue.serving;
    case 'completed':
    case 'selesai':
      return STATUS_CLASSES.queue.completed;
    default:
      return STATUS_CLASSES.queue.waiting;
  }
}

/**
 * Helper function to get priority class
 */
export function getPriorityClass(priority: string | number): string {
  const normalizedPriority = priority.toString().toLowerCase();
  
  switch (normalizedPriority) {
    case 'high':
    case 'tinggi':
    case '1':
    case '3':
      return STATUS_CLASSES.priority.high;
    case 'medium':
    case 'sedang':
    case '2':
      return STATUS_CLASSES.priority.medium;
    case 'low':
    case 'rendah':
    case '0':
      return STATUS_CLASSES.priority.low;
    default:
      return STATUS_CLASSES.priority.medium;
  }
}

/**
 * Get semantic color for alert/notification types
 */
export function getAlertVariant(type: 'success' | 'warning' | 'error' | 'info'): {
  className: string;
  icon: string;
} {
  switch (type) {
    case 'success':
      return {
        className: 'bg-success/10 text-success border-success/30',
        icon: '✓',
      };
    case 'warning':
      return {
        className: 'bg-warning/10 text-warning border-warning/30',
        icon: '⚠',
      };
    case 'error':
      return {
        className: 'bg-destructive/10 text-destructive border-destructive/30',
        icon: '✕',
      };
    case 'info':
      return {
        className: 'bg-info/10 text-info border-info/30',
        icon: 'ℹ',
      };
  }
}
