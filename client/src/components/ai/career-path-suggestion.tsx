import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Award, 
  BookOpen,
  Users,
  Clock,
  Star,
  Zap,
  Trophy,
  Rocket,
  Brain
} from "lucide-react";
import { User } from "@/lib/types";
import { useConfetti, ConfettiCanvas } from "./confetti-system";

interface CareerPathSuggestion {
  id: string;
  title: string;
  description: string;
  currentRelevance: number;
  potentialImpact: number;
  timeToComplete: string;
  requiredCpdPoints: number;
  suggestedCourses: string[];
  nextSteps: string[];
  aiConfidence: number;
  category: 'advancement' | 'specialization' | 'leadership' | 'research';
}

const CareerPathSuggestion = () => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<CareerPathSuggestion | null>(null);
  const { fire } = useConfetti();
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });

  // Mock AI-generated career suggestions based on user profile
  const careerSuggestions: CareerPathSuggestion[] = [
    {
      id: '1',
      title: 'Sports Psychology Specialization',
      description: 'Enhance your physiotherapy practice with psychological expertise to better support athlete mental health.',
      currentRelevance: 85,
      potentialImpact: 92,
      timeToComplete: '6-8 months',
      requiredCpdPoints: 24,
      suggestedCourses: ['Sports Psychology Fundamentals', 'Mental Health in Athletics', 'Cognitive Behavioral Techniques'],
      nextSteps: ['Enroll in Sports Psychology course', 'Attend mental health workshop', 'Shadow a sports psychologist'],
      aiConfidence: 94,
      category: 'specialization'
    },
    {
      id: '2',
      title: 'Team Leadership Development',
      description: 'Develop leadership skills to advance to senior physiotherapy roles and manage clinical teams.',
      currentRelevance: 78,
      potentialImpact: 88,
      timeToComplete: '4-6 months',
      requiredCpdPoints: 18,
      suggestedCourses: ['Healthcare Leadership', 'Team Management', 'Clinical Supervision'],
      nextSteps: ['Complete leadership assessment', 'Join leadership mentorship program', 'Practice presentation skills'],
      aiConfidence: 87,
      category: 'leadership'
    },
    {
      id: '3',
      title: 'Advanced Manual Therapy',
      description: 'Master cutting-edge manual therapy techniques to become a specialist in musculoskeletal treatment.',
      currentRelevance: 90,
      potentialImpact: 85,
      timeToComplete: '8-12 months',
      requiredCpdPoints: 36,
      suggestedCourses: ['Advanced Spinal Manipulation', 'Dry Needling Certification', 'Myofascial Release'],
      nextSteps: ['Book practical workshop', 'Practice on volunteer patients', 'Seek mentorship from expert'],
      aiConfidence: 91,
      category: 'advancement'
    }
  ];

  const getCategoryIcon = (category: CareerPathSuggestion['category']) => {
    switch (category) {
      case 'advancement': return <TrendingUp className="h-5 w-5" />;
      case 'specialization': return <Target className="h-5 w-5" />;
      case 'leadership': return <Users className="h-5 w-5" />;
      case 'research': return <Brain className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: CareerPathSuggestion['category']) => {
    switch (category) {
      case 'advancement': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'specialization': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'leadership': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'research': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-700';
    }
  };

  const playSuccessSound = () => {
    // Create a simple success sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleSelectSuggestion = (suggestion: CareerPathSuggestion) => {
    setSelectedSuggestion(suggestion);
    
    // Play success sound
    try {
      playSuccessSound();
    } catch (error) {
      console.log('Audio not supported');
    }
    
    // Fire confetti from the center of the card
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // Fire multiple bursts for more excitement
      fire(x, y, {
        particleCount: 100,
        spread: 70,
        startVelocity: 30,
        colors: ['#FF6B35', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#06B6D4'],
        shapes: ['circle', 'square', 'triangle'],
        duration: 4000
      });
      
      // Second burst slightly delayed
      setTimeout(() => {
        fire(x, y, {
          particleCount: 50,
          spread: 50,
          startVelocity: 25,
          colors: ['#FFD700', '#FF69B4', '#00CED1', '#32CD32'],
          shapes: ['circle', 'triangle'],
          duration: 2000
        });
      }, 300);
    }
  };

  return (
    <div className="relative">
      <ConfettiCanvas />
      
      <Card ref={cardRef} className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white border-0 shadow-xl animate-gradient-wave">
        <CardHeader className="relative">
          <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-gradient-to-br from-yellow-400/30 to-pink-400/40 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
          <div className="flex items-center gap-3 relative">
            <div className="p-2 bg-white/10 rounded-lg animate-brain-pulse">
              <Brain className="h-6 w-6 text-yellow-400 animate-ai-thinking" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold neon-glow animate-float">
                🤖 AI Career Path Suggestions
              </CardTitle>
              <p className="text-white/90 font-medium">
                ✨ Personalized recommendations powered by AI
              </p>
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {careerSuggestions.map((suggestion) => (
            <Card 
              key={suggestion.id} 
              className={`bg-white/10 border-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 cursor-pointer hover:scale-105 transform ${
                selectedSuggestion?.id === suggestion.id ? 'ring-2 ring-yellow-400 animate-pulse-glow scale-105' : ''
              }`}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg text-white ${getCategoryColor(suggestion.category)}`}>
                    {getCategoryIcon(suggestion.category)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white">{suggestion.title}</h3>
                      <Badge className="bg-yellow-400 text-black font-bold">
                        {suggestion.aiConfidence}% AI Match
                      </Badge>
                    </div>
                    
                    <p className="text-white/90 text-sm">{suggestion.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-white/80">
                          <Target className="h-4 w-4" />
                          <span>Relevance</span>
                        </div>
                        <Progress value={suggestion.currentRelevance} className="h-2 mt-1" />
                        <span className="text-xs text-white/70">{suggestion.currentRelevance}%</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-1 text-white/80">
                          <TrendingUp className="h-4 w-4" />
                          <span>Impact</span>
                        </div>
                        <Progress value={suggestion.potentialImpact} className="h-2 mt-1" />
                        <span className="text-xs text-white/70">{suggestion.potentialImpact}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{suggestion.timeToComplete}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        <span>{suggestion.requiredCpdPoints} CPD Points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {selectedSuggestion && (
            <Card className="bg-white/10 border-yellow-400/50 backdrop-blur-sm animate-bounce-in">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Next Steps for {selectedSuggestion.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-white mb-2">🎯 Recommended Actions:</h4>
                  <ul className="space-y-1">
                    {selectedSuggestion.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-white/90">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">📚 Suggested Courses:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSuggestion.suggestedCourses.map((course, index) => (
                      <Badge key={index} className="bg-blue-500 text-white">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold animate-pulse-glow transform hover:scale-105 transition-all duration-200"
                  onClick={() => {
                    // Fire confetti on button click too
                    if (cardRef.current) {
                      const rect = cardRef.current.getBoundingClientRect();
                      const x = rect.left + rect.width / 2;
                      const y = rect.top + rect.height;
                      
                      fire(x, y, {
                        particleCount: 30,
                        spread: 45,
                        startVelocity: 20,
                        colors: ['#FFD700', '#FFA500', '#FF69B4'],
                        shapes: ['circle'],
                        duration: 1500
                      });
                    }
                  }}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  🚀 Start This Career Path
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerPathSuggestion;