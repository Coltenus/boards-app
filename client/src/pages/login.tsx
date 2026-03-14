import { useEffect, useState } from 'react';

interface LoginPageProps {
    apiUrl?: string
    text_color_class?: string
    muted_text_color_class?: string
    border_color_class?: string
    card_bg_class?: string
    card_shadow_class?: string
    input_bg_class?: string
    secondary_button_class?: string
}

export default function LoginPage(props: LoginPageProps) {
    const { apiUrl, text_color_class, muted_text_color_class, border_color_class,
        card_bg_class, card_shadow_class, input_bg_class, secondary_button_class } = props

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            window.location.href = '/boards';
        }
    }, []);

    const handleLogin = () => {
        const body_data = { email, password };
        const json_body = JSON.stringify(body_data);

        fetch(`${apiUrl}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: json_body,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    localStorage.setItem('email', email);
                    localStorage.setItem('token', data.user.token);
                    localStorage.setItem('name', data.user.name);
                    window.location.href = '/boards';
                } else {
                    alert('Login failed: ' + data.message);
                }
            })
            .catch((error) => {
                alert('Error logging in user: ' + error.message);
            });
    };

    return (
        <div className={`w-full flex items-center justify-center px-4 py-10`}>
            <div className={`w-full max-w-md rounded-2xl border ${border_color_class} ${card_bg_class} ${card_shadow_class} p-6`}>
                <h1 className={`text-2xl font-bold ${text_color_class}`}>Login</h1>
                <p className={`mt-1 text-sm ${muted_text_color_class}`}>Welcome back. Sign in to continue.</p>

                <form
                    className="mt-6 flex flex-col gap-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`border ${border_color_class} ${input_bg_class} rounded-lg py-3 px-4 w-full ${text_color_class} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
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
                        Login
                    </button>
                </form>

                <div className="mt-5 flex items-center justify-center gap-2">
                    <p className={`${muted_text_color_class} text-sm`}>Don&apos;t have an account?</p>
                    <button
                        className={`text-sm font-semibold py-2 px-3 rounded-lg transition-colors ${secondary_button_class}`}
                        onClick={() => (window.location.href = '/register')}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}