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
    <div className="mb-8">
      <ConfettiCanvas />
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">🤖 AI Career Path Suggestions</h2>
                <p className="text-gray-600">✨ Personalized recommendations powered by advanced AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600 text-white px-3 py-1">
                <Sparkles className="h-4 w-4 mr-1" />
                AI Powered
              </Badge>
              <Badge variant="outline" className="border-green-300 text-green-700">
                94% Match Rate
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerSuggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="group bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 hover:border-purple-300 rounded-xl p-6 transition-all duration-200 hover:shadow-lg cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg text-white ${getCategoryColor(suggestion.category)}`}>
                    {getCategoryIcon(suggestion.category)}
                  </div>
                  <Badge className="bg-purple-600 text-white px-2 py-1 text-xs">
                    {suggestion.aiConfidence}% AI Match
                  </Badge>
                </div>
                
                <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">{suggestion.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{suggestion.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Relevance</span>
                      <span>{suggestion.currentRelevance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: `${suggestion.currentRelevance}%`}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Impact</span>
                      <span>{suggestion.potentialImpact}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: `${suggestion.potentialImpact}%`}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {suggestion.timeToComplete}
                  </div>
                  <span className="font-medium text-purple-600">{suggestion.requiredCpdPoints} CPD Points</span>
                </div>
              </div>
            ))}
          </div>

          {selectedSuggestion && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="h-6 w-6 text-yellow-600" />
                <h3 className="font-bold text-gray-900">Next Steps for {selectedSuggestion.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Recommended Actions:
                  </h4>
                  <ul className="space-y-2">
                    {selectedSuggestion.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Suggested Courses:
                  </h4>
                  <ul className="space-y-2">
                    {selectedSuggestion.suggestedCourses.map((course, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        {course}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerPathSuggestion;