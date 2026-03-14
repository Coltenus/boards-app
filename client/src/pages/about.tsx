interface AboutPageProps {
  text_color_class?: string
  muted_text_color_class?: string
  border_color_class?: string
  card_bg_class?: string
  card_shadow_class?: string
  input_bg_class?: string
  secondary_button_class?: string
}

export default function AboutPage(props: AboutPageProps) {
    const { text_color_class, muted_text_color_class, border_color_class,
        card_bg_class, card_shadow_class, input_bg_class, secondary_button_class } = props

  const textClass = text_color_class ?? "text-gray-900"
  const mutedTextClass = muted_text_color_class ?? "text-gray-600"
  const borderClass = border_color_class ?? "border-gray-200"
  const cardBgClass = card_bg_class ?? "bg-white"
  const cardShadowClass = card_shadow_class ?? "shadow"
  const accentBgClass = input_bg_class ?? "bg-gray-50"
  const chipClass = secondary_button_class ?? "bg-gray-100 text-gray-700"

    return (
    <div className={`mx-auto w-full max-w-3xl px-4 py-10 ${textClass}`}>
      <div className={`rounded-xl border p-6 ${borderClass} ${cardBgClass} ${cardShadowClass}`}>
        <h1 className={`text-2xl font-bold ${textClass}`}>Boards App</h1>
        <p className={`mt-3 text-sm leading-6 ${mutedTextClass}`}>
          This project is a simple discussion board application where users can register,
          log in, create posts, and join conversations through comments.
        </p>

        <div className={`mt-6 rounded-lg border p-4 ${borderClass} ${accentBgClass}`}>
          <h2 className="text-lg font-semibold">What you can do</h2>
          <ul className={`mt-2 list-disc space-y-1 pl-5 text-sm ${mutedTextClass}`}>
            <li>Create an account and sign in</li>
            <li>Browse discussion boards and posts</li>
            <li>Read and write comments</li>
            <li>Manage your profile information</li>
          </ul>
        </div>

        <img src="/emblem.png" alt="App Emblem" className="mx-auto my-6 w-64 h-64"/>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Tech stack</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${chipClass}`}>React</span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${chipClass}`}>TypeScript</span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${chipClass}`}>Tailwind CSS</span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${chipClass}`}>Node.js</span>
          </div>
        </div>
      </div>
        </div>
    );
}
