import { useState, useMemo } from 'react';
import { sampleResources } from '../data/mockData';
import type { Resource, ResourceCategory } from '../types';

export function useResources() {
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ResourceCategory | 'All'>('All');
  const [availability, setAvailability] = useState<'all' | 'available' | 'reserved'>('all');

  const filtered = useMemo(() => {
    return resources.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.department.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === 'All' || item.category === category;

      const matchAvail =
        availability === 'all'
          ? true
          : availability === 'available'
          ? item.isAvailableNow
          : !item.isAvailableNow;

      return matchSearch && matchCategory && matchAvail;
    });
  }, [resources, search, category, availability]);

  return {
    resources: filtered,
    allResources: resources,
    search,
    setSearch,
    category,
    setCategory,
    availability,
    setAvailability,
    setResources,
  };
}
