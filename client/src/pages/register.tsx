import { useEffect, useState } from 'react';

interface RegisterPageProps {
    apiUrl?: string
    text_color_class?: string
    muted_text_color_class?: string
    border_color_class?: string
    card_bg_class?: string
    card_shadow_class?: string
    input_bg_class?: string
    secondary_button_class?: string
}

export default function RegisterPage(props: RegisterPageProps) {
    const { apiUrl, text_color_class, muted_text_color_class, border_color_class,
        card_bg_class, card_shadow_class, input_bg_class, secondary_button_class } = props
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');

    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            window.location.href = '/boards';
        }
    }, []);

    const handleRegister = () => {
        const body_data = { email, password, name, gender, birthdate };
        const json_body = JSON.stringify(body_data)
        console.log('Registering user with data:', json_body)
        fetch(`${apiUrl}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: json_body,
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                window.location.href = '/login';
            }
            else {
                alert('Registration failed: ' + data.message);
            }
        })
        .catch((error) => {
            alert('Error registering user: ' + error.message);
        });
    }

    return (
        <div className={`w-full flex items-center justify-center px-4 py-10`}>
            <div className={`w-full max-w-md rounded-2xl border ${border_color_class} ${card_bg_class} ${card_shadow_class} p-6`}>
                <h1 className={`text-2xl font-bold ${text_color_class}`}>Registration</h1>
                <p className={`mt-1 text-sm ${muted_text_color_class}`}>Create your account to continue.</p>

                <form
                    className="mt-6 flex flex-col gap-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRegister();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`border ${border_color_class} ${input_bg_class} rounded-lg py-3 px-4 w-full ${text_color_class} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`border ${border_color_class} ${input_bg_class} rounded-lg py-3 px-4 w-full ${text_color_class} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className={`border ${border_color_class} ${input_bg_class} rounded-lg py-3 px-4 w-full ${text_color_class} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input
                        type="date"
                        placeholder="Birthdate"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className={`date-input-fix border ${border_color_class} ${input_bg_class} rounded-lg py-3 px-4 w-full ${text_color_class} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`border ${border_color_class} ${input_bg_class} rounded-lg py-3 px-4 w-full ${text_color_class} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />

                    <button
                        type="submit"
                        className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-5 flex items-center justify-center gap-2">
                    <p className={`${muted_text_color_class} text-sm`}>Already have an account?</p>
                    <button
                        className={`text-sm font-semibold py-2 px-3 rounded-lg transition-colors ${secondary_button_class}`}
                        onClick={() => (window.location.href = '/login')}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}