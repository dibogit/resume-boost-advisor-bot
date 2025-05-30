
import { CheckCircle, AlertTriangle, Target, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const RecommendationsList = ({ 
  strengths, 
  improvements, 
  keywordOptimization, 
  formatting 
}) => {
  return (
    <div className="space-y-6">
      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>Strengths</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {strengths.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {strengths.map((strength, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{strength}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Improvements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            <span>Areas for Improvement</span>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {improvements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {improvements.map((improvement, index) => (
            <div key={index} className="flex items-start space-x-3">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{improvement}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <Target className="h-5 w-5" />
              <span>Keyword Optimization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{keywordOptimization}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700">
              <FileText className="h-5 w-5" />
              <span>Formatting & Structure</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{formatting}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecommendationsList;
