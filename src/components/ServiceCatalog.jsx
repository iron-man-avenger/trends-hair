import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES } from '../data/salonData';
import ServiceCard from './ServiceCard';

export default function ServiceCatalog({ selectedServices, onToggleService }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.gender.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section className="px-4 py-6 max-w-4xl mx-auto space-y-6">
      {/* Search & Category Tabs */}
      <div className="space-y-4 text-left">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="font-editorial text-2xl text-[#1A1918] font-normal">
            Services & Treatments
          </h3>

          {/* Minimal Search Bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#8C8477] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments..."
              className="w-full bg-white border border-[#EAE4D9] rounded-full pl-9 pr-8 py-2 text-xs text-[#1A1918] placeholder-[#9E9589] focus:outline-none focus:border-[#1A1918] shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8477] hover:text-[#1A1918]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Minimal Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1918] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#6B6357] border border-[#EAE4D9] hover:border-[#C5A880]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => {
            const isSelected = selectedServices.some((s) => s.id === service.id);
            return (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={isSelected}
                onToggle={onToggleService}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-14 text-center bg-white rounded-3xl border border-[#EAE4D9] space-y-2">
          <p className="text-[#736B60] text-sm">No treatments found matching "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="text-xs text-[#1A1918] font-bold underline underline-offset-4"
          >
            Show all treatments
          </button>
        </div>
      )}
    </section>
  );
}
