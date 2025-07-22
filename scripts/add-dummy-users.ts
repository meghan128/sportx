import { db } from "../server/db";
import { users, studentProfiles, professionalProfiles, resourcePersonProfiles } from "@shared/schema";
import bcrypt from "bcryptjs";

async function addDummyUsers() {
  try {
    console.log("Adding dummy users...");
    
    const hashedPassword = await bcrypt.hash("demo123", 10);
    
    // Add student user
    const [student] = await db.insert(users).values({
      username: "student1",
      email: "student1@demo.com", 
      password: hashedPassword,
      name: "John Smith",
      userType: "student",
      authStatus: "approved"
    }).returning();

    await db.insert(studentProfiles).values({
      userId: student.id,
      institution: "Demo University",
      fieldOfStudy: "Sports Science", 
      currentYear: 2,
      alternativeNames: ["Johnny Smith"]
    });

    // Add professional user
    const [professional] = await db.insert(users).values({
      username: "prof1",
      email: "prof1@demo.com",
      password: hashedPassword, 
      name: "Dr. Sarah Johnson",
      userType: "professional",
      authStatus: "approved"
    }).returning();

    await db.insert(professionalProfiles).values({
      userId: professional.id,
      profession: "Physiotherapist",
      specialization: "Sports Medicine",
      yearsOfExperience: 8,
      currentEmployer: "SportsMed Clinic",
      licenseNumber: "PHY12345"
    });

    // Add resource person
    const [resourcePerson] = await db.insert(users).values({
      username: "resource1", 
      email: "resource1@demo.com",
      password: hashedPassword,
      name: "Prof. Michael Chen",
      userType: "resource_person",
      authStatus: "approved"
    }).returning();

    await db.insert(resourcePersonProfiles).values({
      userId: resourcePerson.id,
      profession: "Sports Psychologist",
      specialization: "Performance Psychology", 
      yearsOfExperience: 15,
      currentEmployer: "Elite Sports Institute",
      licenseNumber: "PSY67890",
      qualifications: ["PhD Sports Psychology", "MSc Applied Psychology"],
      professionalAffiliations: [
        {
          organizationName: "Sports Psychology Association",
          membershipNumber: "SPA2024001", 
          membershipType: "Full Member",
          expiryDate: "2025-12-31"
        }
      ]
    });

    console.log("✅ Dummy users added successfully!");
    
  } catch (error) {
    console.error("Error adding dummy users:", error);
  }
}

addDummyUsers();