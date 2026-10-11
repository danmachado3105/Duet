export default function TransitionScreen({ eyebrow, title, text, children, actions }) {
  return (
    <section className="container tscreen stagger">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="tscreen__title">{title}</h1>
      {text && <p className="lead tscreen__text">{text}</p>}
      {children}
      {actions && <div className="tscreen__actions">{actions}</div>}
    </section>
  )
}