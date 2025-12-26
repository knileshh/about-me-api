"use client";

import { ProfileData } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface CareerStepProps {
    data: ProfileData;
    onUpdate: (updates: Partial<ProfileData>) => void;
}

const STATUS_OPTIONS = [
    { value: "student", label: "Student" },
    { value: "postgraduate_student", label: "Postgraduate Student" },
    { value: "employed", label: "Employed" },
    { value: "freelancer", label: "Freelancer" },
    { value: "looking", label: "Looking for Work" },
    { value: "other", label: "Other" },
];

const ROLE_SUGGESTIONS = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Mobile Developer",
    "UI/UX Designer",
    "Product Manager",
    "Technical Writer",
];

export function CareerStep({ data, onUpdate }: CareerStepProps) {
    const career = data.career || {};
    const jobPrefs = data.job_preferences || {};
    const [roleInput, setRoleInput] = useState("");
    const [techInput, setTechInput] = useState("");

    const updateCareer = (updates: Partial<typeof career>) => {
        onUpdate({
            career: { ...career, ...updates },
        });
    };

    const updateJobPrefs = (updates: Partial<typeof jobPrefs>) => {
        onUpdate({
            job_preferences: { ...jobPrefs, ...updates },
        });
    };

    const addRole = () => {
        if (roleInput.trim()) {
            const currentRoles = career.primary_roles || [];
            if (!currentRoles.includes(roleInput.trim())) {
                updateCareer({
                    primary_roles: [...currentRoles, roleInput.trim()],
                });
            }
            setRoleInput("");
        }
    };

    const removeRole = (role: string) => {
        updateCareer({
            primary_roles: (career.primary_roles || []).filter((r) => r !== role),
        });
    };

    const addTech = () => {
        if (techInput.trim()) {
            const currentTech = jobPrefs.tech_focus || [];
            if (!currentTech.includes(techInput.trim())) {
                updateJobPrefs({
                    tech_focus: [...currentTech, techInput.trim()],
                });
            }
            setTechInput("");
        }
    };

    const removeTech = (tech: string) => {
        updateJobPrefs({
            tech_focus: (jobPrefs.tech_focus || []).filter((t) => t !== tech),
        });
    };

    return (
        <div className="space-y-8">
            {/* Current Status */}
            <div className="space-y-3">
                <Label>Current Status</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {STATUS_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => updateCareer({ current_status: option.value as typeof career.current_status })}
                            className={`px-3 py-2 text-sm rounded-md border transition-colors ${career.current_status === option.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted border-input"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Primary Roles */}
            <div className="space-y-3">
                <Label>Primary Roles</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Add a role..."
                        value={roleInput}
                        onChange={(e) => setRoleInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRole())}
                        list="role-suggestions"
                    />
                    <button
                        type="button"
                        onClick={addRole}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Add
                    </button>
                </div>
                <datalist id="role-suggestions">
                    {ROLE_SUGGESTIONS.map((role) => (
                        <option key={role} value={role} />
                    ))}
                </datalist>
                {(career.primary_roles?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {career.primary_roles?.map((role) => (
                            <Badge key={role} variant="secondary" className="cursor-pointer" onClick={() => removeRole(role)}>
                                {role} ×
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Tech Focus */}
            <div className="space-y-3">
                <Label>Tech Focus / Skills</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Add a technology..."
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                    />
                    <button
                        type="button"
                        onClick={addTech}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Add
                    </button>
                </div>
                {(jobPrefs.tech_focus?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {jobPrefs.tech_focus?.map((tech) => (
                            <Badge key={tech} variant="outline" className="cursor-pointer" onClick={() => removeTech(tech)}>
                                {tech} ×
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Open to Work */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="openToWork"
                    checked={jobPrefs.open_to_work || false}
                    onCheckedChange={(checked) =>
                        updateJobPrefs({ open_to_work: checked as boolean })
                    }
                />
                <Label htmlFor="openToWork" className="cursor-pointer">
                    I'm open to work opportunities
                </Label>
            </div>

            {/* Currently Studying */}
            <div className="space-y-2">
                <Label htmlFor="studying">Currently Studying</Label>
                <Input
                    id="studying"
                    placeholder="MSc Computer Science, PhD in AI, etc."
                    value={career.currently_studying || ""}
                    onChange={(e) => updateCareer({ currently_studying: e.target.value })}
                />
            </div>
        </div>
    );
}
