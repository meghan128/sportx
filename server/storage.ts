import { 
  users,
  studentProfiles,
  professionalProfiles,
  resourcePersonProfiles,
  documentVerifications,
  type User,
  type InsertUser,
  type StudentProfile,
  type InsertStudentProfile,
  type ProfessionalProfile,
  type InsertProfessionalProfile,
  type ResourcePersonProfile,
  type InsertResourcePersonProfile,
  type DocumentVerification,
  type InsertDocumentVerification,
  type UserType,
  type StudentRegistration,
  type ProfessionalRegistration,
  type ResourcePersonRegistration,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User authentication operations
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Student operations
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  getStudentProfile(userId: number): Promise<StudentProfile | undefined>;
  updateStudentProfile(userId: number, updates: Partial<StudentProfile>): Promise<StudentProfile | undefined>;

  // Professional operations
  createProfessionalProfile(profile: InsertProfessionalProfile): Promise<ProfessionalProfile>;
  getProfessionalProfile(userId: number): Promise<ProfessionalProfile | undefined>;
  updateProfessionalProfile(userId: number, updates: Partial<ProfessionalProfile>): Promise<ProfessionalProfile | undefined>;

  // Resource person operations
  createResourcePersonProfile(profile: InsertResourcePersonProfile): Promise<ResourcePersonProfile>;
  getResourcePersonProfile(userId: number): Promise<ResourcePersonProfile | undefined>;
  updateResourcePersonProfile(userId: number, updates: Partial<ResourcePersonProfile>): Promise<ResourcePersonProfile | undefined>;

  // Document verification operations
  createDocumentVerification(verification: InsertDocumentVerification): Promise<DocumentVerification>;
  getDocumentVerifications(userId: number): Promise<DocumentVerification[]>;
  updateDocumentVerification(id: number, updates: Partial<DocumentVerification>): Promise<DocumentVerification | undefined>;

  // Registration methods
  registerStudent(registration: StudentRegistration): Promise<{ user: User; profile: StudentProfile }>;
  registerProfessional(registration: ProfessionalRegistration): Promise<{ user: User; profile: ProfessionalProfile }>;
  registerResourcePerson(registration: ResourcePersonRegistration): Promise<{ user: User; profile: ResourcePersonProfile }>;

  // Authentication methods
  authenticateUser(username: string, password: string): Promise<User | null>;
  verifyUserDocument(userId: number, documentType: string, extractedText: string, nameMatches: any[]): Promise<DocumentVerification>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Student profile operations
  async createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile> {
    const [studentProfile] = await db.insert(studentProfiles).values(profile).returning();
    return studentProfile;
  }

  async getStudentProfile(userId: number): Promise<StudentProfile | undefined> {
    const [profile] = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, userId));
    return profile;
  }

  async updateStudentProfile(userId: number, updates: Partial<StudentProfile>): Promise<StudentProfile | undefined> {
    const [profile] = await db
      .update(studentProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(studentProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Professional profile operations
  async createProfessionalProfile(profile: InsertProfessionalProfile): Promise<ProfessionalProfile> {
    const [professionalProfile] = await db.insert(professionalProfiles).values(profile).returning();
    return professionalProfile;
  }

  async getProfessionalProfile(userId: number): Promise<ProfessionalProfile | undefined> {
    const [profile] = await db
      .select()
      .from(professionalProfiles)
      .where(eq(professionalProfiles.userId, userId));
    return profile;
  }

  async updateProfessionalProfile(userId: number, updates: Partial<ProfessionalProfile>): Promise<ProfessionalProfile | undefined> {
    const [profile] = await db
      .update(professionalProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(professionalProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Resource person profile operations
  async createResourcePersonProfile(profile: InsertResourcePersonProfile): Promise<ResourcePersonProfile> {
    const [resourcePersonProfile] = await db.insert(resourcePersonProfiles).values(profile).returning();
    return resourcePersonProfile;
  }

  async getResourcePersonProfile(userId: number): Promise<ResourcePersonProfile | undefined> {
    const [profile] = await db
      .select()
      .from(resourcePersonProfiles)
      .where(eq(resourcePersonProfiles.userId, userId));
    return profile;
  }

  async updateResourcePersonProfile(userId: number, updates: Partial<ResourcePersonProfile>): Promise<ResourcePersonProfile | undefined> {
    const [profile] = await db
      .update(resourcePersonProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resourcePersonProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Document verification operations
  async createDocumentVerification(verification: InsertDocumentVerification): Promise<DocumentVerification> {
    const [documentVerification] = await db.insert(documentVerifications).values(verification).returning();
    return documentVerification;
  }

  async getDocumentVerifications(userId: number): Promise<DocumentVerification[]> {
    const verifications = await db
      .select()
      .from(documentVerifications)
      .where(eq(documentVerifications.userId, userId));
    return verifications;
  }

  async updateDocumentVerification(id: number, updates: Partial<DocumentVerification>): Promise<DocumentVerification | undefined> {
    const [verification] = await db
      .update(documentVerifications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documentVerifications.id, id))
      .returning();
    return verification;
  }

  // Registration methods
  async registerStudent(registration: StudentRegistration): Promise<{ user: User; profile: StudentProfile }> {
    const hashedPassword = await bcrypt.hash(registration.password, 10);

    const userData: InsertUser = {
      username: registration.username,
      email: registration.email,
      phone: registration.phone,
      name: registration.name,
      dateOfBirth: registration.dateOfBirth,
      alternativeNames: registration.alternativeNames,
      password: hashedPassword,
      userType: "student",
      authStatus: "pending",
      profession: registration.degreeProgram,
    };

    const user = await this.createUser(userData);

    const profileData: InsertStudentProfile = {
      userId: user.id,
      degreeProgram: registration.degreeProgram,
      currentYear: registration.currentYear,
      expectedGraduation: registration.expectedGraduation,
      university: registration.university,
      studentId: registration.studentId,
      marksheetUrl: registration.marksheet,
    };

    const profile = await this.createStudentProfile(profileData);

    // Create document verification entry
    await this.createDocumentVerification({
      userId: user.id,
      documentType: "marksheet",
      documentUrl: registration.marksheet,
      verificationStatus: "pending",
    });

    return { user, profile };
  }

  async registerProfessional(registration: ProfessionalRegistration): Promise<{ user: User; profile: ProfessionalProfile }> {
    const hashedPassword = await bcrypt.hash(registration.password, 10);

    const userData: InsertUser = {
      username: registration.username,
      email: registration.email,
      phone: registration.phone,
      name: registration.name,
      dateOfBirth: registration.dateOfBirth,
      alternativeNames: registration.alternativeNames,
      password: hashedPassword,
      userType: "professional",
      authStatus: "pending",
      profession: registration.profession,
      specialization: registration.specialization,
    };

    const user = await this.createUser(userData);

    const profileData: InsertProfessionalProfile = {
      userId: user.id,
      degreeType: registration.degreeType,
      degreeName: registration.degreeName,
      university: registration.university,
      graduationYear: registration.graduationYear,
      degreeUrl: registration.degree,
      licenseNumber: registration.licenseNumber,
      licenseExpiryDate: registration.licenseExpiryDate,
      affiliations: registration.affiliations?.map(aff => ({
        ...aff,
        status: "active"
      })) || [],
      yearsOfExperience: registration.yearsOfExperience,
      currentWorkplace: registration.currentWorkplace,
    };

    const profile = await this.createProfessionalProfile(profileData);

    // Create document verification entry
    await this.createDocumentVerification({
      userId: user.id,
      documentType: "degree",
      documentUrl: registration.degree,
      verificationStatus: "pending",
    });

    return { user, profile };
  }

  async registerResourcePerson(registration: ResourcePersonRegistration): Promise<{ user: User; profile: ResourcePersonProfile }> {
    const hashedPassword = await bcrypt.hash(registration.password, 10);

    const userData: InsertUser = {
      username: registration.username,
      email: registration.email,
      phone: registration.phone,
      name: registration.name,
      dateOfBirth: registration.dateOfBirth,
      alternativeNames: registration.alternativeNames,
      password: hashedPassword,
      userType: "resource_person",
      authStatus: "pending",
      profession: registration.profession,
      specialization: registration.specialization,
    };

    const user = await this.createUser(userData);

    const profileData: InsertResourcePersonProfile = {
      userId: user.id,
      degreeType: registration.degreeType,
      degreeName: registration.degreeName,
      university: registration.university,
      graduationYear: registration.graduationYear,
      degreeUrl: registration.degree,
      mandatoryAffiliations: registration.mandatoryAffiliations.map(aff => ({
        ...aff,
        status: "active",
        verificationStatus: "pending" as const,
      })),
      additionalCertifications: registration.additionalCertifications,
      yearsOfExperience: registration.yearsOfExperience,
      expertiseAreas: registration.expertiseAreas,
      publications: registration.publications,
    };

    const profile = await this.createResourcePersonProfile(profileData);

    // Create document verification entry for degree
    await this.createDocumentVerification({
      userId: user.id,
      documentType: "degree",
      documentUrl: registration.degree,
      verificationStatus: "pending",
    });

    // Create document verification entries for additional certifications
    for (const cert of registration.additionalCertifications) {
      await this.createDocumentVerification({
        userId: user.id,
        documentType: "certificate",
        documentUrl: cert.certificateUrl,
        verificationStatus: "pending",
      });
    }

    return { user, profile };
  }

  // Authentication methods
  async authenticateUser(usernameOrEmail: string, password: string): Promise<User | null> {
    let user = await this.getUserByUsername(usernameOrEmail);
    if (!user) {
      user = await this.getUserByEmail(usernameOrEmail);
    }
    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    return user;
  }

  async verifyUserDocument(
    userId: number,
    documentType: string,
    extractedText: string,
    nameMatches: any[]
  ): Promise<DocumentVerification> {
    // Get the user's document verification record
    const verifications = await this.getDocumentVerifications(userId);
    const docVerification = verifications.find(v => v.documentType === documentType);

    if (!docVerification) {
      throw new Error("Document verification record not found");
    }

    // Update with OCR results and name matching
    const allNamesMatch = nameMatches.every(match => match.matched);
    const avgConfidence = nameMatches.length > 0 
      ? nameMatches.reduce((sum, match) => sum + match.confidence, 0) / nameMatches.length 
      : 0;

    const verificationStatus = allNamesMatch && avgConfidence > 0.7 ? "approved" : "under_review";

    const updatedVerification = await this.updateDocumentVerification(docVerification.id, {
      ocrExtractedText: extractedText,
      ocrConfidence: avgConfidence.toString(),
      nameMatches,
      verificationStatus,
      verificationDate: new Date(),
    });

    // Update user's auth status if document is verified
    if (verificationStatus === "approved") {
      // Check if all required documents are verified
      const allVerifications = await this.getDocumentVerifications(userId);
      const allVerified = allVerifications.every(v => v.verificationStatus === "approved");

      if (allVerified) {
        await this.updateUser(userId, { authStatus: "approved" });
      }
    }

    return updatedVerification!;
  }
}

export const storage = new DatabaseStorage();