import { useI18n } from '../context/I18nContext'

export function LanguageToggle() {
  const { locale, setLocale } = useI18n()

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
      className='inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
      aria-label={`Switch language to ${locale === 'en' ? 'Spanish' : 'English'}`}
    >
      <span className="text-base mr-1.5">{locale === 'en' ? '🇺🇸' : '🇪🇸'}</span>
      <span>{locale === 'en' ? 'EN' : 'ES'}</span>
    </button>
  )
}
