'use client';
import i18n from '../i18n';

export default function LanguageSwitcher() {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.cookie = `i18next=${lng}; path=/`;
    location.reload(); 
  };

  return (
    <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}>
      <option value="en">English</option>
      {/* <option value="hi">Hindi</option> */}
      <option value="fr">French</option>
    </select>
  );
}
