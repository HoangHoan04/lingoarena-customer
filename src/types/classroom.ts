export interface ClassroomTeacher {
  id?: string;
  fullName?: string;
  displayName?: string;
  email?: string;
}

export interface ClassroomAssignment {
  id: string;
  classroomId: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  assignmentType: string;
  resourceId: string;
  dueAt: string;
  maxScore?: number | string | null;
  status?: string;
  score?: number | string | null;
  submittedAt?: string | null;
  teacherFeedback?: string | null;
}

export interface ClassroomAnnouncement {
  id: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  createdAt?: string;
  title?: string;
  content?: string;
  attachments?: Array<{ name: string; url: string; size?: string }>;
}

export interface ClassroomSyllabusItem {
  week?: string;
  topic?: string;
  status?: string;
}

export interface Classroom {
  id: string;
  name: string;
  nameEn?: string | null;
  code: string;
  status?: string;
  startDate?: string | null;
  endDate?: string | null;
  capacity?: number;
  schedule?: string | null;
  roomType?: string | null;
  meetingLink?: string | null;
  studentCount?: number;
  teacher?: ClassroomTeacher | null;
  course?: { id: string; title?: string; slug?: string } | null;
  assignments?: ClassroomAssignment[];
  members?: Array<{ id: string; userId: string; status?: string }>;
  announcements?: ClassroomAnnouncement[];
  syllabus?: ClassroomSyllabusItem[];
}

export interface ClassroomMembership {
  id?: string;
  classroomId?: string;
  userId?: string;
  joinedAt?: string;
  classroom?: Classroom | null;
}

export interface MyClassesResponse {
  memberships?: ClassroomMembership[];
  taught?: Classroom[];
}
