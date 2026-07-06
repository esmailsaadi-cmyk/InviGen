import React, { useState, useEffect, useRef } from 'react';
import { generateHTML } from './utils/generateHtml';
import templateRaw from './template.html?raw';
import { Download, Play, Image as ImageIcon, Type, MapPin, Palette } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

const T = {
  en: {
    builderTitle: 'Invitation Builder',
    builderSubtitle: 'Customize your perfect invitation.',
    tabDetails: 'Details',
    tabImages: 'Images',
    tabTheme: 'Theme',
    fontSelection: 'Font Selection',
    arabicFont: 'Arabic Font Family',
    names: 'Names',
    addName: '+ Add Name',
    heroTopText: 'Hero Top Text',
    bottomText: 'Bottom Text (e.g. بدعوتكم لحضور حفل زفاف نجليهما)',
    heroIcon: 'Hero Icon (Emoji, Image URL, or SVG)',
    upload: 'Upload',
    weddingDateTime: 'Wedding Date & Time',
    timelineTitle: 'Timeline Section Title (e.g. المواعيد، مخطط الفرح)',
    countdownSection: 'Countdown Section',
    countdownTitle: 'Countdown Title',
    countdownSubtitle: 'Countdown Subtitle',
    closingSection: 'Closing Section',
    closingTitle: 'Closing Title',
    closingText: 'Closing Text',
    closingIcon: 'Closing Icon (Emoji, Image URL, or SVG)',
    footerText: 'Footer Text',
    timelineEvents: 'Timeline Events',
    event: 'Event',
    remove: 'Remove',
    timeText: 'Time Text (e.g. 12 يوليو • صلاة العصر)',
    eventTitle: 'Event Title',
    icon: 'Icon (Emoji, Image URL, or SVG)',
    locationName: 'Location Name',
    latitude: 'Latitude',
    longitude: 'Longitude',
    chooseLocationMap: 'Choose Location on Map',
    addEvent: '+ Add Event',
    heroBackground: 'Hero Background',
    countdownBackground: 'Countdown Background',
    timelineBackground: 'Timeline Background',
    envelopeLeft: 'Envelope Left Panel',
    envelopeRight: 'Envelope Right Panel',
    envelopeSeal: 'Envelope Seal',
    closingBackground: 'Closing Background',
    colorScheme: 'Color Scheme',
    roseGold: 'Rose Pink & Gold',
    emeraldGold: 'Emerald & Gold',
    sapphireSilver: 'Sapphire & Silver',
    customTheme: 'Custom Theme',
    primaryColor: 'Primary Color (Blush base)',
    secondaryColor: 'Secondary Color (Gold base)',
    updatePreview: 'Update Preview',
    download: 'دور عمي',
    chooseLocation: 'Choose Location',
    cancel: 'Cancel',
    confirmSelection: 'Confirm Selection',
    langToggle: 'عربي'
  },
  ar: {
    builderTitle: 'صانع الدعوات',
    builderSubtitle: 'قم بتخصيص دعوتك المثالية.',
    tabDetails: 'التفاصيل',
    tabImages: 'الصور',
    tabTheme: 'المظهر',
    fontSelection: 'اختيار الخط',
    arabicFont: 'نوع الخط العربي',
    names: 'الأسماء',
    addName: '+ إضافة اسم',
    heroTopText: 'النص العلوي',
    bottomText: 'النص السفلي (مثل: بدعوتكم لحضور حفل زفاف نجليهما)',
    heroIcon: 'أيقونة الواجهة (رمز تعبيري، رابط، أو SVG)',
    upload: 'رفع',
    weddingDateTime: 'تاريخ ووقت الزفاف',
    timelineTitle: 'عنوان قسم المواعيد',
    countdownSection: 'قسم العد التنازلي',
    countdownTitle: 'عنوان العد التنازلي',
    countdownSubtitle: 'النص الفرعي للعد التنازلي',
    closingSection: 'قسم الخاتمة',
    closingTitle: 'عنوان الخاتمة',
    closingText: 'نص الخاتمة',
    closingIcon: 'أيقونة الخاتمة (رمز تعبيري، رابط، أو SVG)',
    footerText: 'نص التذييل',
    timelineEvents: 'أحداث المواعيد',
    event: 'حدث',
    remove: 'إزالة',
    timeText: 'وقت الحدث (مثل: 12 يوليو • صلاة العصر)',
    eventTitle: 'عنوان الحدث',
    icon: 'الأيقونة (رمز تعبيري، رابط، أو SVG)',
    locationName: 'اسم الموقع',
    latitude: 'خط العرض',
    longitude: 'خط الطول',
    chooseLocationMap: 'اختر الموقع من الخريطة',
    addEvent: '+ إضافة حدث',
    heroBackground: 'خلفية الواجهة',
    countdownBackground: 'خلفية العد التنازلي',
    timelineBackground: 'خلفية المواعيد',
    envelopeLeft: 'الجانب الأيسر للظرف',
    envelopeRight: 'الجانب الأيمن للظرف',
    envelopeSeal: 'ختم الظرف',
    closingBackground: 'خلفية الخاتمة',
    colorScheme: 'نظام الألوان',
    roseGold: 'وردي وذهبي',
    emeraldGold: 'زمردي وذهبي',
    sapphireSilver: 'ياقوتي وفضي',
    customTheme: 'مظهر مخصص',
    primaryColor: 'اللون الأساسي',
    secondaryColor: 'اللون الثانوي',
    updatePreview: 'تحديث المعاينة',
    download: 'دور عمي',
    chooseLocation: 'اختر الموقع',
    cancel: 'إلغاء',
    confirmSelection: 'تأكيد الاختيار',
    langToggle: 'English'
  }
};

