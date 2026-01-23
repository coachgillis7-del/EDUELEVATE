
import { GoogleGenAI, Type } from "@google/genai";

// Standard initialization per developer rules
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface FileData {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export const analyzeLessonPlan = async (content: string, curriculum: string, fileData?: FileData, targetLesson?: string, showTTESS: boolean = false) => {
  const systemInstruction = `
    You are a veteran Instructional Coach for Pre-K to 2nd Grade. 
    Your goal is to provide supportive, private feedback focused on GROWTH.
    ${showTTESS ? "Additionally, map feedback to the TTESS rubric dimensions." : "DO NOT use numeric scores or appraisal language unless showTTESS is true."}
    
    SCAFFOLDING REQUIREMENT:
    Identify the most relevant rung from the Growth Ladder (Clarity -> CFUs -> Student Talk -> Misconceptions -> Differentiation).
  `;

  const prompt = `
    Audit this lesson from ${curriculum}.
    Target: "${targetLesson || 'Primary'}"
    Teacher Notes: ${content}

    Check for:
    1. Fundamental 5 Framing (WE WILL/I WILL).
    2. Anticipated Misconceptions (Issue, Cause, Correction).
    3. Talk Balance targets.
    
    Return JSON.
  `;

  const parts: any[] = [{ text: prompt }];
  if (fileData) parts.push(fileData);

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          ttessAlignment: showTTESS ? {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dimension: { type: Type.STRING },
                score: { type: Type.NUMBER },
                evidence: { type: Type.STRING }
              }
            }
          } : undefined
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const rewriteLessonPlan = async (content: string, suggestions: string[], targetLesson?: string) => {
  const systemInstruction = `
    You are an instructional coaching engine for Pre-K–2 classrooms.
    Generate two layers of output:
    1) A DISTINGUISHED Model Lesson Plan (full integration).
    2) A Proficient+1 Bridge Plan (scaffolded version).

    REQUIRED COMPONENTS:
    - Fundamental 5: WE WILL (Teacher focus) and I WILL (Student focus).
    - 2+ Misconceptions: Issue, Cause, Correction.
    - Talk Balance Target (e.g., 55/45).
    - Flow: Do Now -> I Do -> We Do -> You Do -> Closure.
  `;

  const prompt = `
    Rewrite the lesson: "${targetLesson || 'Primary'}"
    Suggestions: ${suggestions.join(', ')}
    Context: ${content}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: {
            type: Type.OBJECT,
            properties: {
              grade: { type: Type.STRING },
              subject: { type: Type.STRING },
              standards: { type: Type.STRING },
              learningObjective: { type: Type.STRING },
              successCriteria: { type: Type.STRING },
              vocabulary: { type: Type.STRING },
              talkBalanceTarget: { type: Type.STRING }
            }
          },
          weWill: { type: Type.STRING },
          iWill: { type: Type.STRING },
          misconceptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                issue: { type: Type.STRING },
                cause: { type: Type.STRING },
                correction: { type: Type.STRING }
              }
            }
          },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                teacherActions: { type: Type.STRING },
                studentActions: { type: Type.STRING },
                engagementStrategy: { type: Type.STRING },
                quickCheck: { type: Type.STRING }
              }
            }
          },
          differentiation: {
            type: Type.OBJECT,
            properties: { below: { type: Type.STRING }, on: { type: Type.STRING }, above: { type: Type.STRING } }
          },
          classroomCulture: {
            type: Type.OBJECT,
            properties: { paxKernel: { type: Type.STRING }, attentionSignal: { type: Type.STRING } }
          },
          bridgePlan: {
            type: Type.OBJECT,
            properties: {
              focusSkill: { type: Type.STRING },
              twoMoves: { type: Type.ARRAY, items: { type: Type.STRING } },
              easierVersion: { type: Type.STRING },
              successSignal: { type: Type.STRING }
            }
          },
          exitTicketDesign: {
            type: Type.OBJECT,
            properties: { skill: { type: Type.STRING }, masteryRule: { type: Type.STRING } }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const analyzeObservation = async (transcript: string, originalPlan: string, teacherNotes?: string, showTTESS: boolean = false) => {
  const systemInstruction = `
    You are an instructional growth partner. Analyze the recording.
    REQUIRED:
    1. Talk Balance Ratio (% Teacher vs % Student) with evidence quotes.
    2. Misconception Handling Review (Evidence/Quote + Timestamp).
    3. Lesson Flow Review (Directly compare to plan: matched/missing/adjust).
    4. Proficient+1 Next Step (Growth Ladder rung + 2 moves).
    5. GROWTH TONE. Avoid 'gotchas' language.
  `;

  const prompt = `
    Audio Transcript Context: ${transcript}
    Original Plan: ${originalPlan}
    Notes: ${teacherNotes}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          alignmentSummary: {
            type: Type.OBJECT,
            properties: { level: { type: Type.STRING }, strength: { type: Type.STRING }, growth: { type: Type.STRING } }
          },
          talkBalance: {
            type: Type.OBJECT,
            properties: {
              teacherPercentage: { type: Type.NUMBER },
              studentPercentage: { type: Type.NUMBER },
              evidence: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { quote: { type: Type.STRING }, type: { type: Type.STRING }, timestamp: { type: Type.STRING } }
                }
              },
              missedOpportunity: { type: Type.STRING },
              actionStep: { type: Type.STRING }
            }
          },
          misconceptionReview: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                appeared: { type: Type.STRING },
                response: { type: Type.STRING },
                resolved: { type: Type.BOOLEAN },
                suggestion: { type: Type.STRING }
              }
            }
          },
          flowAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                whatMatched: { type: Type.STRING },
                whatWasMissing: { type: Type.STRING },
                adjustment: { type: Type.STRING }
              }
            }
          },
          bridgePlan: {
            type: Type.OBJECT,
            properties: {
              focusSkill: { type: Type.STRING },
              twoMoves: { type: Type.ARRAY, items: { type: Type.STRING } },
              easierVersion: { type: Type.STRING },
              successSignal: { type: Type.STRING }
            }
          },
          ttessAlignment: showTTESS ? {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { dimension: { type: Type.STRING }, score: { type: Type.NUMBER }, evidence: { type: Type.STRING } }
            }
          } : undefined,
          nextAdjustments: {
            type: Type.OBJECT,
            properties: {
              keep: { type: Type.ARRAY, items: { type: Type.STRING } },
              adjust: { type: Type.ARRAY, items: { type: Type.STRING } },
              add: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const analyzeExitTickets = async (fileData: FileData[], studentNames: string[]) => {
  const systemInstruction = `
    You are a learning analysis engine for Pre-K–2.
    Analyze student work and group results.
    REQUIRED:
    - Misconception Mapping: Primary and Secondary misconceptions.
    - Next Day Plan: Short reteach cycle.
    - Bridge Plan: Recommend one Growth Ladder rung.
  `;

  const prompt = `Analyze images. Match to students: ${studentNames.join(', ')}. Return JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [...fileData, { text: prompt }] },
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          snapshot: {
            type: Type.OBJECT,
            properties: { skill: { type: Type.STRING }, totalStudents: { type: Type.NUMBER }, masteryCriteria: { type: Type.STRING } }
          },
          performanceBands: {
            type: Type.OBJECT,
            properties: {
              gotIt: { type: Type.OBJECT, properties: { count: { type: Type.NUMBER }, names: { type: Type.ARRAY, items: { type: Type.STRING } } } },
              almost: { type: Type.OBJECT, properties: { count: { type: Type.NUMBER }, names: { type: Type.ARRAY, items: { type: Type.STRING } } } },
              notYet: { type: Type.OBJECT, properties: { count: { type: Type.NUMBER }, names: { type: Type.ARRAY, items: { type: Type.STRING } } } }
            }
          },
          misconceptionMapping: {
            type: Type.OBJECT,
            properties: { primary: { type: Type.STRING }, secondary: { type: Type.STRING }, reteachStrategy: { type: Type.STRING } }
          },
          bridgePlan: {
            type: Type.OBJECT,
            properties: {
              focusSkill: { type: Type.STRING },
              twoMoves: { type: Type.ARRAY, items: { type: Type.STRING } },
              easierVersion: { type: Type.STRING },
              successSignal: { type: Type.STRING }
            }
          },
          nextDayPlan: {
            type: Type.OBJECT,
            properties: {
              reteach: { type: Type.OBJECT, properties: { strategy: { type: Type.STRING }, example: { type: Type.STRING } } },
              reinforce: { type: Type.OBJECT, properties: { strategy: { type: Type.STRING } } },
              extension: { type: Type.OBJECT, properties: { task: { type: Type.STRING } } }
            }
          },
          studentData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, suggestedTier: { type: Type.NUMBER }, observation: { type: Type.STRING } }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateReflectionReport = async (observation: any, exitTickets: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Synthesize results. Observation: ${JSON.stringify(observation)}. Exit Tickets: ${JSON.stringify(exitTickets)}.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lessonInfo: { type: Type.OBJECT, properties: { teacher: { type: Type.STRING }, date: { type: Type.STRING }, subject: { type: Type.STRING } } },
          implementationSnapshot: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { phase: { type: Type.STRING }, strengths: { type: Type.STRING }, growthAreas: { type: Type.STRING } } } },
          studentResults: { type: Type.OBJECT, properties: { masteryRate: { type: Type.STRING }, bands: { type: Type.STRING } } },
          bridgePlanHistory: { type: Type.ARRAY, items: { type: Type.STRING } },
          growthMindsetStatement: { type: Type.STRING },
          actionSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateGrowthTrendAnalysis = async (lessonHistory: any[], studentHistory: any[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze history. Lessons: ${JSON.stringify(lessonHistory)}. Students: ${JSON.stringify(studentHistory)}.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallTrend: { type: Type.STRING },
          metricSnapshots: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: { metric: { type: Type.STRING }, value: { type: Type.STRING }, trend: { type: Type.STRING } } }
          },
          growthInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
          ladderProgress: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text);
};
