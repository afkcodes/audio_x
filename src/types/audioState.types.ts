export interface ReadyState {
  HAVE_NOTHING: 0;
  HAVE_METADATA: 1;
  HAVE_CURRENT_DATA: 2;
  HAVE_FUTURE_DATA: 3;
  HAVE_ENOUGH_DATA: 4;
}
