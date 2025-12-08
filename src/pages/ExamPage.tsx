/**
 * Exam Selection Page - Shows Practice and Mock Test options for selected exam
 */

import { useParams, useNavigate, Link } from 'react-router-dom';
import { EXAM_DETAILS, type ExamSlug } from '@utils/constants';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function ExamPage() {
  const { examSlug } = useParams<{ examSlug: string }>();
  const navigate = useNavigate();

  // Validate exam slug
  const isValidSlug = (slug: string | undefined): slug is ExamSlug => {
    return slug !== undefined && slug in EXAM_DETAILS;
  };

  // Handle invalid exam slug
  if (!isValidSlug(examSlug)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card padding="lg" className="max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Not Found</h1>
          <p className="text-gray-600 mb-6">
            The exam you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button variant="primary" fullWidth>
              Return to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const exam = EXAM_DETAILS[examSlug];

  // Action cards data
  const actionCards = [
    {
      id: 'practice',
      icon: '📚',
      title: 'Practice by Unit',
      description: 'Study chapter by chapter at your own pace',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      path: `/exam/${examSlug}/practice`,
      details: `${exam.totalUnits} units available`,
    },
    {
      id: 'mock',
      icon: '⏱️',
      title: 'Mock Test',
      description: 'Timed exam simulation (10 tests available)',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      path: `/exam/${examSlug}/mock`,
      details: `${exam.totalTimeMinutes} minutes, ${exam.totalMcqQuestions} questions`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              leftIcon={<span>←</span>}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Exam Info Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-4xl mb-4 shadow-lg">
            🎓
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {exam.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
            {exam.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="default">{exam.totalUnits} Units</Badge>
            <Badge variant="info">{exam.totalMcqQuestions} Questions</Badge>
            <Badge variant="warning">70% Pass Required</Badge>
            <Badge variant="success">{exam.totalTimeMinutes} min Exam</Badge>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {actionCards.map((card) => (
            <Link key={card.id} to={card.path} className="block group">
              <Card
                hoverable
                padding="none"
                className="overflow-hidden h-full transition-all duration-300 group-hover:scale-105"
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${card.color} ${card.hoverColor} p-8 text-white transition-all duration-300`}>
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
                  <p className="text-white/90 text-sm">{card.details}</p>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    {card.description}
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Get Started</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Additional Info Section */}
        <Card padding="lg" className="bg-gradient-to-r from-gray-50 to-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Not sure where to start?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              We recommend starting with Practice by Unit to build your knowledge,
              then moving to Mock Tests when you feel confident.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Track your progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Detailed explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Real exam format</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