const INITIAL_STATE = {
  theme: 'rose',
  fontFamily: 'Amiri',
  names: ['اسم 1', 'اسم 2'],
  heroTopText: 'hero placeholder',
  heroBottomText: 'hero bottom placeholder',
  countdownTitle: 'countdown placeholder',
  countdownText: 'countdown text placeholder',
  closingTitle: 'closing placeholder',
  closingText: 'closing text placeholder',
  footerText: 'footer placeholder',
  heroIcon: '',
  closingIcon: '',
  closingBgImage: '',
  customPrimary: '#ec4899',
  customSecondary: '#f59e0b',
  eventDate: '2026-07-20T19:00:00',
  events: [
    {
      timeText: '12 يوليو • صلاة العصر',
      title: 'عقد القران (الفاتحة)',
      location: 'مسجد مولاي محمد, طرابلس',
      lat: 32.882152881836525,
      lng: 13.187690159514803,
      icon: '💍'
    },
    {
      timeText: '13 يوليو • 7:00 مساءً',
      title: 'صالة الأفراح',
      location: 'قاعة فرحتي, طرابلس',
      lat: 32.875709486905414,
      lng: 13.21033833779967,
      icon: '🍽️'
    }
  ],
  timelineSectionTitle: 'المواعيد',
  heroBgImage: '',
  countdownBgImage: '',
  timelineBgImage: '',
  envelopeLeft: '',
  envelopeRight: '',
  seal: ''
};

