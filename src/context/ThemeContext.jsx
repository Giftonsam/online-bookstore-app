// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Get theme from localStorage or default to 'light'
        const savedTheme = localStorage.getItem('bookstore-theme')
        return savedTheme || 'light'
    })

    useEffect(() => {
        // Apply theme to document root
        document.documentElement.setAttribute('data-theme', theme)

        // Save theme to localStorage
        localStorage.setItem('bookstore-theme', theme)

        // Update CSS custom properties based on theme
        updateThemeProperties(theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
    }

    const updateThemeProperties = (currentTheme) => {
        const root = document.documentElement

        if (currentTheme === 'dark') {
            // Dark theme colors
            root.style.setProperty('--bg-primary', '#1a1a1a')
            root.style.setProperty('--bg-secondary', '#2d2d2d')
            root.style.setProperty('--bg-tertiary', '#404040')

            root.style.setProperty('--text-primary', '#ffffff')
            root.style.setProperty('--text-secondary', '#e0e0e0')
            root.style.setProperty('--text-muted', '#a0a0a0')

            root.style.setProperty('--color-gray-100', '#404040')
            root.style.setProperty('--color-gray-200', '#525252')
            root.style.setProperty('--color-gray-300', '#737373')

            root.style.setProperty('--color-primary', '#3b82f6')
            root.style.setProperty('--color-primary-light', 'rgba(59, 130, 246, 0.2)')
            root.style.setProperty('--color-primary-dark', '#1d4ed8')

            root.style.setProperty('--color-secondary', '#10b981')
            root.style.setProperty('--color-secondary-light', 'rgba(16, 185, 129, 0.2)')
            root.style.setProperty('--color-secondary-dark', '#047857')

            root.style.setProperty('--color-accent', '#f59e0b')
            root.style.setProperty('--color-accent-light', 'rgba(245, 158, 11, 0.2)')
            root.style.setProperty('--color-accent-dark', '#d97706')

            root.style.setProperty('--color-danger', '#ef4444')
            root.style.setProperty('--color-danger-light', 'rgba(239, 68, 68, 0.2)')
            root.style.setProperty('--color-danger-dark', '#dc2626')

            root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(0, 0, 0, 0.3)')
            root.style.setProperty('--shadow-base', '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)')
            root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)')
            root.style.setProperty('--shadow-xl', '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)')

        } else {
            // Light theme colors (default)
            root.style.setProperty('--bg-primary', '#ffffff')
            root.style.setProperty('--bg-secondary', '#f8fafc')
            root.style.setProperty('--bg-tertiary', '#f1f5f9')

            root.style.setProperty('--text-primary', '#1e293b')
            root.style.setProperty('--text-secondary', '#475569')
            root.style.setProperty('--text-muted', '#64748b')

            root.style.setProperty('--color-gray-100', '#f1f5f9')
            root.style.setProperty('--color-gray-200', '#e2e8f0')
            root.style.setProperty('--color-gray-300', '#cbd5e1')

            root.style.setProperty('--color-primary', '#3b82f6')
            root.style.setProperty('--color-primary-light', 'rgba(59, 130, 246, 0.1)')
            root.style.setProperty('--color-primary-dark', '#1d4ed8')

            root.style.setProperty('--color-secondary', '#10b981')
            root.style.setProperty('--color-secondary-light', 'rgba(16, 185, 129, 0.1)')
            root.style.setProperty('--color-secondary-dark', '#047857')

            root.style.setProperty('--color-accent', '#f59e0b')
            root.style.setProperty('--color-accent-light', 'rgba(245, 158, 11, 0.1)')
            root.style.setProperty('--color-accent-dark', '#d97706')

            root.style.setProperty('--color-danger', '#ef4444')
            root.style.setProperty('--color-danger-light', 'rgba(239, 68, 68, 0.1)')
            root.style.setProperty('--color-danger-dark', '#dc2626')

            root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(0, 0, 0, 0.05)')
            root.style.setProperty('--shadow-base', '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)')
            root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)')
            root.style.setProperty('--shadow-xl', '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)')
        }
    }

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === 'dark'
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}