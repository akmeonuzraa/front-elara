import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Medical specialties for demonstration
const SPECIALTIES = [
  'Rhumatologie',
  'Neurologie',
  'Orthopedie',
  'Genetique medicale',
  'Medecine physique et readaptation',
  'Pediatrie',
];

// Mock disease database for demonstration
const DISEASES = [
  { name: 'Dystrophie musculaire de Duchenne', orphacode: 'ORPHA:98896' },
  { name: 'Arthrogrypose congenitale', orphacode: 'ORPHA:1037' },
  { name: 'Osteogenese imparfaite', orphacode: 'ORPHA:666' },
  { name: 'Myopathie de Bethlem', orphacode: 'ORPHA:50338' },
  { name: 'Sclerose en plaques', orphacode: 'ORPHA:243' },
  { name: 'Maladie de Charcot-Marie-Tooth', orphacode: 'ORPHA:636' },
];

// Symptom to specialty mapping (simplified for demo)
const SYMPTOM_SPECIALTY_MAP: Record<string, string[]> = {
  'douleur': ['Rhumatologie', 'Orthopedie'],
  'articulaire': ['Rhumatologie', 'Orthopedie'],
  'gonflement': ['Rhumatologie', 'Rhumatologie'],
  'raideur': ['Rhumatologie', 'Medecine physique et readaptation'],
  'osseuse': ['Orthopedie', 'Genetique medicale'],
  'fracture': ['Orthopedie', 'Genetique medicale'],
  'musculaire': ['Neurologie', 'Genetique medicale'],
  'myalgie': ['Rhumatologie', 'Neurologie'],
  'atrophie': ['Neurologie', 'Genetique medicale'],
  'arthrite': ['Rhumatologie'],
  'pied': ['Orthopedie', 'Pediatrie'],
  'scoliose': ['Orthopedie', 'Rhumatologie'],
  'developpement': ['Pediatrie', 'Genetique medicale'],
  'moteur': ['Pediatrie', 'Neurologie'],
  'hypotonie': ['Pediatrie', 'Neurologie', 'Genetique medicale'],
};

function predictSpecialty(symptoms: string[]): { specialty: string; confidence: number; alternatives: any[]; diseases: any[] } {
  // Simulate ML prediction based on symptom keywords
  const scores: Record<string, number> = {};

  for (const symptom of symptoms) {
    const lowerSymptom = symptom.toLowerCase();
    for (const [keyword, specialties] of Object.entries(SYMPTOM_SPECIALTY_MAP)) {
      if (lowerSymptom.includes(keyword)) {
        for (const spec of specialties) {
          scores[spec] = (scores[spec] || 0) + 1;
        }
      }
    }
  }

  // Normalize scores
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const sortedSpecialties = Object.entries(scores)
    .map(([specialty, score]) => ({ specialty, score: score / total }))
    .sort((a, b) => b.score - a.score);

  // Add random default specialties if no matches
  if (sortedSpecialties.length === 0) {
    const randomIdx = Math.floor(Math.random() * SPECIALTIES.length);
    sortedSpecialties.push({ specialty: SPECIALTIES[randomIdx], score: 0.5 });
  }

  // Ensure we have confidence between 0.6 and 0.95
  const topScore = Math.min(0.95, Math.max(0.6, sortedSpecialties[0]?.score || 0.7));

  // Create alternatives
  const alternatives = sortedSpecialties.slice(1, 4).map(s => ({
    specialty: s.specialty,
    score: Math.min(0.5, s.score * 0.8),
  }));

  // Add random diseases
  const shuffledDiseases = [...DISEASES].sort(() => Math.random() - 0.5);
  const diseases = shuffledDiseases.slice(0, 3);

  return {
    specialty: sortedSpecialties[0]?.specialty || SPECIALTIES[0],
    confidence: topScore,
    alternatives: alternatives.length > 0 ? alternatives : SPECIALTIES.slice(1, 4).map(s => ({ specialty: s, score: Math.random() * 0.3 + 0.2 })),
    diseases,
  };
}

function analyzeMRI(filename: string): { class: string; confidence: number; disclaimer: string } {
  // Simulated MRI classification for demonstration
  const classes = [
    'Pas de tumeur detectee',
    'Tumeur possible - IRM suggeree',
    'Anomalie suspecte - Consultation recommandee',
  ];

  const randomClass = classes[Math.floor(Math.random() * classes.length)];
  const confidence = Math.random() * 0.4 + 0.55; // 55-95%

  return {
    class: randomClass,
    confidence,
    disclaimer: 'Outil pedagogique a but de demonstration — ne remplace pas un avis medical professionnel.',
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("Content-Type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle MRI image upload
      const formData = await req.formData();
      const image = formData.get("image") as File;

      if (!image) {
        return new Response(
          JSON.stringify({ error: "No image provided" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = analyzeMRI(image.name);

      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Handle JSON request for symptoms
      const body = await req.json();

      if (body.action === 'symptoms') {
        const symptoms = body.symptoms || [];

        if (!Array.isArray(symptoms) || symptoms.length === 0) {
          return new Response(
            JSON.stringify({ error: "No symptoms provided" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const result = predictSpecialty(symptoms);
        result.disclaimer = 'Ceci est une estimation basee sur les symptomes selectionnes. Consultez un professionnel de sante.';

        return new Response(
          JSON.stringify(result),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
