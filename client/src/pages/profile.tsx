import { useEffect, useState } from "react"

interface ProfilePageProps {
    apiUrl?: string
    text_color_class?: string
    muted_text_color_class?: string
    border_color_class?: string
    card_bg_class?: string
    card_shadow_class?: string
    input_bg_class?: string
    secondary_button_class?: string
}

export default function ProfilePage(props: ProfilePageProps) {
    const { apiUrl, text_color_class, muted_text_color_class, border_color_class,
        card_bg_class, card_shadow_class, input_bg_class, secondary_button_class } = props

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    const [profileData, setProfileData] = useState<any | null>(null)
    const resolvedApiUrl = apiUrl ?? 'http://localhost:5174/api'
    
    useEffect(() => {
        if (!token || !email) {
            window.location.href = '/login';
            return
        }

        fetch(`${resolvedApiUrl}/user/profile/${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, email: email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProfileData({
                        Email: data.profile.email,
                        Name: data.profile.name,
                        Gender: data.profile.gender,
                        Birthdate: data.profile.birthdate,
                        Joined: data.profile.joined
                    })
                } else {
                    alert('Failed to fetch profile: ' + data.message)
                }
            })
            .catch(err => {
                console.error('Error fetching profile:', err)
                alert('Error fetching profile: ' + err.message)
            })
    }, [token, email, resolvedApiUrl])

    return (
        <div className={`w-full flex items-center justify-center px-4 py-10`}>
            {/* Good looking profile content */}
            <div className={`w-full max-w-md rounded-2xl border ${border_color_class} ${card_bg_class} ${card_shadow_class} p-6`}>
                <h1 className={`text-2xl font-bold ${text_color_class}`}>Profile</h1>
                {!profileData ? (
                    <p className={`mt-1 text-sm ${muted_text_color_class}`}>Loading profile...</p>
                ) : (
                    <div className={`mt-4 space-y-3`}>
                        {Object.entries(profileData).map(([key, value]) => (
                            <div key={key} className={`flex flex-col`}>
                                <span className={`text-xs uppercase ${muted_text_color_class}`}>{key}</span>
                                <span className={`text-sm ${text_color_class}`}>{value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
