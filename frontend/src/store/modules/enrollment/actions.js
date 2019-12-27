export function enrollmentsSearchRequest(data) {
  return {
    type: '@enrollment/ENROLLMENT_SEARCH_REQUEST',
    payload: { data },
  };
}

export function enrollmentsSearchSuccess(data) {
  return {
    type: '@enrollment/ENROLLMENT_SEARCH_SUCCESS',
    payload: data,
  };
}

export function enrollmentsSaveRequest(data) {
  return {
    type: '@enrollment/ENROLLMENT_SAVE_REQUEST',
    payload: { data },
  };
}

export function enrollmentsSaveSuccess(data) {
  return {
    type: '@enrollment/ENROLLMENT_SAVE_SUCCESS',
    payload: { data },
  };
}

export function enrollmentsDeleteRequest(id) {
  return {
    type: '@enrollment/ENROLLMENT_DELETE_REQUEST',
    payload: { id },
  };
}

export function enrollmentsDeleteSuccess(id) {
  return {
    type: '@enrollment/ENROLLMENT_DELETE_SUCCESS',
    id,
  };
}

export function enrollmentsFailure() {
  return {
    type: '@enrollment/ENROLLMENT_FAILURE',
  };
}
