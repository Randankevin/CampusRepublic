import { ChevronRight } from "lucide-react";

interface OnboardingScreenProps {
  title: string;
  description: string;
  image: string;
  isLast?: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingScreen({
  title,
  description,
  image,
  isLast,
  onNext,
  onSkip,
}: OnboardingScreenProps) {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Skip Button */}
      {!isLast && (
        <div className="flex justify-end p-4">
          <button
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>
        </div>
      )}

      {/* Image */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <img
            src={image}
            alt={title}
            className="w-full h-64 object-cover rounded-3xl shadow-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {/* Navigation */}
        <button
          onClick={onNext}
          className="w-full bg-primary text-primary-foreground rounded-xl py-4 flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <span className="font-medium">{isLast ? "Get Started" : "Next"}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
