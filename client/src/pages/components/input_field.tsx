import { useState } from "react";

interface InputFieldProps {
    buttonBaseClass?: string
    buttonPrimaryClass?: string
    buttonSecondaryClass?: string
    iconButtonClass?: string
    border_color_class?: string
    text_color_class?: string
    bg_color_class?: string
    shadow_class?: string
    send_icon?: React.ReactNode
    clear_icon?: React.ReactNode
    box_class?: string
    handleSubmit?: (content: string) => Promise<boolean> | boolean
}

export default function InputField(props: InputFieldProps) {
    const { handleSubmit, buttonBaseClass, buttonPrimaryClass,
        buttonSecondaryClass, iconButtonClass, border_color_class,
        text_color_class, bg_color_class, send_icon, clear_icon,
        box_class, shadow_class } = props
    const [buffer, setBuffer] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async () => {
        if (!handleSubmit || isSubmitting) return
        setIsSubmitting(true)
        try {
            const ok = await Promise.resolve(handleSubmit(buffer))
            if (ok) setBuffer('')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={box_class}>
            <textarea
                placeholder="Enter text here"
                value={buffer}
                onChange={(e) => setBuffer(e.target.value)}
                className={`border ${shadow_class} ${border_color_class} ${bg_color_class} rounded h-full py-5 px-4 w-full ${text_color_class} resize-none selection:bg-blue-500 selection:text-white`}
            />
            <div className={`flex flex-col ml-3 gap-2`}>
                <button
                    type="button"
                    className={`${buttonBaseClass} ${buttonPrimaryClass} ${iconButtonClass}`}
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    aria-label="Submit"
                    title="Submit"
                >
                    {send_icon}
                </button>
                <button
                    type="button"
                    className={`${buttonBaseClass} ${buttonSecondaryClass} ${iconButtonClass}`}
                    onClick={() => setBuffer('')}
                    disabled={isSubmitting}
                    aria-label="Clear"
                    title="Clear"
                >
                    {clear_icon}
                </button>
            </div>
        </div>
    );
}
