import { JoinPolicy } from 'types/cast.types';

declare global {
  interface Window {
    cast: any;
    chrome: any;
  }
}

// ORIGIN_SCOPED - Auto connect from same appId and page origin
// TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
// PAGE_SCOPED - No auto connect

const CAST_JOIN_POLICY: JoinPolicy = {
  CUSTOM_CONTROLLER_SCOPED: 'custom_controller_scoped',
  TAB_AND_ORIGIN_SCOPED: 'tab_and_origin_scoped',
  ORIGIN_SCOPED: 'origin_scoped',
  PAGE_SCOPED: 'page_scoped'
};

export { CAST_JOIN_POLICY };
