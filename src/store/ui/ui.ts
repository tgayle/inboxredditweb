import { RootState } from '@/store';
import { Module } from 'vuex';

/**
 * Represents the state of things that generally stay on screen most of the time like the toolbar.
 */
interface MainUiState {
}

const uiModule: Module<MainUiState, RootState> = {
  namespaced: true,
  actions: {
  },
};

export default uiModule;
