import { extractApiData } from "@/lib/auth";
import type { Classroom, MyClassesResponse } from "@/types/classroom";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

export const classroomService = {
  myClasses: async () => {
    const res = await apiService.get(API_ENDPOINTS.CLASSROOM.ME_CLASSES);
    const data = extractApiData<MyClassesResponse>(res);
    return {
      memberships: data?.memberships || [],
      taught: data?.taught || [],
    };
  },

  join: async (code: string) => {
    const res = await apiService.post(API_ENDPOINTS.CLASSROOM.JOIN, { code: code.trim() });
    return extractApiData<Classroom>(res);
  },

  detail: async (id: string) => {
    const res = await apiService.get(API_ENDPOINTS.CLASSROOM.DETAIL(id));
    return extractApiData<Classroom>(res);
  },

  submitAssignment: async (assignmentId: string, attemptId?: string) => {
    const res = await apiService.post(API_ENDPOINTS.CLASSROOM.SUBMIT_ASSIGNMENT(assignmentId), {
      attemptId,
    });
    return extractApiData(res);
  },
};

export default classroomService;
