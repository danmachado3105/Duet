export default function MovieGridSkeleton({ count = 8 }) {
  return (
    <ul className="mgrid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="mcard">
          <span className="pimg" data-status="loading" />
          <span className="skeleton-line" />
          <span className="skeleton-line skeleton-line--short" />
        </li>
      ))}
    </ul>
  )
}