function App() {
  const [state, setState] = useState(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState('text');
  const [previewHtml, setPreviewHtml] = useState('');
  const iframeRef = useRef(null);
  const [mapPickerTarget, setMapPickerTarget] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [uiLang, setUiLang] = useState('ar');
  const t = T[uiLang];

  const handlePreview = () => {
    const html = generateHTML(templateRaw, state);
    setPreviewHtml(html);
    setTimeout(() => {
      document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    // Initial preview load
    handlePreview();
  }, []);

  const handleDownload = () => {
    const html = generateHTML(templateRaw, state);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invitation_${state.names.join('_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImageUpload = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateEvent = (idx, field, value) => {
    setState({
      ...state,
      events: state.events.map((ev, i) => i === idx ? { ...ev, [field]: value } : ev)
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-gray-50 text-gray-800 font-sans lg:overflow-hidden">
      {/* Sidebar Editor */}
      <div className="w-full lg:w-[450px] bg-white border-b lg:border-r border-gray-200 flex flex-col lg:h-full shadow-xl z-10">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent">{t.builderTitle}</h1>
            <p className="text-sm text-gray-500 mt-1">{t.builderSubtitle}</p>
          </div>
          <button onClick={() => setUiLang(uiLang === 'en' ? 'ar' : 'en')} className="px-3 py-1.5 text-sm font-medium text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-lg transition">{t.langToggle}</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('text')} className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'text' ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50/30' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Type size={16} />{t.tabDetails}</button>
          <button onClick={() => setActiveTab('images')} className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'images' ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50/30' : 'text-gray-500 hover:bg-gray-50'}`}>
            <ImageIcon size={16} />{t.tabImages}</button>
          <button onClick={() => setActiveTab('theme')} className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'theme' ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50/30' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Palette size={16} />{t.tabTheme}</button>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'text' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Type className="w-4 h-4 text-pink-500" />
                  {t.fontSelection}</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t.arabicFont}</label>
                  <select
                    value={state.fontFamily || 'Amiri'}
                    onChange={e => setState({ ...state, fontFamily: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                  >
                    <option value="Amiri">Amiri (أميري)</option>
                    <option value="Cairo">Cairo (كاييرو)</option>
                    <option value="Tajawal">Tajawal (تجوّل)</option>
                    <option value="Almarai">Almarai (المراعي)</option>
                    <option value="Changa">Changa (تشانجا)</option>
                    <option value="Lateef">Lateef (لطيف)</option>
                    <option value="Aref Ruqaa">Aref Ruqaa (عارف رقعة)</option>
                    <option value="Reem Kufi">Reem Kufi (ريم كوفي)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">{t.names}</label>
                    <button
                      onClick={() => setState({ ...state, names: [...state.names, 'اسم جديد'] })}
                      className="text-xs text-pink-600 font-semibold hover:text-pink-700 transition flex items-center gap-1"
                    >
                      {t.addName}</button>
                  </div>
                  {state.names.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={name}
                        onChange={e => {
                          const newNames = [...state.names];
                          newNames[idx] = e.target.value;
                          setState({ ...state, names: newNames });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                        dir="rtl"
                      />
                      {state.names.length > 1 && (
                        <button
                          onClick={() => {
                            const newNames = state.names.filter((_, i) => i !== idx);
                            setState({ ...state, names: newNames });
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.heroTopText}</label>
                  <input type="text" value={state.heroTopText} onChange={e => setState({ ...state, heroTopText: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition" dir="rtl" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t.bottomText}</label>
                  <input type="text" value={state.heroBottomText} onChange={e => setState({ ...state, heroBottomText: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" dir="rtl" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t.heroIcon}</label>
                  <div className="flex gap-2">
                    <input type="text" value={state.heroIcon || ''} onChange={e => setState({ ...state, heroIcon: e.target.value })} className="flex-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" dir="ltr" />
                    <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer border border-gray-300 transition text-sm whitespace-nowrap">{t.upload}<input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setState({ ...state, heroIcon: ev.target.result });
                        reader.readAsDataURL(file);
                      }
                    }} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.weddingDateTime}</label>
                  <input type="datetime-local" value={state.eventDate} onChange={e => setState({ ...state, eventDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.timelineTitle}</label>
                  <input type="text" value={state.timelineSectionTitle} onChange={e => setState({ ...state, timelineSectionTitle: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition" dir="rtl" />
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{t.countdownSection}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.countdownTitle}</label>
                      <input type="text" value={state.countdownTitle} onChange={e => setState({ ...state, countdownTitle: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition" dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.countdownSubtitle}</label>
                      <input type="text" value={state.countdownText} onChange={e => setState({ ...state, countdownText: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition" dir="rtl" />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{t.closingSection}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.closingTitle}</label>
                      <input type="text" value={state.closingTitle} onChange={e => setState({ ...state, closingTitle: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition" dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t.closingText}</label>
                      <input type="text" value={state.closingText} onChange={e => setState({ ...state, closingText: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t.closingIcon}</label>
                      <div className="flex gap-2">
                        <input type="text" value={state.closingIcon || ''} onChange={e => setState({ ...state, closingIcon: e.target.value })} className="flex-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" dir="ltr" />
                        <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer border border-gray-300 transition text-sm whitespace-nowrap">{t.upload}<input type="file" accept="image/*" className="hidden" onChange={handleImageUpload('closingIcon')} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t.footerText}</label>
                      <input type="text" value={state.footerText} onChange={e => setState({ ...state, footerText: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition" dir="rtl" />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={18} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-800">{t.timelineEvents}</h3>
                  </div>
                  <div className="space-y-6">
                    {state.events.map((evt, idx) => (
                      <div key={idx} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4 relative pt-8">
                        <div className="absolute top-0 right-0 bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">
                          {t.event} {idx + 1}
                        </div>
                        {state.events.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newEvents = state.events.filter((_, i) => i !== idx);
                              setState({ ...state, events: newEvents });
                            }}
                            className="absolute top-1 left-2 text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition"
                          >{t.remove}</button>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">{t.timeText}</label>
                          <input type="text" value={evt.timeText} onChange={e => updateEvent(idx, 'timeText', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" dir="rtl" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">{t.eventTitle}</label>
                          <input type="text" value={evt.title} onChange={e => updateEvent(idx, 'title', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" dir="rtl" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">{t.icon}</label>
                          <div className="flex gap-2">
                            <input type="text" value={evt.icon || ''} onChange={e => updateEvent(idx, 'icon', e.target.value)} className="flex-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" dir="ltr" />
                            <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer border border-gray-300 transition text-sm whitespace-nowrap">{t.upload}<input type="file" accept="image/*" className="hidden" onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => updateEvent(idx, 'icon', event.target.result);
                                reader.readAsDataURL(file);
                              }
                            }} />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">{t.locationName}</label>
                          <input type="text" value={evt.location} onChange={e => updateEvent(idx, 'location', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" dir="rtl" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">{t.latitude}</label>
                            <input type="number" step="any" value={evt.lat} onChange={e => {
                              setState({ ...state, events: state.events.map((ev, i) => i === idx ? { ...ev, lat: parseFloat(e.target.value) } : ev) });
                            }} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">{t.longitude}</label>
                            <input type="number" step="any" value={evt.lng} onChange={e => {
                              setState({ ...state, events: state.events.map((ev, i) => i === idx ? { ...ev, lng: parseFloat(e.target.value) } : ev) });
                            }} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition" />
                          </div>
                          <div className="col-span-2">
                            <button type="button" onClick={() => {
                              setTempLocation({ lat: evt.lat, lng: evt.lng });
                              setMapPickerTarget(idx);
                            }} className="w-full py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                              <MapPin size={16} /> {t.chooseLocationMap}</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setState({
                          ...state,
                          events: [
                            ...state.events,
                            {
                              timeText: 'موعد جديد',
                              title: 'حدث جديد',
                              location: 'موقع جديد',
                              lat: 32.88,
                              lng: 13.18
                            }
                          ]
                        });
                      }}
                      className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-pink-400 hover:text-pink-600 transition flex items-center justify-center gap-2 font-medium"
                    >
                      <span className="text-xl leading-none">+</span> {t.addEvent}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              {[
                { id: 'heroBgImage', label: t.heroBackground },
                { id: 'countdownBgImage', label: t.countdownBackground },
                { id: 'timelineBgImage', label: t.timelineBackground || 'Timeline Background' },
                { id: 'envelopeLeft', label: t.envelopeLeft },
                { id: 'envelopeRight', label: t.envelopeRight },
                { id: 'seal', label: t.envelopeSeal },
                { id: 'closingBgImage', label: t.closingBackground },
              ].map(field => (
                <div key={field.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">{field.label}</label>
                  {state[field.id] && (
                    <div className="mb-3 h-32 rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <img src={state[field.id]} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload(field.id)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 transition" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800 mb-3">{t.colorScheme}</label>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => setState({ ...state, theme: 'rose' })} className={`p-4 rounded-xl border-2 text-left transition ${state.theme === 'rose' ? 'border-pink-500 bg-pink-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{t.roseGold}</span>
                    <div className="flex gap-1"><div className="w-6 h-6 rounded-full bg-[#f472b6]"></div><div className="w-6 h-6 rounded-full bg-[#fbbf24]"></div></div>
                  </div>
                </button>
                <button onClick={() => setState({ ...state, theme: 'emerald' })} className={`p-4 rounded-xl border-2 text-left transition ${state.theme === 'emerald' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{t.emeraldGold}</span>
                    <div className="flex gap-1"><div className="w-6 h-6 rounded-full bg-[#10b981]"></div><div className="w-6 h-6 rounded-full bg-[#fbbf24]"></div></div>
                  </div>
                </button>
                <button onClick={() => setState({ ...state, theme: 'sapphire' })} className={`p-4 rounded-xl border-2 text-left transition ${state.theme === 'sapphire' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{t.sapphireSilver}</span>
                    <div className="flex gap-1"><div className="w-6 h-6 rounded-full bg-[#3b82f6]"></div><div className="w-6 h-6 rounded-full bg-[#9ca3af]"></div></div>
                  </div>
                </button>
                <button onClick={() => setState({ ...state, theme: 'custom' })} className={`p-4 rounded-xl border-2 text-left transition ${state.theme === 'custom' ? 'border-purple-500 bg-purple-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{t.customTheme}</span>
                    <div className="flex gap-1"><div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div></div>
                  </div>
                </button>
                {state.theme === 'custom' && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 mt-1">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">{t.primaryColor}</label>
                      <input type="color" value={state.customPrimary || '#ec4899'} onChange={e => setState({ ...state, customPrimary: e.target.value })} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">{t.secondaryColor}</label>
                      <input type="color" value={state.customSecondary || '#f59e0b'} onChange={e => setState({ ...state, customSecondary: e.target.value })} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-white grid grid-cols-2 gap-4">
          <button onClick={handlePreview} className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition">
            <Play size={18} /> {t.updatePreview}</button>
          <button onClick={handleDownload} className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-medium rounded-xl transition shadow-lg shadow-pink-500/30">
            <Download size={18} /> {t.download}</button>
        </div>
      </div>

      {/* Preview Area */}
      <div id="preview-section" className="w-full lg:flex-1 bg-gray-100 flex items-center justify-center p-4 lg:p-8 lg:overflow-hidden relative min-h-screen lg:min-h-0">
        <div className="absolute inset-0 pattern-dots text-gray-200 opacity-50 z-0"></div>
        <div className="relative z-10 w-full max-w-[420px] h-[85vh] lg:h-[850px] bg-white rounded-3xl lg:rounded-[3rem] shadow-2xl border-8 lg:border-[12px] border-white overflow-hidden ring-1 ring-gray-200/50">
          <div className="absolute top-0 inset-x-0 h-6 bg-white z-20 flex justify-center rounded-t-3xl">
            <div className="w-20 h-5 bg-gray-100 rounded-b-xl"></div>
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={previewHtml}
            className="w-full h-full border-0 rounded-[1.5rem] lg:rounded-[2.5rem]"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* Map Picker Modal */}
      {mapPickerTarget !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[80vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">{t.chooseLocation}</h2>
              <button onClick={() => setMapPickerTarget(null)} className="text-gray-500 hover:text-gray-700 transition">✕</button>
            </div>
            <div className="flex-1 w-full bg-gray-100 relative">
              <MapContainer center={[tempLocation?.lat || 32.88, tempLocation?.lng || 13.18]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <InvalidateSize />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker position={tempLocation} setPosition={setTempLocation} />
              </MapContainer>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button onClick={() => setMapPickerTarget(null)} className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition">{t.cancel}</button>
              <button onClick={() => {
                if (tempLocation) {
                  setState({
                    ...state,
                    events: state.events.map((ev, i) =>
                      i === mapPickerTarget
                        ? { ...ev, lat: tempLocation.lat, lng: tempLocation.lng }
                        : ev
                    )
                  });
                }
                setMapPickerTarget(null);
              }} className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium transition shadow-lg shadow-pink-500/30">{t.confirmSelection}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
