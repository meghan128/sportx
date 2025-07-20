import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  users,
  events,
  ticketTypes,
  eventRegistrations,
  courses,
  courseEnrollments,
  cpdCategories,
  cpdActivities,
  forumCategories,
  discussions,
  discussionReplies,
  mentorshipOpportunities,
  mentorshipConnections,
  credentials,
  messages,
  notifications,
} from '@shared/schema';

// Database connection
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

// Sports and health professions for realistic data
const professions = [
  'Physiotherapist',
  'Sports Therapist',
  'Exercise Physiologist',
  'Sports Nutritionist',
  'Athletic Trainer',
  'Sports Psychologist',
  'Biomechanist',
  'Strength & Conditioning Coach',
  'Sports Medicine Physician',
  'Occupational Therapist',
  'Kinesiologist',
  'Rehabilitation Specialist'
];

const specializations = [
  'Orthopedic Rehabilitation',
  'Sports Injury Prevention',
  'Performance Enhancement',
  'Pediatric Sports Medicine',
  'Geriatric Exercise',
  'Cardiac Rehabilitation',
  'Neurological Rehabilitation',
  'Manual Therapy',
  'Exercise Prescription',
  'Return to Sport',
  'Movement Analysis',
  'Pain Management'
];

const organizations = [
  'SportsMed Clinic',
  'Elite Performance Center',
  'Regional Hospital Sports Department',
  'University Sports Medicine',
  'Professional Sports Team',
  'Rehabilitation Institute',
  'Fitness First Medical',
  'Athletic Performance Lab',
  'Sports Health Network',
  'Premier Physiotherapy'
];

const eventCategories = [
  'Sports Medicine',
  'Exercise Physiology',
  'Nutrition',
  'Biomechanics',
  'Psychology',
  'Rehabilitation',
  'Performance Enhancement',
  'Injury Prevention',
  'Technology in Sports',
  'Leadership & Management'
];

const courseCategories = [
  'Clinical Skills',
  'Exercise Science',
  'Sports Nutrition',
  'Injury Management',
  'Research Methods',
  'Technology Applications',
  'Professional Development',
  'Specialized Techniques',
  'Evidence-Based Practice',
  'Communication Skills'
];

