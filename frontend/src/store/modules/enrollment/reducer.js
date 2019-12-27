import produce from 'immer';

const INITIAL_STATE = {
  enrollments: [],
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
    totalPage: 0,
  },
  enrollment: {},
  loading: false,
};

export default function enrollment(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@enrollment/ENROLLMENT_SEARCH_REQUEST': {
        draft.loading = true;
        break;
      }

      case '@enrollment/ENROLLMENT_SEARCH_SUCCESS': {
        draft.enrollments = action.payload.data;
        draft.pagination = action.payload.pagination;
        draft.loading = false;
        break;
      }

      case '@enrollment/ENROLLMENT_SAVE_REQUEST': {
        draft.loading = true;
        break;
      }

      case '@enrollment/ENROLLMENT_SAVE_SUCCESS': {
        draft.enrollment = action.payload.data;
        draft.loading = false;
        break;
      }

      case '@enrollment/ENROLLMENT_DELETE_REQUEST': {
        draft.loading = true;
        break;
      }

      case '@enrollment/ENROLLMENT_DELETE_SUCCESS': {
        draft.loading = false;
        draft.enrollments = state.enrollments.filter(el => el.id !== action.id);
        break;
      }

      case '@enrollment/ENROLLMENT_FAILURE': {
        draft.loading = false;
        break;
      }

      default:
        return state;
    }
  });
}
