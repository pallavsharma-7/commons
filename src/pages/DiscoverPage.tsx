import React, { useState, useMemo } from 'react';
import { useCommons } from '../context/CommonsContext';
import type { ResourceCategory, Resource } from '../types';
import { SearchBar } from '../components/common/SearchBar';
import { FilterBar } from '../components/common/FilterBar';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceTable } from '../components/resources/ResourceTable';
import { RequestModal } from '../components/resources/RequestModal';
import { LayoutGrid, List } from 'lucide-react';

const CATEGORIES: (ResourceCategory | 'All')[] = [
  'All',
  'Lab Equipment',
  'Electronics & Circuits',
  'AV & Media',
  'Fabrication & 3D',
  'Facilities & Rooms',
  'Computing & GPU',
];

export const DiscoverPage: React.FC = () => {
  const { resources } = useCommons();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'All'>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<'all' | 'available' | 'reserved'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Modal state
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Search matching
      const matchesSearch = 
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category matching
      const matchesCategory = 
        selectedCategory === 'All' || res.category === selectedCategory;

      // Availability matching
      const matchesAvailability = 
        selectedAvailability === 'all' 
          ? true 
          : selectedAvailability === 'available'
          ? res.isAvailableNow
          : !res.isAvailableNow;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [resources, searchQuery, selectedCategory, selectedAvailability]);

  const handleOpenRequest = (res: Resource) => {
    setSelectedResource(res);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#202B3C] tracking-tight leading-tight">
            Discover Resources
          </h1>
          <p className="text-[13px] text-[#858D91] mt-0.5">
            Browse shared laboratory instrumentation, fabrication machinery, media gear, and academic spaces.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white border border-[#E8EBE9] p-0.5 rounded-md self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid' 
                ? 'bg-[#E7F2EC] text-[#176B4A]' 
                : 'text-[#858D91] hover:text-[#202B3C]'
            }`}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'table' 
                ? 'bg-[#E7F2EC] text-[#176B4A]' 
                : 'text-[#858D91] hover:text-[#202B3C]'
            }`}
            title="Table View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[#E8EBE9] rounded-lg p-4 space-y-4 shadow-xs">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by resource name, model, tag, department, or campus building..."
        />

        <FilterBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedAvailability={selectedAvailability}
          onSelectAvailability={setSelectedAvailability}
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-[12px] text-[#858D91]">
        <span>
          Showing <strong>{filteredResources.length}</strong> cataloged resources
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {selectedAvailability !== 'all' && ` (${selectedAvailability === 'available' ? 'Available' : 'Reserved/In Use'})`}
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#176B4A] hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Resource Content */}
      {filteredResources.length === 0 ? (
        <div className="bg-white border border-[#E8EBE9] rounded-lg p-12 text-center space-y-3">
          <p className="text-[15px] font-semibold text-[#202B3C]">
            No resources match your filter criteria
          </p>
          <p className="text-[13px] text-[#858D91] max-w-md mx-auto">
            Try adjusting your search keywords, clearing availability filters, or exploring all department categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedAvailability('all');
            }}
            className="px-4 py-2 text-[12px] font-medium text-white bg-[#176B4A] rounded-md hover:bg-[#104B36] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredResources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onRequestBooking={handleOpenRequest}
            />
          ))}
        </div>
      ) : (
        <ResourceTable
          resources={filteredResources}
          onRequestBooking={handleOpenRequest}
        />
      )}

      {/* Request Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={selectedResource}
      />
    </div>
  );
};
