// Comprehensive seed data for SportXTracker platform
import { User, Event, Course, ForumCategory, Discussion, MentorshipOpportunity, CpdActivity } from '@shared/schema';

export function createComprehensiveSeedData() {
  // Professional Users Data
  const users: Omit<User, 'id'>[] = [
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
      profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      contactInfo: { phone: "+91-9876543210", website: "https://drsarahsmith.com" },
      socialLinks: { linkedin: "https://linkedin.com/in/drsarahsmith", twitter: "https://twitter.com/drsarahsmith" },
      privacySettings: { profilePublic: true, allowMessages: true, allowMentorship: true, showCourses: true, showEvents: true, showCpd: false },
      isOnline: true,
      lastSeen: new Date("2025-07-20T10:30:00Z"),
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2025-07-20")
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
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      contactInfo: { phone: "+91-9876543211", website: "https://rahulsharma.fitness" },
      socialLinks: { linkedin: "https://linkedin.com/in/rahulsharma", instagram: "https://instagram.com/coachrahul" },
      privacySettings: { profilePublic: true, allowMessages: true, allowMentorship: true, showCourses: true, showEvents: true, showCpd: true },
      isOnline: false,
      lastSeen: new Date("2025-07-20T08:15:00Z"),
      createdAt: new Date("2024-02-10"),
      updatedAt: new Date("2025-07-20")
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
      profileImage: "https://images.unsplash.com/photo-1594824681814-2e9c1bfe8dae?w=150&h=150&fit=crop&crop=face",
      contactInfo: { phone: "+91-9876543212", website: "https://sportsnutrition.in" },
      socialLinks: { linkedin: "https://linkedin.com/in/drpriyapatel", website: "https://sportsnutrition.in" },
      privacySettings: { profilePublic: true, allowMessages: true, allowMentorship: true, showCourses: true, showEvents: true, showCpd: true },
      isOnline: true,
      lastSeen: new Date("2025-07-20T11:45:00Z"),
      createdAt: new Date("2024-03-05"),
      updatedAt: new Date("2025-07-20")
    },
    {
      username: "physio_rajesh",
      password: "password123",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@rehabcenter.com", 
      role: "user",
      profession: "Physiotherapist",
      specialization: "Orthopedic Rehabilitation",
      bio: "Experienced physiotherapist specializing in orthopedic rehabilitation and manual therapy techniques. Currently expanding knowledge in sports medicine applications.",
      organization: "Rehabilitation Institute Pune",
      location: "Pune, Maharashtra",
      profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      contactInfo: { phone: "+91-9876543213" },
      socialLinks: { linkedin: "https://linkedin.com/in/rajeshkumar" },
      privacySettings: { profilePublic: true, allowMessages: true, allowMentorship: false, showCourses: true, showEvents: true, showCpd: false },
      isOnline: false,
      lastSeen: new Date("2025-07-19T16:30:00Z"),
      createdAt: new Date("2024-04-20"),
      updatedAt: new Date("2025-07-20")
    },
    {
      username: "student_anjali",
      password: "password123",
      name: "Anjali Gupta",
      email: "anjali.gupta@student.edu",
      role: "user", 
      profession: "Exercise Physiologist",
      specialization: "Cardiac Rehabilitation",
      bio: "Final year student pursuing Masters in Exercise Physiology with special interest in cardiac rehabilitation programs and exercise prescription for chronic conditions.",
      organization: "University Sports Medicine Mumbai",
      location: "Mumbai, Maharashtra",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b15c2d15?w=150&h=150&fit=crop&crop=face",
      contactInfo: { phone: "+91-9876543214" },
      socialLinks: { linkedin: "https://linkedin.com/in/anjaligupta", instagram: "https://instagram.com/anjali_exphys" },
      privacySettings: { profilePublic: true, allowMessages: true, allowMentorship: false, showCourses: true, showEvents: true, showCpd: false },
      isOnline: true,
      lastSeen: new Date("2025-07-20T12:00:00Z"),
      createdAt: new Date("2024-06-15"),
      updatedAt: new Date("2025-07-20")
    }
  ];

  // Professional Events Data
  const events: Omit<Event, 'id'>[] = [
    {
      title: "Advanced Sports Injury Assessment Workshop",
      description: "Comprehensive workshop covering latest techniques in sports injury assessment and diagnosis. Learn from leading experts in the field using hands-on practical sessions.",
      date: "2025-08-15",
      startTime: "09:00",
      endTime: "17:00",
      type: "In-person",
      category: "Sports Medicine",
      location: "Mumbai, India",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      price: "2500.00",
      cpdPoints: 6,
      maxAttendees: 50,
      currentAttendees: 23,
      accreditationBody: "Sports Medicine India",
      status: "upcoming",
      learningOutcomes: ["Master advanced assessment techniques", "Understand injury biomechanics", "Develop clinical reasoning skills", "Learn evidence-based protocols"],
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
      tags: ["workshop", "assessment", "sports", "injury"],
      createdAt: new Date("2025-06-01"),
      updatedAt: new Date("2025-07-15")
    },
    {
      title: "Nutrition for Endurance Athletes Webinar",
      description: "Learn evidence-based nutrition strategies for optimizing endurance performance. Covers pre, during, and post-exercise nutrition with real-world case studies.",
      date: "2025-08-22",
      startTime: "19:00",
      endTime: "21:00",
      type: "Virtual",
      category: "Nutrition",
      location: "Online",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
      price: "1500.00",
      cpdPoints: 3,
      maxAttendees: 100,
      currentAttendees: 67,
      accreditationBody: "ACSM",
      status: "upcoming",
      learningOutcomes: ["Understand energy systems", "Master fueling strategies", "Learn hydration protocols", "Apply nutrition periodization"],
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
      tags: ["nutrition", "endurance", "webinar", "performance"],
      createdAt: new Date("2025-06-10"),
      updatedAt: new Date("2025-07-18")
    },
    {
      title: "Strength Training for Injury Prevention Conference",
      description: "Two-day conference exploring the role of strength training in injury prevention across different sports and populations. Features international speakers and practical workshops.",
      date: "2025-09-05",
      startTime: "08:30",
      endTime: "17:30",
      type: "Hybrid",
      category: "Exercise Physiology",
      location: "Delhi, India",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      price: "3500.00",
      cpdPoints: 8,
      maxAttendees: 150,
      currentAttendees: 89,
      accreditationBody: "NSCA",
      status: "upcoming",
      learningOutcomes: ["Understand injury mechanisms", "Design prevention programs", "Apply periodization principles", "Evaluate program effectiveness"],
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
      tags: ["strength", "prevention", "conference", "training"],
      createdAt: new Date("2025-06-20"),
      updatedAt: new Date("2025-07-20")
    }
  ];

  // Professional Development Courses
  const courses: Omit<Course, 'id'>[] = [
    {
      title: "Fundamentals of Sports Biomechanics",
      description: "Comprehensive course covering the fundamentals of biomechanical analysis in sports performance and injury prevention. Includes video analysis techniques and practical applications.",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      category: "Exercise Science",
      duration: "8 weeks",
      modules: 6,
      lessons: 24,
      cpdPoints: 12,
      difficulty: "Intermediate",
      accreditedBy: "BASES",
      price: "8500.00",
      rating: "4.7",
      reviews: 156,
      enrollmentCount: 892,
      learningOutcomes: ["Understand biomechanical principles", "Analyze movement patterns", "Apply assessment techniques", "Develop intervention strategies"],
      targetAudience: ["Physiotherapists", "Exercise Physiologists", "Sports Therapists"],
      prerequisites: ["Basic anatomy knowledge", "Understanding of physics concepts"],
      videoHours: "16 hours",
      resources: "45 downloadable resources",
      instructors: [{
        id: "1",
        name: "Dr. Sarah Smith",
        bio: "Expert in biomechanics and sports medicine",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        expertise: ["Biomechanics", "Movement Analysis"]
      }],
      curriculum: [{
        module: 1,
        title: "Introduction to Biomechanics",
        description: "Basic principles and concepts",
        lessons: [{
          id: "1",
          title: "What is Biomechanics?",
          duration: "20 minutes",
          type: "video"
        }]
      }],
      tags: ["biomechanics", "movement", "analysis", "sports"],
      isPublished: true,
      createdAt: new Date("2024-11-01"),
      updatedAt: new Date("2025-07-10")
    },
    {
      title: "Advanced Manual Therapy Techniques",
      description: "Master advanced manual therapy techniques for treating sports-related injuries and optimizing athletic performance. Evidence-based approach with practical applications.",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      category: "Clinical Skills",
      duration: "12 weeks",
      modules: 8,
      lessons: 36,
      cpdPoints: 18,
      difficulty: "Advanced",
      accreditedBy: "Sports Medicine India",
      price: "12500.00",
      rating: "4.9",
      reviews: 89,
      enrollmentCount: 234,
      learningOutcomes: ["Master manual techniques", "Understand tissue mechanics", "Develop clinical reasoning", "Apply evidence-based practice"],
      targetAudience: ["Physiotherapists", "Sports Therapists", "Manual Therapists"],
      prerequisites: ["Clinical experience required", "Basic manual therapy knowledge"],
      videoHours: "24 hours",
      resources: "60 downloadable resources",
      instructors: [{
        id: "1",
        name: "Dr. Sarah Smith",
        bio: "Expert manual therapist with 15 years experience",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        expertise: ["Manual Therapy", "Sports Medicine"]
      }],
      curriculum: [{
        module: 1,
        title: "Assessment Principles",
        description: "Comprehensive assessment techniques",
        lessons: [{
          id: "1",
          title: "Clinical Assessment",
          duration: "45 minutes",
          type: "video"
        }]
      }],
      tags: ["manual therapy", "advanced", "techniques", "clinical"],
      isPublished: true,
      createdAt: new Date("2024-10-15"),
      updatedAt: new Date("2025-07-05")
    },
    {
      title: "Sports Nutrition Certification Program",
      description: "Complete certification program in sports nutrition covering all aspects from basic nutrition to advanced performance strategies. Practical meal planning and supplementation protocols included.",
      thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
      category: "Sports Nutrition",
      duration: "16 weeks",
      modules: 12,
      lessons: 48,
      cpdPoints: 25,
      difficulty: "Beginner",
      accreditedBy: "ACSM",
      price: "15000.00",
      rating: "4.8",
      reviews: 278,
      enrollmentCount: 567,
      learningOutcomes: ["Master nutrition fundamentals", "Design nutrition plans", "Understand supplementation", "Apply sport-specific strategies"],
      targetAudience: ["Nutritionists", "Coaches", "Athletes", "Health Professionals"],
      prerequisites: ["Basic health science knowledge"],
      videoHours: "32 hours",
      resources: "80 downloadable resources",
      instructors: [{
        id: "2",
        name: "Dr. Priya Patel",
        bio: "Certified sports nutritionist",
        image: "https://images.unsplash.com/photo-1594824681814-2e9c1bfe8dae?w=150&h=150&fit=crop&crop=face",
        expertise: ["Sports Nutrition", "Performance Enhancement"]
      }],
      curriculum: [{
        module: 1,
        title: "Nutrition Basics",
        description: "Fundamental nutrition concepts",
        lessons: [{
          id: "1",
          title: "Macronutrients Overview",
          duration: "30 minutes",
          type: "video"
        }]
      }],
      tags: ["nutrition", "sports", "certification", "performance"],
      isPublished: true,
      createdAt: new Date("2024-09-01"),
      updatedAt: new Date("2025-07-12")
    }
  ];

  // Forum Categories
  const forumCategories: Omit<ForumCategory, 'id'>[] = [
    {
      name: "General Discussion",
      description: "General topics and announcements",
      icon: "MessageSquare",
      color: "#3B82F6",
      topics: 25,
      posts: 150,
      lastActivity: new Date("2025-07-20T08:30:00Z"),
      isActive: true,
      sortOrder: 1,
      createdAt: new Date("2024-01-01")
    },
    {
      name: "Clinical Cases",
      description: "Discuss challenging cases and treatments",
      icon: "FileText", 
      color: "#EF4444",
      topics: 18,
      posts: 89,
      lastActivity: new Date("2025-07-20T10:15:00Z"),
      isActive: true,
      sortOrder: 2,
      createdAt: new Date("2024-01-01")
    },
    {
      name: "Research & Evidence",
      description: "Latest research and evidence-based practice",
      icon: "FlaskConical",
      color: "#10B981",
      topics: 12,
      posts: 67,
      lastActivity: new Date("2025-07-20T07:45:00Z"),
      isActive: true,
      sortOrder: 3,
      createdAt: new Date("2024-01-01")
    },
    {
      name: "Career Development",
      description: "Career advice and professional growth",
      icon: "TrendingUp",
      color: "#F59E0B",
      topics: 31,
      posts: 234,
      lastActivity: new Date("2025-07-20T12:30:00Z"),
      isActive: true,
      sortOrder: 4,
      createdAt: new Date("2024-01-01")
    },
    {
      name: "Technology & Tools",
      description: "Technology applications in sports medicine",
      icon: "Laptop",
      color: "#8B5CF6",
      topics: 9,
      posts: 45,
      lastActivity: new Date("2025-07-19T14:20:00Z"),
      isActive: true,
      sortOrder: 5,
      createdAt: new Date("2024-01-01")
    },
    {
      name: "Student Corner",
      description: "Space for students and new professionals",
      icon: "GraduationCap",
      color: "#EC4899",
      topics: 22,
      posts: 112,
      lastActivity: new Date("2025-07-20T09:15:00Z"),
      isActive: true,
      sortOrder: 6,
      createdAt: new Date("2024-01-01")
    }
  ];

  // Professional Discussions
  const discussions: Omit<Discussion, 'id' | 'authorId' | 'categoryId'>[] = [
    {
      title: "Best practices for ACL injury prevention in female athletes",
      content: "Looking for evidence-based strategies for ACL injury prevention in female athletes. What protocols have you found most effective in your practice?",
      comments: 12,
      likes: 23,
      views: 156,
      tags: ["ACL", "prevention", "female athletes"],
      isPinned: true,
      isClosed: false,
      lastReplyAt: new Date("2025-07-20T10:30:00Z"),
      lastReplyBy: 4,
      createdAt: new Date("2025-07-18T14:20:00Z"),
      updatedAt: new Date("2025-07-20T10:30:00Z")
    },
    {
      title: "Career transition from clinical to sports setting",
      content: "Seeking advice on transitioning from clinical physiotherapy to sports medicine. What skills should I focus on developing? Any recommended courses or certifications?",
      comments: 8,
      likes: 15,
      views: 89,
      tags: ["career", "transition", "sports medicine"],
      isPinned: false,
      isClosed: false,
      lastReplyAt: new Date("2025-07-19T16:45:00Z"),
      lastReplyBy: 2,
      createdAt: new Date("2025-07-17T11:30:00Z"),
      updatedAt: new Date("2025-07-19T16:45:00Z")
    },
    {
      title: "Latest research on concussion management protocols",
      content: "Discussion on recent research findings in concussion assessment and return-to-play protocols. What are the latest evidence-based guidelines you're following?",
      comments: 15,
      likes: 31,
      views: 234,
      tags: ["concussion", "research", "return to play"],
      isPinned: false,
      isClosed: false,
      lastReplyAt: new Date("2025-07-20T08:15:00Z"),
      lastReplyBy: 1,
      createdAt: new Date("2025-07-16T09:00:00Z"),
      updatedAt: new Date("2025-07-20T08:15:00Z")
    },
    {
      title: "Cost-effective movement analysis technology for clinics",
      content: "What are your experiences with different movement analysis technologies? Looking for cost-effective solutions that provide reliable data for clinical use.",
      comments: 6,
      likes: 9,
      views: 67,
      tags: ["technology", "movement analysis", "clinic"],
      isPinned: false,
      isClosed: false,
      lastReplyAt: new Date("2025-07-20T11:00:00Z"),
      lastReplyBy: 4,
      createdAt: new Date("2025-07-15T13:45:00Z"),
      updatedAt: new Date("2025-07-20T11:00:00Z")
    }
  ];

  // Mentorship Opportunities
  const mentorshipOpportunities: Omit<MentorshipOpportunity, 'id' | 'userId'>[] = [
    {
      title: "Senior Sports Physiotherapist Mentor",
      description: "Mentoring junior physiotherapists in sports medicine and injury prevention. Offering guidance on clinical skills, career development, and evidence-based practice.",
      position: "Senior Physiotherapist",
      specialties: ["Sports Injury Prevention", "Manual Therapy", "Return to Sport"],
      availability: "Evenings and weekends",
      maxMentees: 5,
      currentMentees: 3,
      preferredExperience: "Entry to Mid-Level",
      meetingFormat: "Both",
      rating: "4.9",
      reviews: 23,
      isActive: true,
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-07-15")
    },
    {
      title: "Strength & Conditioning Expert Mentor",
      description: "Guidance for coaches looking to develop expertise in strength and conditioning. Focus on program design, periodization, and working with different athlete populations.",
      position: "Head Strength Coach",
      specialties: ["Performance Enhancement", "Program Design", "Athletic Development"],
      availability: "Flexible",
      maxMentees: 3,
      currentMentees: 1,
      preferredExperience: "Any Level",
      meetingFormat: "Virtual",
      rating: "4.8",
      reviews: 12,
      isActive: true,
      createdAt: new Date("2025-02-01"),
      updatedAt: new Date("2025-07-10")
    },
    {
      title: "Sports Nutrition Career Mentor",
      description: "Supporting nutritionists in building successful sports nutrition careers. Guidance on client management, business development, and continuing education.",
      position: "Senior Sports Nutritionist",
      specialties: ["Performance Nutrition", "Career Development", "Business Skills"],
      availability: "Weekdays",
      maxMentees: 4,
      currentMentees: 2,
      preferredExperience: "Entry Level",
      meetingFormat: "Virtual",
      rating: "4.7",
      reviews: 8,
      isActive: true,
      createdAt: new Date("2025-03-01"),
      updatedAt: new Date("2025-07-05")
    }
  ];

  // Sample CPD Activities
  const cpdActivities: Omit<CpdActivity, 'id' | 'userId' | 'categoryId'>[] = [
    {
      title: "Sports Medicine Conference 2024",
      description: "Attended international conference on latest developments in sports medicine",
      date: "2024-12-15",
      type: "Conference",
      category: "Education & Training",
      points: 8,
      hours: "6.0",
      source: "International Sports Medicine Association",
      certificateUrl: "https://example.com/certificate1",
      verificationStatus: "verified",
      verifiedBy: 1,
      verifiedAt: new Date("2024-12-20"),
      evidenceUrls: [],
      reflectionNotes: "Excellent conference with practical insights on injury prevention and new treatment modalities.",
      isPublic: true,
      createdAt: new Date("2024-12-15"),
      updatedAt: new Date("2024-12-20")
    },
    {
      title: "Strength Training Workshop",
      description: "Hands-on workshop on advanced strength training techniques for athletes",
      date: "2024-11-20",
      type: "Workshop",
      category: "Clinical Practice",
      points: 5,
      hours: "4.0",
      source: "Elite Performance Center",
      certificateUrl: "https://example.com/certificate2",
      verificationStatus: "verified",
      verifiedBy: 2,
      verifiedAt: new Date("2024-11-25"),
      evidenceUrls: [],
      reflectionNotes: "Great practical session that enhanced my coaching methodology.",
      isPublic: true,
      createdAt: new Date("2024-11-20"),
      updatedAt: new Date("2024-11-25")
    }
  ];

  return {
    users,
    events,
    courses,
    forumCategories,
    discussions,
    mentorshipOpportunities,
    cpdActivities
  };
}