const cpdCategoryData = [
  { name: 'Clinical Practice', description: 'Direct patient care and clinical skills', requiredPoints: 15, color: '#EF4444', icon: 'Stethoscope' },
  { name: 'Education & Training', description: 'Formal education and training programs', requiredPoints: 10, color: '#3B82F6', icon: 'GraduationCap' },
  { name: 'Research & Development', description: 'Research activities and evidence-based practice', requiredPoints: 8, color: '#10B981', icon: 'FlaskConical' },
  { name: 'Professional Activities', description: 'Professional service and leadership', requiredPoints: 7, color: '#F59E0B', icon: 'Users' },
  { name: 'Self-Directed Learning', description: 'Independent learning and reflection', requiredPoints: 10, color: '#8B5CF6', icon: 'Book' }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (optional - comment out in production)
    console.log('🧹 Clearing existing data...');
    await db.delete(notifications);
    await db.delete(messages);
    await db.delete(credentials);
    await db.delete(mentorshipConnections);
    await db.delete(mentorshipOpportunities);
    await db.delete(discussionReplies);
    await db.delete(discussions);
    await db.delete(forumCategories);
    await db.delete(cpdActivities);
    await db.delete(cpdCategories);
    await db.delete(courseEnrollments);
    await db.delete(courses);
    await db.delete(eventRegistrations);
    await db.delete(ticketTypes);
    await db.delete(events);
    await db.delete(users);

    // 1. Create CPD Categories
    console.log('📚 Creating CPD categories...');
    const insertedCpdCategories = await db.insert(cpdCategories).values(cpdCategoryData).returning();

    // 2. Create Users
    console.log('👥 Creating users...');
    const usersData = Array.from({ length: 50 }).map(() => ({
      username: faker.internet.userName(),
      password: '$2b$10$YourHashedPasswordHere', // In real app, this would be properly hashed
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['user', 'resource_person']),
      profession: faker.helpers.arrayElement(professions),
      specialization: faker.helpers.arrayElement(specializations),
      bio: faker.lorem.paragraph(3),
      organization: faker.helpers.arrayElement(organizations),
      location: `${faker.location.city()}, ${faker.location.state()}`,
      profileImage: faker.image.avatar(),
      contactInfo: {
        phone: faker.phone.number(),
        website: faker.internet.url(),
        linkedin: `https://linkedin.com/in/${faker.internet.userName()}`
      },
      socialLinks: {
        twitter: `https://twitter.com/${faker.internet.userName()}`,
        linkedin: `https://linkedin.com/in/${faker.internet.userName()}`,
        website: faker.internet.url()
      },
      privacySettings: {
        profilePublic: faker.datatype.boolean(),
        showEmail: faker.datatype.boolean(),
        showPhone: faker.datatype.boolean(),
        allowMessages: true,
        allowMentorship: faker.datatype.boolean(),
        showCourses: true,
        showEvents: true,
        showCpd: faker.datatype.boolean()
      },
      isOnline: faker.datatype.boolean(),
      lastSeen: faker.date.recent(),
    }));

    const insertedUsers = await db.insert(users).values(usersData).returning();

    // 3. Create Forum Categories
    console.log('💬 Creating forum categories...');
    const forumCategoriesData = [
      { name: 'General Discussion', description: 'General topics and announcements', icon: 'MessageSquare', color: '#3B82F6' },
      { name: 'Clinical Cases', description: 'Discuss challenging cases and treatments', icon: 'FileText', color: '#EF4444' },
      { name: 'Research & Evidence', description: 'Latest research and evidence-based practice', icon: 'FlaskConical', color: '#10B981' },
      { name: 'Career Development', description: 'Career advice and professional growth', icon: 'TrendingUp', color: '#F59E0B' },
      { name: 'Technology & Tools', description: 'Technology applications in sports medicine', icon: 'Laptop', color: '#8B5CF6' },
      { name: 'Student Corner', description: 'Space for students and new professionals', icon: 'GraduationCap', color: '#EC4899' }
    ].map(cat => ({
      ...cat,
      topics: faker.number.int({ min: 5, max: 50 }),
      posts: faker.number.int({ min: 20, max: 200 }),
      lastActivity: faker.date.recent(),
      sortOrder: faker.number.int({ min: 1, max: 6 })
    }));

    const insertedForumCategories = await db.insert(forumCategories).values(forumCategoriesData).returning();

    // 4. Create Events
    console.log('🎫 Creating events...');
    const eventsData = Array.from({ length: 30 }).map(() => {
      const startDate = faker.date.future();
      const endDate = new Date(startDate.getTime() + faker.number.int({ min: 2, max: 8 }) * 60 * 60 * 1000);
      
      return {
        title: `${faker.company.buzzNoun()} in ${faker.helpers.arrayElement(eventCategories)}`,
        description: faker.lorem.paragraphs(2),
        date: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        type: faker.helpers.arrayElement(['In-person', 'Virtual', 'Hybrid']),
        category: faker.helpers.arrayElement(eventCategories),
        location: faker.helpers.arrayElement(['Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Online', 'Pune, India']),
        image: `https://images.unsplash.com/photo-${faker.number.int({ min: 1500000000000, max: 1700000000000 })}?w=400&h=300&fit=crop`,
        price: faker.number.float({ min: 0, max: 5000, fractionDigits: 2 }),
        cpdPoints: faker.number.int({ min: 1, max: 8 }),
        maxAttendees: faker.number.int({ min: 20, max: 200 }),
        currentAttendees: faker.number.int({ min: 0, max: 150 }),
        accreditationBody: faker.helpers.arrayElement(['ACSM', 'NSCA', 'BASES', 'Sports Medicine India', 'IAPSM']),
        status: faker.helpers.arrayElement(['upcoming', 'ongoing', 'completed']),
        learningOutcomes: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => faker.lorem.sentence()),
        speakers: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          bio: faker.lorem.paragraph(),
          image: faker.image.avatar(),
          expertise: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => faker.helpers.arrayElement(specializations))
        })),
        schedule: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
          time: faker.date.recent().toTimeString().slice(0, 5),
          activity: faker.lorem.sentence(),
          speaker: faker.person.fullName(),
          duration: `${faker.number.int({ min: 30, max: 120 })} minutes`
        })),
        tags: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => faker.lorem.word())
      };
    });

    const insertedEvents = await db.insert(events).values(eventsData).returning();

    // 5. Create Ticket Types for Events
    console.log('🎟️ Creating ticket types...');
    const ticketTypesData = insertedEvents.flatMap(event => 
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        eventId: event.id,
        name: faker.helpers.arrayElement(['Early Bird', 'Regular', 'VIP', 'Student', 'Member']),
        description: faker.lorem.sentence(),
        price: faker.number.float({ min: 0, max: Number(event.price) || 1000, fractionDigits: 2 }),
        maxQuantity: faker.number.int({ min: 10, max: 50 }),
        availableQuantity: faker.number.int({ min: 5, max: 45 }),
        availableUntil: faker.date.future()
      }))
    );

    const insertedTicketTypes = await db.insert(ticketTypes).values(ticketTypesData).returning();

    // 6. Create Courses
    console.log('📖 Creating courses...');
    const coursesData = Array.from({ length: 25 }).map(() => ({
      title: `${faker.helpers.arrayElement(['Advanced', 'Introduction to', 'Mastering', 'Fundamentals of', 'Clinical'])} ${faker.helpers.arrayElement(courseCategories)}`,
      description: faker.lorem.paragraphs(3),
      thumbnail: `https://images.unsplash.com/photo-${faker.number.int({ min: 1500000000000, max: 1700000000000 })}?w=400&h=300&fit=crop`,
      category: faker.helpers.arrayElement(courseCategories),
      duration: `${faker.number.int({ min: 2, max: 12 })} weeks`,
      modules: faker.number.int({ min: 4, max: 12 }),
      lessons: faker.number.int({ min: 15, max: 60 }),
      cpdPoints: faker.number.int({ min: 5, max: 20 }),
      difficulty: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced']),
      accreditedBy: faker.helpers.arrayElement(['ACSM', 'NSCA', 'BASES', 'Sports Medicine India', 'IAPSM']),
      price: faker.number.float({ min: 0, max: 15000, fractionDigits: 2 }),
      rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
      reviews: faker.number.int({ min: 10, max: 500 }),
      enrollmentCount: faker.number.int({ min: 50, max: 2000 }),
      learningOutcomes: Array.from({ length: faker.number.int({ min: 4, max: 8 }) }, () => faker.lorem.sentence()),
      targetAudience: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => faker.helpers.arrayElement(professions)),
      prerequisites: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => faker.lorem.sentence()),
      videoHours: `${faker.number.int({ min: 5, max: 40 })} hours`,
      resources: `${faker.number.int({ min: 10, max: 100 })} downloadable resources`,
      instructors: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        image: faker.image.avatar(),
        expertise: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => faker.helpers.arrayElement(specializations))
      })),
      curriculum: Array.from({ length: faker.number.int({ min: 4, max: 8 }) }, (_, index) => ({
        module: index + 1,
        title: `Module ${index + 1}: ${faker.lorem.words(3)}`,
        description: faker.lorem.paragraph(),
        lessons: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          duration: `${faker.number.int({ min: 10, max: 60 })} minutes`,
          type: faker.helpers.arrayElement(['video', 'reading', 'quiz', 'assignment'])
        }))
      })),
      tags: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => faker.lorem.word()),
      isPublished: faker.datatype.boolean()
    }));

    const insertedCourses = await db.insert(courses).values(coursesData).returning();

    // 7. Create CPD Activities
    console.log('📊 Creating CPD activities...');
    const cpdActivitiesData = insertedUsers.flatMap(user => 
      Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => {
        const category = faker.helpers.arrayElement(insertedCpdCategories);
        return {
          userId: user.id,
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          date: faker.date.past().toISOString().split('T')[0],
          type: faker.helpers.arrayElement(['Event', 'Course', 'Workshop', 'Conference', 'Webinar', 'Publication', 'Research', 'Other']),
          category: category.name,
          categoryId: category.id,
          points: faker.number.int({ min: 1, max: 8 }),
          hours: faker.number.float({ min: 0.5, max: 8.0, fractionDigits: 1 }),
          source: faker.company.name(),
          certificateUrl: faker.datatype.boolean() ? faker.internet.url() : null,
          verificationStatus: faker.helpers.arrayElement(['pending', 'verified', 'rejected']),
          verifiedBy: faker.datatype.boolean() ? faker.helpers.arrayElement(insertedUsers).id : null,
          verifiedAt: faker.datatype.boolean() ? faker.date.past() : null,
          evidenceUrls: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => faker.internet.url()),
          reflectionNotes: faker.lorem.paragraph(),
          isPublic: faker.datatype.boolean()
        };
      })
    );

    await db.insert(cpdActivities).values(cpdActivitiesData);

    // 8. Create Discussions
    console.log('💭 Creating discussions...');
    const discussionsData = Array.from({ length: 80 }).map(() => ({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      authorId: faker.helpers.arrayElement(insertedUsers).id,
      categoryId: faker.helpers.arrayElement(insertedForumCategories).id,
      comments: faker.number.int({ min: 0, max: 25 }),
      likes: faker.number.int({ min: 0, max: 50 }),
      views: faker.number.int({ min: 1, max: 200 }),
      tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.lorem.word()),
      isPinned: faker.datatype.boolean({ probability: 0.1 }),
      isClosed: faker.datatype.boolean({ probability: 0.05 }),
      lastReplyAt: faker.date.recent(),
      lastReplyBy: faker.helpers.arrayElement(insertedUsers).id
    }));

    const insertedDiscussions = await db.insert(discussions).values(discussionsData).returning();

    // 9. Create Mentorship Opportunities
    console.log('🤝 Creating mentorship opportunities...');
    const mentorshipData = Array.from({ length: 15 }).map(() => ({
      userId: faker.helpers.arrayElement(insertedUsers.filter(u => u.role === 'resource_person')).id,
      title: `${faker.helpers.arrayElement(['Senior', 'Expert', 'Lead', 'Principal'])} ${faker.helpers.arrayElement(professions)} Mentor`,
      description: faker.lorem.paragraph(2),
      position: faker.person.jobTitle(),
      specialties: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => faker.helpers.arrayElement(specializations)),
      availability: faker.helpers.arrayElement(['Weekdays', 'Evenings', 'Weekends', 'Flexible']),
      maxMentees: faker.number.int({ min: 2, max: 10 }),
      currentMentees: faker.number.int({ min: 0, max: 8 }),
      preferredExperience: faker.helpers.arrayElement(['Entry Level', 'Mid-Career', 'Senior Level', 'Any Level']),
      meetingFormat: faker.helpers.arrayElement(['Virtual', 'In-person', 'Both']),
      rating: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }),
      reviews: faker.number.int({ min: 5, max: 50 }),
      isActive: faker.datatype.boolean({ probability: 0.8 })
    }));

    const insertedMentorships = await db.insert(mentorshipOpportunities).values(mentorshipData).returning();

    // 10. Create Credentials
    console.log('🏆 Creating credentials...');
    const credentialsData = insertedUsers.flatMap(user => 
      Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, () => ({
        userId: user.id,
        type: faker.helpers.arrayElement(['certification', 'license', 'degree', 'course', 'award']),
        name: faker.lorem.words(3),
        organization: faker.helpers.arrayElement(organizations),
        issueDate: faker.date.past().toISOString().split('T')[0],
        expiryDate: faker.datatype.boolean() ? faker.date.future().toISOString().split('T')[0] : null,
        credentialId: faker.string.alphanumeric(10),
        credentialUrl: faker.internet.url(),
        verificationUrl: faker.internet.url(),
        status: faker.helpers.arrayElement(['active', 'expired', 'pending']),
        isPublic: faker.datatype.boolean(),
        attachments: Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () => faker.internet.url()),
        verifiedBy: faker.company.name(),
        verifiedAt: faker.date.past()
      }))
    );

    await db.insert(credentials).values(credentialsData);

    console.log('✅ Database seeding completed successfully!');
    console.log(`Created:
    - ${insertedUsers.length} users
    - ${insertedEvents.length} events
    - ${insertedTicketTypes.length} ticket types
    - ${insertedCourses.length} courses
    - ${cpdActivitiesData.length} CPD activities
    - ${insertedDiscussions.length} discussions
    - ${insertedMentorships.length} mentorship opportunities
    - ${credentialsData.length} credentials
    - ${insertedForumCategories.length} forum categories
    - ${insertedCpdCategories.length} CPD categories`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };