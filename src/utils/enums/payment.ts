export enum AsaasChargeStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  RECEIVED = "RECEIVED",
  RECEIVED_IN_CASH = "RECEIVED_IN_CASH",
  OVERDUE = "OVERDUE",
  REFUND_REQUESTED = "REFUND_REQUESTED",
  REFUNDED = "REFUNDED",
  CHARGEBACK_REQUESTED = "CHARGEBACK_REQUESTED",
  CHARGEBACK_DISPUTE = "CHARGEBACK_DISPUTE",
  AWAITING_CHARGEBACK_REVERSAL = "FAWAITING_CHARGEBACK_REVERSALIXED",
  DUNNING_REQUESTED = "DUNNING_REQUESTED",
  DUNNING_RECEIVED = "DUNNING_RECEIVED",
  AWAITING_RISK_ANALYSIS = "AWAITING_RISK_ANALYSIS",
}

export enum AsaasChargeStatusWebhook {
  PAYMENT_CREATED = "PAYMENT_CREATED",
  PAYMENT_UPDATED = "PAYMENT_UPDATED",
  PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  PAYMENT_OVERDUE = "PAYMENT_OVERDUE",
  PAYMENT_DELETED = "PAYMENT_DELETED",
}