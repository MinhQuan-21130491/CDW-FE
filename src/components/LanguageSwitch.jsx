import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitch() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  const handleChange = (event, newLang) => {
    if (newLang) {
      setLang(newLang);
      i18n.changeLanguage(newLang);
    }
  };

  return (
    <ToggleButtonGroup
      value={lang}
      exclusive
      onChange={handleChange}
      size="small"
      color="primary"
      sx={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: 1, // nhẹ
        overflow: 'hidden',
        '& .MuiToggleButton-root': {
          fontSize: '0.7rem',
          padding: '4px 8px',
          minWidth: '36px',
        },
      }}
    >
      <ToggleButton value="vi">🇻🇳 VI</ToggleButton>
      <ToggleButton value="en">🇺🇸 EN</ToggleButton>
    </ToggleButtonGroup>
  );
}
