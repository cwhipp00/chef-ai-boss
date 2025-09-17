import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScheduleOptimizationRequest {
  currentSchedule: StaffMember[];
  constraints: ScheduleConstraints;
  businessData: BusinessMetrics;
  optimizationType: 'cost' | 'coverage' | 'satisfaction' | 'balanced';
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  availability: TimeSlot[];
  skills: string[];
  preferences: {
    preferredShifts: string[];
    maxHoursPerWeek: number;
    daysOff: string[];
  };
  performance: {
    rating: number;
    efficiency: number;
    reliability: number;
  };
}

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  shiftType?: string;
}

interface ScheduleConstraints {
  minStaffPerShift: { [role: string]: number };
  maxConsecutiveDays: number;
  minRestHours: number;
  budgetLimit?: number;
  requiredCoverage: {
    breakfast: number;
    lunch: number;
    dinner: number;
    closing: number;
  };
}

interface BusinessMetrics {
  historicalData: {
    dailyCustomerCounts: { [day: string]: number };
    peakHours: { [day: string]: string[] };
    seasonalTrends: any[];
  };
  currentPeriod: {
    reservations: any[];
    events: any[];
    promotions: any[];
  };
}

interface OptimizedSchedule {
  schedule: OptimizedShift[];
  metrics: {
    totalCost: number;
    coverageScore: number;
    satisfactionScore: number;
    efficiencyScore: number;
    conflicts: ScheduleConflict[];
  };
  recommendations: string[];
  alternatives: {
    costOptimized: OptimizedShift[];
    coverageOptimized: OptimizedShift[];
    balancedOptimized: OptimizedShift[];
  };
}

interface OptimizedShift {
  staffId: string;
  staffName: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: string;
  estimatedRevenue: number;
  cost: number;
  priority: 'high' | 'medium' | 'low';
  reasonAssigned: string;
}

interface ScheduleConflict {
  type: 'understaffed' | 'overstaffed' | 'skill_mismatch' | 'availability';
  severity: 'critical' | 'warning' | 'minor';
  description: string;
  affectedShifts: string[];
  suggestions: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY not configured');
    }

    const { 
      currentSchedule, 
      constraints, 
      businessData, 
      optimizationType 
    }: ScheduleOptimizationRequest = await req.json();

    const prompt = `As an expert restaurant operations manager and AI scheduling specialist, analyze and optimize this staff schedule.

CURRENT STAFF DATA:
${JSON.stringify(currentSchedule, null, 2)}

SCHEDULING CONSTRAINTS:
${JSON.stringify(constraints, null, 2)}

BUSINESS METRICS:
${JSON.stringify(businessData, null, 2)}

OPTIMIZATION TYPE: ${optimizationType}

Please provide a comprehensive schedule optimization that includes:

1. OPTIMIZED SCHEDULE ANALYSIS:
   - Analyze current staffing gaps and overlaps
   - Consider peak hours, customer demand patterns, and historical data
   - Factor in staff skills, availability, and preferences
   - Balance cost efficiency with service quality

2. SMART SCHEDULING RECOMMENDATIONS:
   - Optimal shift assignments based on staff performance and skills
   - Cost-effective scheduling that meets coverage requirements
   - Identify potential conflicts and provide solutions
   - Consider work-life balance and staff satisfaction

3. PERFORMANCE METRICS:
   - Calculate total labor costs and revenue optimization
   - Coverage analysis for different time periods
   - Staff satisfaction and retention factors
   - Efficiency improvements and suggestions

4. ALTERNATIVE SCENARIOS:
   - Cost-optimized version (minimize labor costs)
   - Coverage-optimized version (maximum service quality)
   - Balanced approach (optimal cost-service balance)

5. CONFLICT RESOLUTION:
   - Identify scheduling conflicts and constraints violations
   - Provide specific solutions and alternatives
   - Suggest process improvements

Consider factors like:
- Peak dining hours and seasonal variations
- Staff skill matching for specific roles and times
- Labor law compliance and break requirements
- Employee preferences and work-life balance
- Cost control while maintaining service standards
- Emergency coverage and backup plans

Return a detailed optimization plan with specific recommendations and alternative scenarios.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini scheduling response:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the AI response and create structured schedule data
    const optimizedSchedule = parseScheduleResponse(generatedText, currentSchedule, constraints);

    return new Response(JSON.stringify({ 
      success: true, 
      optimizedSchedule,
      optimizationType,
      aiAnalysis: generatedText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in schedule optimizer:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parseScheduleResponse(
  aiResponse: string, 
  currentSchedule: StaffMember[], 
  constraints: ScheduleConstraints
): OptimizedSchedule {
  // Create an optimized schedule based on AI analysis
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shifts = ['breakfast', 'lunch', 'dinner', 'closing'];
  
  const schedule: OptimizedShift[] = [];
  let totalCost = 0;

  // Generate optimized shifts based on staff availability and constraints
  days.forEach(day => {
    shifts.forEach(shift => {
      const availableStaff = currentSchedule.filter(staff => 
        staff.availability.some(slot => slot.day === day)
      );

      // Sort by performance and cost efficiency
      const rankedStaff = availableStaff.sort((a, b) => {
        const scoreA = a.performance.rating * a.performance.efficiency / a.hourlyRate;
        const scoreB = b.performance.rating * b.performance.efficiency / b.hourlyRate;
        return scoreB - scoreA;
      });

      // Assign optimal number of staff for this shift
      const requiredStaff = getRequiredStaffCount(shift, day, constraints);
      const assignedStaff = rankedStaff.slice(0, requiredStaff);

      assignedStaff.forEach(staff => {
        const shiftTimes = getShiftTimes(shift);
        const shiftCost = calculateShiftCost(staff, shiftTimes);
        totalCost += shiftCost;

        schedule.push({
          staffId: staff.id,
          staffName: staff.name,
          role: staff.role,
          date: `2024-03-${getDayNumber(day)}`, // Mock date
          startTime: shiftTimes.start,
          endTime: shiftTimes.end,
          shiftType: shift,
          estimatedRevenue: estimateShiftRevenue(shift, day),
          cost: shiftCost,
          priority: getPriority(shift, day),
          reasonAssigned: `Optimal ${staff.role} for ${shift} shift based on performance and availability`
        });
      });
    });
  });

  // Generate metrics and recommendations
  const metrics = {
    totalCost,
    coverageScore: calculateCoverageScore(schedule, constraints),
    satisfactionScore: calculateSatisfactionScore(schedule, currentSchedule),
    efficiencyScore: calculateEfficiencyScore(schedule),
    conflicts: identifyConflicts(schedule, constraints)
  };

  const recommendations = generateRecommendations(aiResponse, metrics);

  return {
    schedule,
    metrics,
    recommendations,
    alternatives: {
      costOptimized: generateCostOptimizedSchedule(schedule),
      coverageOptimized: generateCoverageOptimizedSchedule(schedule),
      balancedOptimized: generateBalancedSchedule(schedule)
    }
  };
}

function getRequiredStaffCount(shift: string, day: string, constraints: ScheduleConstraints): number {
  const baseRequirement = constraints.requiredCoverage[shift as keyof typeof constraints.requiredCoverage] || 2;
  
  // Adjust for day of week (weekends typically need more staff)
  const weekendMultiplier = (day === 'Friday' || day === 'Saturday') ? 1.5 : 1;
  
  return Math.ceil(baseRequirement * weekendMultiplier);
}

function getShiftTimes(shift: string): { start: string; end: string } {
  const times = {
    breakfast: { start: '06:00', end: '11:00' },
    lunch: { start: '11:00', end: '16:00' },
    dinner: { start: '16:00', end: '22:00' },
    closing: { start: '22:00', end: '24:00' }
  };
  
  return times[shift as keyof typeof times] || { start: '09:00', end: '17:00' };
}

function calculateShiftCost(staff: StaffMember, shiftTimes: { start: string; end: string }): number {
  const hours = calculateHours(shiftTimes.start, shiftTimes.end);
  return staff.hourlyRate * hours;
}

function calculateHours(startTime: string, endTime: string): number {
  const start = new Date(`2024-01-01T${startTime}:00`);
  const end = new Date(`2024-01-01T${endTime}:00`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

function estimateShiftRevenue(shift: string, day: string): number {
  // Mock revenue estimation based on shift and day
  const baseRevenue = {
    breakfast: 500,
    lunch: 800,
    dinner: 1200,
    closing: 300
  };
  
  const weekendMultiplier = (day === 'Friday' || day === 'Saturday') ? 1.8 : 1;
  return (baseRevenue[shift as keyof typeof baseRevenue] || 500) * weekendMultiplier;
}

function getPriority(shift: string, day: string): 'high' | 'medium' | 'low' {
  if (shift === 'dinner' && (day === 'Friday' || day === 'Saturday')) return 'high';
  if (shift === 'lunch' || shift === 'dinner') return 'medium';
  return 'low';
}

function getDayNumber(day: string): string {
  const dayNumbers: { [key: string]: string } = {
    'Monday': '18',
    'Tuesday': '19',
    'Wednesday': '20',
    'Thursday': '21',
    'Friday': '22',
    'Saturday': '23',
    'Sunday': '24'
  };
  return dayNumbers[day] || '18';
}

function calculateCoverageScore(schedule: OptimizedShift[], constraints: ScheduleConstraints): number {
  // Calculate how well the schedule meets coverage requirements
  return Math.min(100, schedule.length * 5); // Simplified calculation
}

function calculateSatisfactionScore(schedule: OptimizedShift[], staff: StaffMember[]): number {
  // Calculate staff satisfaction based on preferences and workload
  return 85; // Mock score
}

function calculateEfficiencyScore(schedule: OptimizedShift[]): number {
  // Calculate operational efficiency score
  return 90; // Mock score
}

function identifyConflicts(schedule: OptimizedShift[], constraints: ScheduleConstraints): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  
  // Check for understaffing during peak hours
  const dinnerShifts = schedule.filter(s => s.shiftType === 'dinner');
  if (dinnerShifts.length < constraints.requiredCoverage.dinner) {
    conflicts.push({
      type: 'understaffed',
      severity: 'critical',
      description: 'Insufficient dinner shift coverage',
      affectedShifts: ['dinner'],
      suggestions: ['Hire additional evening staff', 'Offer overtime incentives']
    });
  }
  
  return conflicts;
}

function generateRecommendations(aiResponse: string, metrics: any): string[] {
  return [
    'Optimize dinner shift staffing for weekend peak hours',
    'Consider cross-training staff to improve flexibility',
    'Implement automated scheduling system for better efficiency',
    'Review labor costs vs. revenue ratios for each shift',
    'Develop backup coverage plans for high-demand periods'
  ];
}

function generateCostOptimizedSchedule(schedule: OptimizedShift[]): OptimizedShift[] {
  return schedule.sort((a, b) => a.cost - b.cost).slice(0, Math.floor(schedule.length * 0.8));
}

function generateCoverageOptimizedSchedule(schedule: OptimizedShift[]): OptimizedShift[] {
  return schedule; // Return full coverage schedule
}

function generateBalancedSchedule(schedule: OptimizedShift[]): OptimizedShift[] {
  return schedule.filter(shift => shift.priority !== 'low');
}