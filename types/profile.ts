// Profile data types based on shema-demo.json

export interface ProfileName {
    first: string;
    middle?: string | null;
    last: string;
}

export interface ProfileIdentity {
    name: ProfileName;
    date_of_birth?: string | null;
    bio?: string;
    pronouns?: string;
}

export interface ProfileLocation {
    hometown?: string;
    current_city?: string;
    timezone?: string;
}

export interface ProfileContact {
    visibility: 'public' | 'private' | 'api_key_only';
    emails?: {
        personal?: string;
        work?: string;
    };
    phones?: {
        personal?: string;
        work?: string;
    };
}

export interface ProfileSocials {
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    youtube?: string | null;
    other?: string[];
}

export interface ProfileCompetitiveProgramming {
    leetcode?: string | null;
    codeforces?: string | null;
    codechef?: string | null;
    codolio?: string | null;
}

export interface ProfileLaunchPlatforms {
    producthunt?: string | null;
    peerlist?: string | null;
    indiehackers?: string | null;
}

export interface ProfilePresence {
    socials?: ProfileSocials;
    competitive_programming?: ProfileCompetitiveProgramming;
    launch_platforms?: ProfileLaunchPlatforms;
}

export interface ProfileCareer {
    current_status?: 'student' | 'postgraduate_student' | 'employed' | 'freelancer' | 'looking' | 'other';
    currently_studying?: string;
    primary_roles?: string[];
    secondary_roles?: string[];
    targets?: string[];
}

export interface ProfileJobPreferences {
    open_to_work?: boolean;
    preferred_roles?: string[];
    employment_types?: string[];
    locations?: string[];
    tech_focus?: string[];
}

export interface ProfileImageVersion {
    url?: string;
    path?: string;
    uploaded_at?: string;
    notes?: string;
}

export interface ProfileImage {
    current: string;
    versions: Record<string, ProfileImageVersion>;
}

export interface ProfileAssets {
    profile_images?: Record<string, ProfileImage>;
}

export interface ProfileResume {
    title: string;
    url: string;
}

export interface ProfileProject {
    id: string;
    name: string;
    description?: string;
    tech_stack?: string[];
    role?: string;
    status?: 'active' | 'completed' | 'archived';
    links?: {
        github?: string;
        live?: string;
        producthunt?: string;
    };
}

export interface ProfileArtifacts {
    resumes?: Record<string, ProfileResume>;
    projects?: ProfileProject[];
}

export interface ProfileExperience {
    company: string;
    role: string;
    start_date: string;
    end_date?: string;
    description?: string[];
    tech_stack?: string[];
}

export interface ProfileMeta {
    schema_version: string;
    sources?: Record<string, boolean>;
    verified_fields?: string[];
    last_updated?: string;
}

// Main profile data structure (stored in profile_data JSONB column)
export interface ProfileData {
    identity?: ProfileIdentity;
    location?: ProfileLocation;
    contact?: ProfileContact;
    presence?: ProfilePresence;
    career?: ProfileCareer;
    job_preferences?: ProfileJobPreferences;
    assets?: ProfileAssets;
    artifacts?: ProfileArtifacts;
    experience?: ProfileExperience[];
    meta?: ProfileMeta;
}

// Database row types
export interface Profile {
    id: string;
    user_id: string;
    username: string;
    profile_data: ProfileData;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface ApiLog {
    id: string;
    profile_id: string;
    username: string;
    endpoint: string;
    caller_ip?: string;
    user_agent?: string;
    referer?: string;
    created_at: string;
}

export interface DraftProfile {
    id: string;
    session_id: string;
    profile_data: ProfileData;
    created_at: string;
    expires_at: string;
}

// Wizard step type
export type WizardStep = 'identity' | 'presence' | 'career' | 'assets' | 'preview';

export interface WizardState {
    currentStep: WizardStep;
    profileData: ProfileData;
    username: string;
}
