import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export function parser(tx: any, meta: any) {
  const affectedNodes = meta.AffectedNodes
  const bridgeMeta = affectedNodes.filter(
    (node: any) =>
      node.CreatedNode && node.CreatedNode.LedgerEntryType === 'Bridge',
  )[0]
  return {
    lockingDoor: tx.XChainBridge.LockingChainDoor,
    lockingIssue: tx.XChainBridge.LockingChainIssue,
    issuingDoor: tx.XChainBridge.IssuingChainDoor,
    issuingIssue: tx.XChainBridge.IssuingChainIssue,
    signatureReward: formatAmount(tx.SignatureReward),
    minAccountCreateAmount: formatAmount(tx.MinAccountCreateAmount),
    bridgeOwner: bridgeMeta.CreatedNode.NewFields.Account,
  }
}
