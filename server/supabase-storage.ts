import { createClient } from '@supabase/supabase-js';
import { 
  IStorage, 
  EventFilter, 
  CourseFilter, 
  CpdActivityFilter 
} from "./storage";
import { 
  User, 
  InsertUser, 
  Event, 
  EventRegistration, 
  Course, 
  CourseEnrollment,
  CpdActivity,
  ForumCategory,
  Discussion,
  MentorshipOpportunity,
  Credential
} from "../shared/schema";

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export class SupabaseStorage implements IStorage {
  async getUserById(id: number): Promise<User | undefined> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
    
    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
    
    return data;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        ...insertUser,
        privacy_settings: { profile_visibility: 'public', contact_visibility: 'members' }
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
    
    return data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
    
    return data;
  }

  async updateUserPrivacySettings(id: number, privacySettings: any): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ privacy_settings: privacySettings })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating privacy settings:', error);
      throw new Error('Failed to update privacy settings');
    }
    
    return data;
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(5);
    
    if (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
    
    return data;
  }

  async getAllEvents(filters?: EventFilter): Promise<Event[]> {
    let query = supabase.from('events').select('*');
    
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    if (filters?.category && filters.category.length > 0) {
      query = query.in('category', filters.category);
    }
    
    if (filters?.type && filters.type.length > 0) {
      query = query.in('type', filters.type);
    }
    
    const { data, error } = await query.order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    
    return data;
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching event:', error);
      return undefined;
    }
    
    return data;
  }

  async getEventCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('events')
      .select('category')
      .not('category', 'is', null);
    
    if (error) {
      console.error('Error fetching event categories:', error);
      return [];
    }
    
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  }

  async registerForEvent(userId: number, eventId: number, ticketTypeId: string, quantity: number): Promise<EventRegistration> {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        user_id: userId,
        event_id: eventId,
        ticket_type_id: ticketTypeId,
        quantity,
        total_amount: 0, // Calculate based on ticket type
        status: 'confirmed'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error registering for event:', error);
      throw new Error('Failed to register for event');
    }
    
    return data;
  }

  async getUserCourses(userId: number, status?: string): Promise<Course[]> {
    let query = supabase
      .from('course_enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', userId);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching user courses:', error);
      return [];
    }
    
    return data.map(enrollment => enrollment.courses);
  }

  async getRecommendedCourses(userId: number): Promise<Course[]> {
    // Simple recommendation logic - can be enhanced with AI
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching recommended courses:', error);
      return [];
    }
    
    return data;
  }

  async getAllCourses(filters?: CourseFilter): Promise<Course[]> {
    let query = supabase.from('courses').select('*');
    
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    if (filters?.category && filters.category.length > 0) {
      query = query.in('category', filters.category);
    }
    
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    
    return data;
  }

  async getCourseById(id: number, userId?: number): Promise<Course | undefined> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching course:', error);
      return undefined;
    }
    
    return data;
  }

  async getCourseCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('category')
      .not('category', 'is', null);
    
    if (error) {
      console.error('Error fetching course categories:', error);
      return [];
    }
    
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  }

  async enrollInCourse(userId: number, courseId: number): Promise<CourseEnrollment> {
    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'enrolled',
        progress: 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error enrolling in course:', error);
      throw new Error('Failed to enroll in course');
    }
    
    return data;
  }

  async getCpdSummary(userId: number): Promise<any> {
    const { data, error } = await supabase
      .from('cpd_activities')
      .select('cpd_points, activity_type, date')
      .eq('user_id', userId)
      .gte('date', new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
    
    if (error) {
      console.error('Error fetching CPD summary:', error);
      return { currentPoints: 0, requiredPoints: 36, period: 'Current Year' };
    }
    
    const currentPoints = data.reduce((sum, activity) => sum + activity.cpd_points, 0);
    
    return {
      currentPoints,
      requiredPoints: 36,
      period: 'Current Year',
      breakdown: data.reduce((acc, activity) => {
        acc[activity.activity_type] = (acc[activity.activity_type] || 0) + activity.cpd_points;
        return acc;
      }, {})
    };
  }

  async getCpdStatus(userId: number): Promise<any> {
    const summary = await this.getCpdSummary(userId);
    const pointsNeeded = Math.max(0, summary.requiredPoints - summary.currentPoints);
    
    return {
      pointsNeeded,
      period: 'Current Quarter',
      status: pointsNeeded === 0 ? 'On Track' : 'Behind',
      percentage: Math.round((summary.currentPoints / summary.requiredPoints) * 100)
    };
  }

  async getCpdActivities(userId: number, filters?: CpdActivityFilter): Promise<CpdActivity[]> {
    let query = supabase
      .from('cpd_activities')
      .select('*')
      .eq('user_id', userId);
    
    if (filters?.year) {
      query = query.gte('date', `${filters.year}-01-01`).lte('date', `${filters.year}-12-31`);
    }
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching CPD activities:', error);
      return [];
    }
    
    return data;
  }

  async getForumCategories(): Promise<ForumCategory[]> {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching forum categories:', error);
      return [];
    }
    
    return data;
  }

  async getTrendingDiscussions(): Promise<Discussion[]> {
    const { data, error } = await supabase
      .from('discussions')
      .select('*')
      .order('views_count', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching trending discussions:', error);
      return [];
    }
    
    return data;
  }

  async getRecentDiscussions(): Promise<Discussion[]> {
    const { data, error } = await supabase
      .from('discussions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching recent discussions:', error);
      return [];
    }
    
    return data;
  }

  async getMentorshipOpportunities(): Promise<MentorshipOpportunity[]> {
    const { data, error } = await supabase
      .from('mentorship_opportunities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching mentorship opportunities:', error);
      return [];
    }
    
    return data;
  }

  async getUserCredentials(userId: number): Promise<Credential[]> {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching credentials:', error);
      return [];
    }
    
    return data;
  }

  async getCredentialById(id: number): Promise<Credential | undefined> {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching credential:', error);
      return undefined;
    }
    
    return data;
  }

  async createCredential(credential: Partial<Credential>): Promise<Credential> {
    const { data, error } = await supabase
      .from('credentials')
      .insert(credential)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating credential:', error);
      throw new Error('Failed to create credential');
    }
    
    return data;
  }

  async updateCredential(id: number, credentialData: Partial<Credential>): Promise<Credential> {
    const { data, error } = await supabase
      .from('credentials')
      .update(credentialData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating credential:', error);
      throw new Error('Failed to update credential');
    }
    
    return data;
  }

  async deleteCredential(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('credentials')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting credential:', error);
      return false;
    }
    
    return true;
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    // In a real implementation, you would verify the current password
    // For now, we'll just update the password
    const { error } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('id', userId);
    
    if (error) {
      console.error('Error changing password:', error);
      return false;
    }
    
    return true;
  }

  async logout(userId: number): Promise<boolean> {
    // In Supabase, logout is typically handled on the client side
    // This is a placeholder for any server-side logout logic
    return true;
  }
}