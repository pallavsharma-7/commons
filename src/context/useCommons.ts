import { useContext } from 'react';
import { CommonsContext, type CommonsContextType } from './CommonsContext';

export const useCommons = (): CommonsContextType => {
  const context = useContext(CommonsContext);
  if (!context) {
    throw new Error('useCommons must be used within a CommonsProvider');
  }
  return context;
};
