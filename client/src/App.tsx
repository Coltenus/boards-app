import { useEffect, useState } from 'react'
import AboutPage from './pages/about'
import BoardsPage from './pages/boards'
import ErrorPage from './pages/error'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import ProfilePage from './pages/profile'

interface AppProps {
  apiUrl?: string
}

export default function App(props: AppProps) {
  const { apiUrl } = props
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)

  if(localStorage.getItem('dark-mode') === null) {
    localStorage.setItem('dark-mode', 'false')
  }

  let isDarkMode: boolean = localStorage.getItem('dark-mode') === 'true'
  const toggleDarkMode = () => {
    isDarkMode = !isDarkMode
    localStorage.setItem('dark-mode', isDarkMode.toString())
    window.location.reload()
  }

  const background_color_class = isDarkMode ? 'bg-gray-900' : 'bg-gray-300'
  const text_color_class = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const muted_text_color_class = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const border_color_class = isDarkMode ? 'border-gray-700' : 'border-gray-400';
  const bg_class = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const input_bg_class = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  const shadow_class = isDarkMode
      ? 'shadow-2xl shadow-black/50 ring-1 ring-white/10'
      : 'shadow-xl shadow-slate-900/10';

  const buttonBaseClass =
        'inline-flex items-center justify-center gap-1 text-sm font-medium py-1.5 px-3 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'
  const buttonPrimaryClass = 'bg-green-600 hover:bg-green-500 text-white'
  const buttonSecondaryClass = 'bg-gray-700 hover:bg-gray-600 text-white'
  const iconButtonClass = 'h-9 w-9 p-0'
  const menuPanelClass = isDarkMode
      ? 'bg-gray-900/95 border-gray-700 text-gray-100 shadow-2xl ring-1 ring-black/40 backdrop-blur-md'
      : 'bg-white/95 border-gray-200 text-gray-800 shadow-2xl ring-1 ring-black/10 backdrop-blur-md'
  const menuItemClass = 'w-full inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors'

  const token = localStorage.getItem('token')
  const email = localStorage.getItem('email')
  const name = localStorage.getItem('name')
  
  useEffect(() => {
    if(token !== null) {
      fetch(`${apiUrl}/user/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, email })
      })
      .then(res => res.json())
      .then(data => {
        if(!data.success) {
          localStorage.removeItem('token')
          localStorage.removeItem('email')
          localStorage.removeItem('name')
          alert('Session expired. Please log in again.')
          window.location.reload()
        }
      })
      .catch(err => {
        console.error('Error verifying token:', err)
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('name')
        alert('Error verifying session. Please log in again.')
        window.location.reload()
      })
    }
  }, [token, email])

  useEffect(() => {
    const rootBackground = isDarkMode ? '#111827' : '#d1d5db'
    document.documentElement.style.backgroundColor = rootBackground
    document.body.style.backgroundColor = rootBackground

    let themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if(!themeColorMeta) {
      themeColorMeta = document.createElement('meta')
      themeColorMeta.setAttribute('name', 'theme-color')
      document.head.appendChild(themeColorMeta)
    }
    themeColorMeta.setAttribute('content', rootBackground)
  }, [isDarkMode])

  const handleLoginLogout = () => {
    if(token) {
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      localStorage.removeItem('name')
      alert('Logged out successfully.')
      window.location.reload()
    }
    else {
      window.location.href = '/login'
    }
  }

  const handleHeaderMenuAction = (action: () => void) => {
    setIsHeaderMenuOpen(false)
    action()
  }

  return (
      <div className={`h-min-screen ${background_color_class}`}>
        <header>
          <div className={`backdrop-blur shadow-md px-4 sm:px-6 ${bg_class}`}>
            <div className={`mx-auto max-w-6xl flex items-center justify-between gap-3 py-3`}>
              <div className={`flex items-center gap-2 sm:gap-3`}>
                <button
                  className={`font-semibold px-4 py-2 rounded-lg transition-colors ${buttonPrimaryClass}`}
                  onClick={() => window.location.href = '/'}
                >
                  Home
                </button>
                <button
                  className={`font-semibold px-4 py-2 rounded-lg transition-colors ${buttonPrimaryClass}`}
                  onClick={() => window.location.href = '/boards'}
                >
                  Boards
                </button>
                <button
                  className={`rounded-lg p-1.5 transition-colors ${buttonSecondaryClass}`}
                  onClick={toggleDarkMode}
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <span className="material-symbols-outlined text-[18px] leading-none mt-0.5 mr-0.5">light_mode</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px] leading-none mt-0.5 mr-0.5">dark_mode</span>
                  )}
                </button>
              </div>
              <div className={`hidden sm:flex items-center gap-3`}>
                {token && <p className={`${text_color_class}`}>{name || email}</p>}
                {token && (<button
                  className={`font-semibold px-4 py-2 rounded-lg transition-colors ${buttonSecondaryClass}`}
                  onClick={() => window.location.href = '/profile'}
                >
                  Profile
                </button>)}
                <button
                  className={`font-semibold px-4 py-2 rounded-lg transition-colors ${buttonPrimaryClass}`}
                  onClick={handleLoginLogout}
                >
                  {token ? 'Log out' : 'Log in'}
                </button>
              </div>
              <div className="relative sm:hidden">
                <button
                  className={`rounded-lg p-2 transition-colors ${buttonSecondaryClass}`}
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                  title="Open menu"
                  aria-label="Open menu"
                  aria-expanded={isHeaderMenuOpen}
                >
                  <span className="material-symbols-outlined text-[20px] leading-none">menu</span>
                </button>

                {isHeaderMenuOpen && (
                  <div className={`absolute right-0 mt-2 min-w-48 rounded-lg border p-2 z-20 ${menuPanelClass}`}>
                    {token && <p className={`px-3 py-2 text-sm ${muted_text_color_class}`}>Hello, {name || email}!</p>}
                    {token && (
                      <button
                        className={`${menuItemClass} ${buttonSecondaryClass}`}
                        onClick={() => handleHeaderMenuAction(() => { window.location.href = '/profile' })}
                      >
                        Profile
                      </button>
                    )}
                    <button
                      className={`${menuItemClass} ${buttonPrimaryClass}`}
                      onClick={() => handleHeaderMenuAction(handleLoginLogout)}
                    >
                      {token ? 'Log out' : 'Log in'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className='mt-4'>
            {(() => {
              switch(window.location.pathname) {
                case '/':
                case '/about':
                  return <AboutPage text_color_class={text_color_class} muted_text_color_class={muted_text_color_class}
                    border_color_class={border_color_class} card_bg_class={bg_class} card_shadow_class={shadow_class}
                    input_bg_class={input_bg_class} secondary_button_class={buttonSecondaryClass}/>
                  break
                case '/boards':
                  return <BoardsPage apiUrl={apiUrl} text_color_class={text_color_class} muted_text_color_class={muted_text_color_class}
                    border_color_class={border_color_class} bg_class={bg_class} input_bg_class={input_bg_class}
                    shadow_class={shadow_class} buttonBaseClass={buttonBaseClass} buttonPrimaryClass={buttonPrimaryClass}
                    buttonSecondaryClass={buttonSecondaryClass} iconButtonClass={iconButtonClass}
                    menuPanelClass={menuPanelClass} menuItemClass={menuItemClass}/>
                  break
                case '/login':
                  return <LoginPage apiUrl={apiUrl} text_color_class={text_color_class} muted_text_color_class={muted_text_color_class}
                    border_color_class={border_color_class} card_bg_class={bg_class} card_shadow_class={shadow_class}
                    input_bg_class={input_bg_class} secondary_button_class={buttonSecondaryClass}/>
                  break
                case '/register':
                  return <RegisterPage apiUrl={apiUrl} text_color_class={text_color_class} muted_text_color_class={muted_text_color_class}
                    border_color_class={border_color_class} card_bg_class={bg_class} card_shadow_class={shadow_class}
                    input_bg_class={input_bg_class} secondary_button_class={buttonSecondaryClass}/>
                  break
                case '/profile':
                  return <ProfilePage apiUrl={apiUrl} text_color_class={text_color_class} muted_text_color_class={muted_text_color_class}
                    border_color_class={border_color_class} card_bg_class={bg_class} card_shadow_class={shadow_class}
                    input_bg_class={input_bg_class} secondary_button_class={buttonSecondaryClass}/>
                  break
                default:
                  return <ErrorPage text_color_class={text_color_class} muted_text_color_class={muted_text_color_class}
                    border_color_class={border_color_class} card_bg_class={bg_class} card_shadow_class={shadow_class}
                    input_bg_class={input_bg_class} secondary_button_class={buttonSecondaryClass}/>
                  break
              }
            })()}
          </div>
        </main>
      </div>
  )
}
