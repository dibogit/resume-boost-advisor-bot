
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  grade: string;
}

const ScoreDisplay = ({ score, grade }: ScoreDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return "bg-green-100 text-green-800 border-green-200";
    if (grade.startsWith('B')) return "bg-blue-100 text-blue-800 border-blue-200";
    if (grade.startsWith('C')) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <Minus className="h-5 w-5 text-yellow-600" />;
    return <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent! Your resume is highly ATS-optimized.";
    if (score >= 80) return "Great! Your resume should pass most ATS systems.";
    if (score >= 70) return "Good! A few improvements will boost your ATS score.";
    if (score >= 60) return "Fair. Some optimization needed for better ATS performance.";
    return "Needs improvement. Significant changes required for ATS compatibility.";
  };

  return (
    <Card className="border-2">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2">
          {getScoreIcon(score)}
          <span>ATS Compatibility Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>
            {score}
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <Badge variant="outline" className={`text-lg px-4 py-1 ${getGradeColor(grade)}`}>
            Grade: {grade}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>ATS Compatibility</span>
            <span>{score}%</span>
          </div>
          <div className="relative">
            <Progress value={score} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ease-out ${getProgressColor(score)}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-700 font-medium">{getScoreMessage(score)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreDisplay;
