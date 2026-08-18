import React, { useState, useEffect } from 'react';
import { MacroEvent, ImpactedIndustry, MarketVariety } from './types';
import { INITIAL_EVENTS, INITIAL_CATEGORIES } from './data/mockEvents';
import { PlatformHeader, PlatformTab } from './components/PlatformHeader';
import { Sidebar, ResearchSubMenu } from './components/Sidebar';
import { EventMainView } from './components/EventMainView';
import { EventDrawer } from './components/EventDrawer';
import { PreviewModal } from './components/PreviewModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { AddIndustryModal } from './components/AddIndustryModal';
import { AddVarietyModal } from './components/AddVarietyModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { exportEventsToExcel } from './utils/excelExport';
import { Check, ShieldAlert, Database, BarChart3, ArrowRight, Zap, FileText, Calendar } from 'lucide-react';

export default function App() {
  // Navigation State
  const [platformTab, setPlatformTab] = useState<PlatformTab>('research_info');
  const [researchSubMenu, setResearchSubMenu] = useState<ResearchSubMenu>('macro_events');

  // Persistence in localStorage
  const [events, setEvents] = useState<MacroEvent[]>(() => {
    const saved = localStorage.getItem('ycm_macro_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved events:', e);
      }
    }
    return INITIAL_EVENTS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('ycm_macro_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved categories:', e);
      }
    }
    return INITIAL_CATEGORIES;
  });

  const [activeEventId, setActiveEventId] = useState<string>(
    events[0]?.id || INITIAL_EVENTS[0].id
  );
  
  // Drawer & Modal Visibility States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Modals
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddIndustryOpen, setIsAddIndustryOpen] = useState(false);
  const [isAddVarietyOpen, setIsAddVarietyOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewEvent, setPreviewEvent] = useState<MacroEvent | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<{ id: string; title: string } | null>(null);

  // Toast State
  const [isSavedJustNow, setIsSavedJustNow] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  // Save to localStorage whenever events or categories change
  useEffect(() => {
    localStorage.setItem('ycm_macro_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('ycm_macro_categories', JSON.stringify(categories));
  }, [categories]);

  // Data Sanitization Effect: Automatically sanitize any stale '疫情与卫生' to '公共卫生'
  useEffect(() => {
    // 1. Sanitize categories
    if (categories.some((c) => c === '疫情与卫生')) {
      const sanitizedCats = Array.from(
        new Set(categories.map((c) => (c === '疫情与卫生' ? '公共卫生' : c)))
      );
      setCategories(sanitizedCats);
    }

    // 2. Sanitize events
    let eventChanged = false;
    const sanitizedEvents = events.map((evt) => {
      if (evt.categories.includes('疫情与卫生')) {
        eventChanged = true;
        const newCats = Array.from(
          new Set(evt.categories.map((c) => (c === '疫情与卫生' ? '公共卫生' : c)))
        );
        return { ...evt, categories: newCats };
      }
      return evt;
    });

    if (eventChanged) {
      setEvents(sanitizedEvents);
    }
  }, []);

  // Current active event
  const activeEvent =
    events.find((e) => e.id === activeEventId) || events[0] || INITIAL_EVENTS[0];

  // Update active event
  const handleUpdateActiveEvent = (updated: MacroEvent) => {
    const newEvents = events.map((e) => (e.id === updated.id ? updated : e));
    setEvents(newEvents);
  };

  // Add custom category
  const handleAddCategory = (newCat: string) => {
    if (!categories.includes(newCat)) {
      setCategories([...categories, newCat]);
    }
    if (activeEvent && !activeEvent.categories.includes(newCat)) {
      handleUpdateActiveEvent({
        ...activeEvent,
        categories: [...activeEvent.categories, newCat],
      });
    }
  };

  // Batch save industries
  const handleSaveIndustries = (industries: ImpactedIndustry[]) => {
    if (activeEvent) {
      handleUpdateActiveEvent({
        ...activeEvent,
        impactedIndustries: industries,
      });
    }
  };

  // Add market varieties (supports batch add)
  const handleAddVariety = (varieties: MarketVariety | MarketVariety[]) => {
    if (activeEvent) {
      const toAdd = Array.isArray(varieties) ? varieties : [varieties];
      handleUpdateActiveEvent({
        ...activeEvent,
        marketVarieties: [...activeEvent.marketVarieties, ...toAdd],
      });
    }
  };

  // Select Event from Main List
  const handleSelectEvent = (id: string, openDrawer: boolean = false) => {
    setActiveEventId(id);
    if (openDrawer) {
      setIsDrawerOpen(true);
    }
  };

  // Directly create new event and configure in Drawer
  const handleAddNewEvent = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const newEvent: MacroEvent = {
      id: `evt-${Date.now()}`,
      title: '新建重大事件',
      startDate: dateStr,
      categories: [categories[0] || '金融风险与危机'],
      description: '',
      impactedIndustries: [],
      marketVarieties: [],
      severity: 'medium',
      eventIntensity: undefined,
      commodityImpact: undefined,
      transmissionMechanism: '',
      managerNotes: '',
      researcherNotes: '',
      researcherName: '俞尘泯',
      updatedAt: `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    };

    setEvents([newEvent, ...events]);
    setActiveEventId(newEvent.id);
    setIsDrawerOpen(true);
  };

  // Export Events to Excel Table
  const handleExportExcel = () => {
    exportEventsToExcel(events);
    setToastText(`全量 ${events.length} 项重大事件已成功导出`);
    setTimeout(() => {
      setToastText(null);
    }, 2500);
  };

  // Manual Save Config Action
  const handleSaveConfig = () => {
    localStorage.setItem('ycm_macro_events', JSON.stringify(events));
    localStorage.setItem('ycm_macro_categories', JSON.stringify(categories));
    setIsSavedJustNow(true);
    setToastText('成功保存！');

    setTimeout(() => {
      setIsSavedJustNow(false);
      setToastText(null);
    }, 2000);
  };

  // Open Preview Modal
  const handlePreviewEvent = (evt: MacroEvent) => {
    setPreviewEvent(evt);
    setIsPreviewModalOpen(true);
  };

  // Delete Event Action
  const handleConfirmDelete = () => {
    if (!deletingTarget) return;
    const { id, title } = deletingTarget;
    const updatedEvents = events.filter((e) => e.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('ycm_macro_events', JSON.stringify(updatedEvents));

    if (activeEventId === id) {
      if (updatedEvents.length > 0) {
        setActiveEventId(updatedEvents[0].id);
      } else {
        setActiveEventId('');
      }
      setIsDrawerOpen(false);
    }

    setDeletingTarget(null);
    setToastText(`已成功删除“${title}”`);
    setTimeout(() => {
      setToastText(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] text-[#111827] font-sans overflow-hidden">
      {/* Platform Header with Top Navigation Menu */}
      <PlatformHeader
        activeTab={platformTab}
        onSelectTab={setPlatformTab}
        researcherName="俞尘泯"
      />

      {/* Main Body Area */}
      <div className="flex-1 flex min-h-0 relative">
        {platformTab === 'research_info' ? (
          <>
            <Sidebar
              activeSubMenu={researchSubMenu}
              onSelectSubMenu={setResearchSubMenu}
              eventCount={events.length}
            />

            {researchSubMenu === 'macro_events' ? (
              <EventMainView
                events={events}
                activeEventId={activeEventId}
                onSelectEvent={handleSelectEvent}
                onAddNewEvent={handleAddNewEvent}
                onExportExcel={handleExportExcel}
                onPreviewEvent={handlePreviewEvent}
                onRequestDelete={(id, title) => setDeletingTarget({ id, title })}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategoryFilter={selectedCategoryFilter}
                onSelectCategoryFilter={setSelectedCategoryFilter}
                categories={categories}
              />
            ) : (
              /* Sub-menu placeholder view for 快讯, 研报, 财经日历 */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
                  {researchSubMenu === 'flash_news' && <Zap className="w-10 h-10" />}
                  {researchSubMenu === 'research_report' && <FileText className="w-10 h-10" />}
                  {researchSubMenu === 'calendar' && <Calendar className="w-10 h-10" />}
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  {researchSubMenu === 'flash_news' && '快讯 资讯流'}
                  {researchSubMenu === 'research_report' && '研报 深度数据库'}
                  {researchSubMenu === 'calendar' && '财经日历 数据中心'}
                </h2>
                <button
                  onClick={() => setResearchSubMenu('macro_events')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>切换至「重大事件」模块</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Placeholder View for other Platform Tabs */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
              {platformTab === 'black_swan' && <ShieldAlert className="w-10 h-10" />}
              {platformTab === 'base_info' && <Database className="w-10 h-10" />}
              {platformTab === 'research_data' && <BarChart3 className="w-10 h-10" />}
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {platformTab === 'black_swan' && '黑天鹅预警模块'}
              {platformTab === 'base_info' && '基础信息与知识库'}
              {platformTab === 'research_data' && '研究数据与行情指标'}
            </h2>
            <button
              onClick={() => setPlatformTab('research_info')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>返回「研究资讯 - 重大事件」</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right Side Drawer Panel for Event Field Configuration */}
        {activeEvent && (
          <EventDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            event={activeEvent}
            categories={categories}
            onChange={handleUpdateActiveEvent}
            onOpenAddCategory={() => setIsAddCategoryOpen(true)}
            onOpenAddIndustry={() => setIsAddIndustryOpen(true)}
            onOpenAddVariety={() => setIsAddVarietyOpen(true)}
            onSaveConfig={handleSaveConfig}
            onPreview={() => handlePreviewEvent(activeEvent)}
            onRequestDelete={(id, title) => setDeletingTarget({ id, title })}
            isSavedJustNow={isSavedJustNow}
          />
        )}
      </div>

      {/* Global Toast Notification */}
      {toastText && (
        <div className="fixed bottom-6 right-8 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Dialog Modals */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingTarget)}
        title={deletingTarget?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTarget(null)}
      />

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAdd={handleAddCategory}
      />

      <AddIndustryModal
        isOpen={isAddIndustryOpen}
        onClose={() => setIsAddIndustryOpen(false)}
        onSave={handleSaveIndustries}
        existingIndustries={activeEvent?.impactedIndustries || []}
      />

      <AddVarietyModal
        isOpen={isAddVarietyOpen}
        onClose={() => setIsAddVarietyOpen(false)}
        onAdd={handleAddVariety}
        existingVarieties={activeEvent?.marketVarieties || []}
      />

      {isPreviewModalOpen && previewEvent && (
        <PreviewModal
          event={previewEvent}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}
    </div>
  );
}
