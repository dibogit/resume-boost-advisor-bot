
import { useState } from 'react';
import { Upload, FileText, Zap, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import FileUploadZone from '@/components/FileUploadZone';
import ScoreDisplay from '@/components/ScoreDisplay';
import RecommendationsList from '@/components/RecommendationsList';

const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface AnalysisResult {
  atsScore: number;
  overallGrade: string;
  strengths: string[];
  improvements: string[];
  keywordOptimization: string;
  formatting: string;
  summary: string;
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const analyzeResume = async (resumeText: string): Promise<AnalysisResult> => {
    const prompt = `
    Analyze this resume for ATS (Applicant Tracking System) compatibility and provide a comprehensive evaluation. 
    
    Resume content:
    ${resumeText}
    
    Please provide your analysis in the following JSON format:
    {
      "atsScore": [number between 0-100],
      "overallGrade": "[A+/A/B+/B/C+/C/D+/D/F]",
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["improvement1", "improvement2", "improvement3"],
      "keywordOptimization": "detailed feedback on keyword usage",
      "formatting": "feedback on formatting and structure",
      "summary": "overall summary of the resume quality"
    }
    
    Consider factors like:
    - Keyword density and relevance
    - Formatting and structure
    - Contact information completeness
    - Work experience clarity
    - Skills section optimization
    - Education section
    - Action verbs usage
    - Quantified achievements
    - ATS-friendly formatting
    `;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are an expert resume analyst and ATS specialist. Provide detailed, actionable feedback to help job seekers improve their resumes.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  };

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    toast({
      title: "File uploaded successfully",
      description: `${uploadedFile.name} is ready for analysis.`,
    });
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a resume file first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const resumeText = await extractTextFromFile(file);
      const result = await analyzeResume(resumeText);
      setAnalysisResult(result);
      toast({
        title: "Analysis complete!",
        description: `Your resume scored ${result.atsScore}/100 on ATS compatibility.`,
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return "bg-green-100 text-green-800";
    if (grade.startsWith('B')) return "bg-blue-100 text-blue-800";
    if (grade.startsWith('C')) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ATS Resume Checker</h1>
              <p className="text-gray-600">Optimize your resume for Applicant Tracking Systems</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload Your Resume</span>
                </CardTitle>
                <CardDescription>
                  Upload your resume in TXT format for ATS analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploadZone onFileUpload={handleFileUpload} />
                
                {file && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">{file.name}</p>
                        <p className="text-sm text-green-600">Ready for analysis</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleAnalyze}
                  disabled={!file || isAnalyzing}
                  className="w-full mt-4"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What We Analyze</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">ATS Compatibility Score</p>
                    <p className="text-sm text-gray-600">How well your resume passes through ATS filters</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Keyword Optimization</p>
                    <p className="text-sm text-gray-600">Industry-relevant keyword usage and density</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Improvement Suggestions</p>
                    <p className="text-sm text-gray-600">Actionable tips to enhance your resume</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResult ? (
              <>
                <ScoreDisplay 
                  score={analysisResult.atsScore}
                  grade={analysisResult.overallGrade}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{analysisResult.summary}</p>
                  </CardContent>
                </Card>

                <RecommendationsList 
                  strengths={analysisResult.strengths}
                  improvements={analysisResult.improvements}
                  keywordOptimization={analysisResult.keywordOptimization}
                  formatting={analysisResult.formatting}
                />
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Analysis Yet</h3>
                  <p className="text-gray-500">Upload and analyze your resume to see detailed feedback</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
