import { UIState } from './UIProvider';

type UIActionType = 
| { type: 'ToggleMenu' } 

export const uiReducer = (state: UIState, action: UIActionType): UIState => {
  switch (action.type) {
      case 'ToggleMenu':
          return {
              ...state,
              isMenuOpen: !state.isMenuOpen
          };

      default:
          return state;
      }
};