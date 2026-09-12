function EmptyState({
  title = 'No products found.',
  description = 'Try changing your filters.',
}) {
  return (
    <div className="status-panel" role="status">
      <p className="status-panel__title">{title}</p>
      <p>{description}</p>
    </div>
  )
}

export default EmptyState
