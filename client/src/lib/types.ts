// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  profileImage?: string;
  profession: string;
  specialization?: string;
  bio?: string;
  organization?: string;
  location?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    other?: string;
  };
}

// Event related types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'In-person' | 'Virtual' | 'Hybrid';
  category?: string;
  location?: string;
  image: string;
  price: number;
  cpdPoints: number;
  attendees?: number;
  learningOutcomes?: string[];
  accreditationBody: string;
  discount?: {
    type: string;
    label: string;
    amount: number;
  };
  speakers?: Speaker[];
  schedule?: ScheduleItem[];
  ticketTypes?: TicketType[];
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  image?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  availableUntil?: string;
}

export interface EventFilter {
  type: string[];
  category: string[];
  dateRange: string;
  cpdPoints: string;
}

// Course related types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: string;
  modules: number;
  cpdPoints: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  accreditedBy: string;
  rating?: number;
  reviews?: number;
  progress?: {
    status: string;
    percentage: number;
    lastAccessed: string;
  };
  learningOutcomes?: string[];
  targetAudience?: string[];
  videoHours?: string;
  resources?: string;
  instructors?: Instructor[];
  curriculum?: CourseModule[];
  lessons?: number;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  image?: string;
  credentials?: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  duration: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'download';
  duration: string;
  completed?: boolean;
}

export interface CourseFilter {
  category: string[];
  duration: string;
  cpdPoints: string;
  difficulty: string;
}

// CPD related types
export interface CpdSummary {
  currentPoints: number;
  requiredPoints: number;
  period: string;
  categories: CpdCategory[];
}

export interface CpdCategory {
  id: string | number;
  name: string;
  earnedPoints: number;
  requiredPoints: number;
}

export interface CpdActivity {
  id: string;
  title: string;
  date: string;
  type: 'Event' | 'Course' | 'Publication' | 'Other';
  category: string;
  points: number;
  source: string;
  certificateUrl?: string;
}

// Community related types
export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    profileImage?: string;
  };
  forum: string;
  timeAgo: string;
  comments: number;
  likes: number;
  tags?: string[];
}

export interface MentorshipOpportunity {
  id: string;
  name: string;
  position: string;
  profileImage?: string;
  specialties: string[];
  availability?: string;
  rating?: number;
  reviews?: number;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  topics: number;
  posts: number;
  lastActivity?: string;
}
