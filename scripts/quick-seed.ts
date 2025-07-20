// Quick seeding script for Supabase database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting SportXTracker database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await supabase.from('cpd_activities').delete().neq('id', 0);
    await supabase.from('mentorship_opportunities').delete().neq('id', 0);
    await supabase.from('discussions').delete().neq('id', 0);
    await supabase.from('forum_categories').delete().neq('id', 0);
    await supabase.from('course_enrollments').delete().neq('id', 0);
    await supabase.from('courses').delete().neq('id', 0);
    await supabase.from('event_registrations').delete().neq('id', 0);
    await supabase.from('events').delete().neq('id', 0);
    await supabase.from('users').delete().neq('id', 0);

    // Professional Users
    console.log('👥 Creating professional users...');
    const users = [
      {
        username: "dr_sarah_smith",
        password: "password123",
        name: "Dr. Sarah Smith",
        email: "sarah.smith@sportsmedicine.com",
        role: "resource_person",
        profession: "Physiotherapist",
        specialization: "Sports Injury Prevention",
        bio: "Expert physiotherapist with 15 years in sports medicine, specializing in injury prevention and rehabilitation for elite athletes across multiple sports disciplines.",
        organization: "SportsMed Clinic Mumbai",
        location: "Mumbai, Maharashtra",
        profile_image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        contact_info: { phone: "+91-9876543210", website: "https://drsarahsmith.com" },
        social_links: { linkedin: "https://linkedin.com/in/drsarahsmith", twitter: "https://twitter.com/drsarahsmith" },
        privacy_settings: { profilePublic: true, allowMessages: true, allowMentorship: true, showCourses: true, showEvents: true, showCpd: false },
        is_online: true,
        last_seen: new Date("2025-07-20T10:30:00Z").toISOString()
      },
      {
        username: "coach_rahul",
        password: "password123", 
        name: "Rahul Sharma",
        email: "rahul.sharma@performancelab.com",
        role: "resource_person",
        profession: "Strength & Conditioning Coach",
        specialization: "Performance Enhancement",
        bio: "Certified strength and conditioning specialist working with professional cricket and football teams across India. Expert in Olympic lifting and power development.",
        organization: "Elite Performance Center Delhi",
        location: "New Delhi, Delhi",
        profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        contact_info: { phone: "+91-9876543211", website: "https://rahulsharma.fitness" },
        social_links: { linkedin: "https://linkedin.com/in/rahulsharma", instagram: "https://instagram.com/coachrahul" },
        privacy_settings: { profilePublic: true, allowMessages: true, allowMentorship: true, showCourses: true, showEvents: true, showCpd: true },
        is_online: false,
        last_seen: new Date("2025-07-20T08:15:00Z").toISOString()
      },
      {
        username: "nutritionist_priya",
        password: "password123",
        name: "Dr. Priya Patel", 
        email: "priya.patel@sportsnutrition.in",
        role: "resource_person",
        profession: "Sports Nutritionist",
        specialization: "Performance Nutrition",
        bio: "Sports nutritionist with expertise in performance nutrition for endurance athletes, weight management, and supplement protocols for professional sports teams.",
        organization: "Sports Nutrition Institute Bangalore",
        location: "Bangalore, Karnataka",
        profile_image: "https://images.unsplash.com/photo-1594824681814-2e9c1bfe8dae?w=150&h=150&fit=crop&crop=face",
        contact_info: { phone: "+91-9876543212", website: "https://sportsnutrition.in" },
        social_links: { linkedin: "https://linkedin.com/in/drpriyapatel", website: "https://sportsnutrition.in" },
        privacy_settings: { profilePublic: true, allowMessages: true, allowMentorship: true, showCourses: true, showEvents: true, showCpd: true },
        is_online: true,
        last_seen: new Date("2025-07-20T11:45:00Z").toISOString()
      }
    ];

    const { data: insertedUsers, error: userError } = await supabase
      .from('users')
      .insert(users)
      .select();

    if (userError) throw userError;
    console.log(`✅ Created ${insertedUsers?.length} professional users`);

    // Professional Events
    console.log('📅 Creating professional events...');
    const events = [
      {
        title: "Advanced Sports Injury Assessment Workshop",
        description: "Comprehensive workshop covering latest techniques in sports injury assessment and diagnosis. Learn from leading experts in the field using hands-on practical sessions.",
        date: "2025-08-15",
        start_time: "09:00",
        end_time: "17:00",
        type: "In-person",
        category: "Sports Medicine",
        location: "Mumbai, India",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        price: "2500.00",
        cpd_points: 6,
        max_attendees: 50,
        current_attendees: 23,
        accreditation_body: "Sports Medicine India",
        status: "upcoming",
        learning_outcomes: ["Master advanced assessment techniques", "Understand injury biomechanics", "Develop clinical reasoning skills", "Learn evidence-based protocols"],
        speakers: [{
          id: "1",
          name: "Dr. Sarah Smith",
          bio: "Expert physiotherapist with 15 years experience",
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
          expertise: ["Sports Injury Prevention", "Manual Therapy"]
        }],
        schedule: [
          { time: "09:00", activity: "Registration & Welcome", duration: "30 minutes" },
          { time: "09:30", activity: "Keynote: Modern Sports Assessment", speaker: "Dr. Sarah Smith", duration: "90 minutes" },
          { time: "11:00", activity: "Practical Session: Assessment Techniques", duration: "120 minutes" }
        ],
        tags: ["workshop", "assessment", "sports", "injury"]
      },
      {
        title: "Nutrition for Endurance Athletes Webinar",
        description: "Learn evidence-based nutrition strategies for optimizing endurance performance. Covers pre, during, and post-exercise nutrition with real-world case studies.",
        date: "2025-08-22",
        start_time: "19:00",
        end_time: "21:00",
        type: "Virtual",
        category: "Nutrition",
        location: "Online",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
        price: "1500.00",
        cpd_points: 3,
        max_attendees: 100,
        current_attendees: 67,
        accreditation_body: "ACSM",
        status: "upcoming",
        learning_outcomes: ["Understand energy systems", "Master fueling strategies", "Learn hydration protocols", "Apply nutrition periodization"],
        speakers: [{
          id: "2",
          name: "Dr. Priya Patel",
          bio: "Sports nutritionist with expertise in performance nutrition",
          image: "https://images.unsplash.com/photo-1594824681814-2e9c1bfe8dae?w=150&h=150&fit=crop&crop=face",
          expertise: ["Performance Nutrition", "Weight Management"]
        }],
        schedule: [
          { time: "19:00", activity: "Introduction to Endurance Nutrition", speaker: "Dr. Priya Patel", duration: "120 minutes" }
        ],
        tags: ["nutrition", "endurance", "webinar", "performance"]
      },
      {
        title: "Strength Training for Injury Prevention Conference",
        description: "Two-day conference exploring the role of strength training in injury prevention across different sports and populations. Features international speakers and practical workshops.",
        date: "2025-09-05",
        start_time: "08:30",
        end_time: "17:30",
        type: "Hybrid",
        category: "Exercise Physiology",
        location: "Delhi, India",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        price: "3500.00",
        cpd_points: 8,
        max_attendees: 150,
        current_attendees: 89,
        accreditation_body: "NSCA",
        status: "upcoming",
        learning_outcomes: ["Understand injury mechanisms", "Design prevention programs", "Apply periodization principles", "Evaluate program effectiveness"],
        speakers: [{
          id: "3",
          name: "Rahul Sharma",
          bio: "Certified strength and conditioning specialist",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          expertise: ["Performance Enhancement", "Injury Prevention"]
        }],
        schedule: [
          { time: "08:30", activity: "Registration", duration: "30 minutes" },
          { time: "09:00", activity: "Opening Keynote", speaker: "Rahul Sharma", duration: "60 minutes" },
          { time: "10:00", activity: "Workshop: Program Design", duration: "120 minutes" }
        ],
        tags: ["strength", "prevention", "conference", "training"]
      }
    ];

    const { data: insertedEvents, error: eventError } = await supabase
      .from('events')
      .insert(events)
      .select();

    if (eventError) throw eventError;
    console.log(`✅ Created ${insertedEvents?.length} professional events`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${insertedUsers?.length}`);
    console.log(`   📅 Events: ${insertedEvents?.length}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedDatabase().then(() => {
  console.log('✅ SportXTracker seeding completed');
  process.exit(0);
});