interface ErrorPageProps {
    text_color_class?: string
    muted_text_color_class?: string
    border_color_class?: string
    card_bg_class?: string
    card_shadow_class?: string
    input_bg_class?: string
    secondary_button_class?: string
}

export default function ErrorPage(props: ErrorPageProps) {
    const { text_color_class, muted_text_color_class, border_color_class,
        card_bg_class, card_shadow_class, input_bg_class, secondary_button_class } = props

    return (
        <div className={`w-full flex items-center justify-center px-4 py-10`}>
            <div className={`w-full max-w-md rounded-2xl border ${border_color_class} ${card_bg_class} ${card_shadow_class} p-6`}>
                <h1 className={`text-2xl font-bold ${text_color_class}`}>404 Not Found</h1>
                <p className={`mt-1 text-sm ${muted_text_color_class}`}>The page you are looking for does not exist.</p>
                <button
                    className={`mt-6 font-semibold px-4 py-2 rounded-lg transition-colors ${secondary_button_class}`}
                    onClick={() => window.location.href = '/'}
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
}