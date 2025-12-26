"use client";

import { useState, useEffect } from "react";
import { ProfileData, WizardStep } from "@/types/profile";
import { IdentityStep } from "@/components/profile/identity-step";
import { PresenceStep } from "@/components/profile/presence-step";
import { CareerStep } from "@/components/profile/career-step";
import { PreviewStep } from "@/components/profile/preview-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const STEPS: { id: WizardStep; title: string; description: string }[] = [
    { id: "identity", title: "Identity", description: "Your basic information" },
    { id: "presence", title: "Presence", description: "Social links & online profiles" },
    { id: "career", title: "Career", description: "Professional details" },
    { id: "preview", title: "Preview", description: "Review & save your profile" },
];

const STORAGE_KEY = "aboutme_draft_profile";

interface ProfileWizardProps {
    existingUsername?: string | null;
}

export function ProfileWizard({ existingUsername }: ProfileWizardProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [profileData, setProfileData] = useState<ProfileData>({});
    const [username, setUsername] = useState(existingUsername || "");
    const [isLoaded, setIsLoaded] = useState(false);

    // Load draft from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setProfileData(parsed.profileData || {});
                // Only load saved username if there's no existing one
                if (!existingUsername) {
                    setUsername(parsed.username || "");
                }
                setCurrentStepIndex(parsed.stepIndex || 0);
            } catch (e) {
                console.error("Failed to load draft:", e);
            }
        }
        setIsLoaded(true);
    }, [existingUsername]);

    // Save draft to localStorage on changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    profileData,
                    username,
                    stepIndex: currentStepIndex,
                })
            );
        }
    }, [profileData, username, currentStepIndex, isLoaded]);

    const currentStep = STEPS[currentStepIndex];
    const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

    const handleNext = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    const updateProfileData = (updates: Partial<ProfileData>) => {
        setProfileData((prev) => ({ ...prev, ...updates }));
    };

    const renderStep = () => {
        switch (currentStep.id) {
            case "identity":
                return (
                    <IdentityStep
                        data={profileData}
                        onUpdate={updateProfileData}
                    />
                );
            case "presence":
                return (
                    <PresenceStep
                        data={profileData}
                        onUpdate={updateProfileData}
                    />
                );
            case "career":
                return (
                    <CareerStep
                        data={profileData}
                        onUpdate={updateProfileData}
                    />
                );
            case "preview":
                return (
                    <PreviewStep
                        data={profileData}
                        username={username}
                        onUsernameChange={setUsername}
                        isUsernameLocked={!!existingUsername}
                    />
                );
            default:
                return null;
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    {STEPS.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStepIndex(index)}
                            className={`text-xs font-medium transition-colors ${index === currentStepIndex
                                    ? "text-primary"
                                    : index < currentStepIndex
                                        ? "text-green-600"
                                        : "text-muted-foreground"
                                }`}
                        >
                            {step.title}
                        </button>
                    ))}
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Step Content */}
            <Card>
                <CardHeader>
                    <CardTitle>{currentStep.title}</CardTitle>
                    <CardDescription>{currentStep.description}</CardDescription>
                </CardHeader>
                <CardContent>{renderStep()}</CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStepIndex === 0}
                >
                    Back
                </Button>
                {currentStepIndex < STEPS.length - 1 ? (
                    <Button onClick={handleNext}>Continue</Button>
                ) : (
                    <Button
                        onClick={() => {
                            // This will be handled by the PreviewStep component
                            // which has the save/signup logic
                        }}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        Save Profile
                    </Button>
                )}
            </div>
        </div>
    );
}
