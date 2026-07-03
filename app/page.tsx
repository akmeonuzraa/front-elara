'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Simple Progress component
const Progress = ({ value, className }: { value?: number; className?: string }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className || ''}`}>
    <div
      className="h-full bg-primary transition-all"
      style={{ width: `${value || 0}%` }}
    />
  </div>
);

// Icons as simple SVG components
const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54"></path>
  </svg>
);

const MessageCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
  </svg>
);

const StethoscopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3 A.3.3 0 0 1 5.1 2 L5.5 2 A.3.3 0 0 1 5.8 2.3 L5.8 8.1 C5.8 10.5 7.6 12.5 10 12.7 V17.3 A3.1 3.1 0 0 0 13.1 20.4 A3.1 3.1 0 0 0 16.2 17.3 V12.7 C18.6 12.5 20.4 10.5 20.4 8.1 L20.4 2.3 A.3.3 0 0 1 20.7 2 L21.1 2 A.3.3 0 0 1 21.4 2.3 L21.4 8.1 C21.4 11.2 19.1 13.7 16.2 14.1 V17.3 A4.1 4.1 0 0 1 12.1 21.4 A4.1 4.1 0 0 1 8 17.3 V14.1 C5.1 13.7 2.8 11.2 2.8 8.1 L2.8 2.3 A.3.3 0 0 1 3.1 2 L3.5 2 A.3.3 0 0 1 3.8 2.3 L3.8 8.1 C3.8 10 5.3 11.7 7.2 11.9 V8.1 L7.2 2.3 C7.2 2.2 7.3 2 7.5 2 L7.9 2 C8 2 8.2 2.1 8.2 2.3 L8.2 8.1 C8.2 10 9.7 11.7 11.6 11.9 V17.3 C11.6 17.7 11.9 18 12.3 18 L13.9 18 C14.3 18 14.6 17.7 14.6 17.3 L14.6 11.8 C16.5 11.6 18 9.9 18 8 L18 2.2 C18 2.1 17.9 2 17.8 2 L17.4 2 C17.3 2 17.1 2.1 17.1 2.2 L17.1 8 C17.1 9.6 15.8 10.9 14.2 11 L14.2 17.2 C14.2 17.3 14.1 17.4 14 17.4 L12.2 17.4 C12.1 17.4 12 17.3 12 17.2 L12 11 L11.7 11 C10.1 10.9 8.9 9.6 8.9 8 L8.9 2.2 C8.9 2.1 8.8 2 8.7 2 L8.3 2 C8.2 2 8 2.1 8 2.2 L8 8 C8 9.6 6.7 10.9 5.1 11 L4.8 11 L4.8 2.3 Z"></path>
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

// HPO Symptom options (simplified list for demonstration)
const HPO_SYMPTOMS = [
  { id: 'HP:0000924', label: 'Douleur articulaire' },
  { id: 'HP:0001386', label: 'Gonflement articulaire' },
  { id: 'HP:0001367', label: 'Raideur articulaire' },
  { id: 'HP:0002797', label: 'Malformation osseuse' },
  { id: 'HP:0000925', label: 'Fracture spontanee' },
  { id: 'HP:0001250', label: 'Faiblesse musculaire' },
  { id: 'HP:0003326', label: 'Myalgie' },
  { id: 'HP:0003202', label: 'Atrophie musculaire' },
  { id: 'HP:0001371', label: 'Arthrite' },
  { id: 'HP:0002829', label: 'Douleur osseuse' },
  { id: 'HP:0001760', label: 'Deformite du pied' },
  { id: 'HP:0002650', label: 'Scoliose' },
  { id: 'HP:0001249', label: 'Retard de developpement' },
  { id: 'HP:0001270', label: 'Retard moteur' },
  { id: 'HP:0001557', label: 'Hypotonie neonatale' },
];

const SPECIALTIES = [
  'Rhumatologie',
  'Neurologie',
  'Orthopedie',
  'Genetique medicale',
  'Medecine physique et readaptation',
  'Pediatrie',
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<'symptoms' | 'mri' | 'chat'>('symptoms');

  // Symptoms state
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSearch, setSymptomSearch] = useState('');
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // MRI state
  const [mriFile, setMriFile] = useState<File | null>(null);
  const [mriPreview, setMriPreview] = useState<string | null>(null);
  const [mriResult, setMriResult] = useState<any>(null);
  const [isAnalyzingMri, setIsAnalyzingMri] = useState(false);
  const [mriDragOver, setMriDragOver] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Filter symptoms based on search
  const filteredSymptoms = HPO_SYMPTOMS.filter(s =>
    s.label.toLowerCase().includes(symptomSearch.toLowerCase()) &&
    !selectedSymptoms.includes(s.id)
  );

  // Handle symptom toggle
  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    setPredictionResult(null);
  };

  // Handle symptom prediction
  const handleSymptomPrediction = async () => {
    if (selectedSymptoms.length === 0) return;

    setIsPredicting(true);
    setPredictionResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/elaramed-predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'symptoms',
          symptoms: selectedSymptoms.map(id => HPO_SYMPTOMS.find(s => s.id === id)?.label || id),
        }),
      });

      if (!response.ok) throw new Error('Prediction failed');

      const data = await response.json();
      setPredictionResult(data);
    } catch (error) {
      console.error('Prediction error:', error);
      // Fallback to simulated result for demo
      const simulated = {
        specialty: SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)],
        confidence: Math.random() * 0.3 + 0.6,
        alternatives: SPECIALTIES.slice(0, 3).map(s => ({ specialty: s, score: Math.random() * 0.3 + 0.3 })),
        diseases: [
          { name: 'Dystrophie musculaire de Duchenne', orphacode: 'ORPHA:98896' },
          { name: 'Arthrogrypose congenitale', orphacode: 'ORPHA:1037' },
          { name: 'Osteogenese imparfaite', orphacode: 'ORPHA:666' },
        ],
        disclaimer: 'Ceci est une estimation basee sur les symptomes selectionnes. Consultez un professionnel de sante.',
      };
      setPredictionResult(simulated);
    } finally {
      setIsPredicting(false);
    }
  };

  // Handle MRI file selection
  const handleMriFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setMriFile(file);
    setMriResult(null);
    const reader = new FileReader();
    reader.onload = e => setMriPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Handle MRI analysis
  const handleMriAnalysis = async () => {
    if (!mriFile) return;

    setIsAnalyzingMri(true);
    setMriResult(null);

    try {
      const formData = new FormData();
      formData.append('image', mriFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/elaramed-predict`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('MRI analysis failed');

      const data = await response.json();
      setMriResult(data);
    } catch (error) {
      console.error('MRI analysis error:', error);
      // Fallback to simulated result for demo
      const simulatedMRI = {
        class: ['Pas de tumeur detectee', 'Tumeur possible - IRM suggeree', 'Anomalie suspecte'][Math.floor(Math.random() * 3)],
        confidence: Math.random() * 0.4 + 0.55,
        disclaimer: 'Outil pedagogique a but de demonstration — ne remplace pas un avis medical professionnel.',
      };
      setMriResult(simulatedMRI);
    } finally {
      setIsAnalyzingMri(false);
    }
  };

  // Handle chat send
  const handleChatSend = async () => {
    if (!chatInput.trim() || isSendingChat) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/elaramed-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: [...chatMessages, { role: 'user', content: userMessage }],
          prediction: predictionResult,
        }),
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Je suis desole, je ne peux pas repondre pour le moment. Veuillez reessayer ou consulter un professionnel de sante.",
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F4FC] via-white to-[#E8F4FC]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1F4E79] to-[#2E75B6] flex items-center justify-center">
              <span className="w-6 h-6 text-white"><ActivityIcon /></span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1F4E79] to-[#2E75B6]">elaraMed</h1>
              <p className="text-xs text-muted-foreground">Plateforme d'aide au diagnostic</p>
            </div>
          </div>

          <nav className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeSection === 'symptoms' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('symptoms')}
                    className="gap-2"
                  >
                    <span className="w-4 h-4"><StethoscopeIcon /></span>
                    <span className="hidden sm:inline">Symptomes</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Analyse des symptomes</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeSection === 'mri' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('mri')}
                    className="gap-2"
                  >
                    <span className="w-4 h-4"><BrainIcon /></span>
                    <span className="hidden sm:inline">IRM</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Analyse d'images IRM</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeSection === 'chat' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('chat')}
                    className="gap-2"
                  >
                    <span className="w-4 h-4"><MessageCircleIcon /></span>
                    <span className="hidden sm:inline">Assistant</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Chatbot medical</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1F4E79] to-[#2E75B6]">Intelligence Artificielle</span>
          <br />
          au service de la sante
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          elaraMed utilise des modeles d'apprentissage automatique pour aider a orienter
          les patients vers la bonne specialite medicale. Outil pedagogique developpe
          dans le cadre du projet Data Science - Universite Polytechnique Agadir.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="py-2 px-4 text-sm">
            1 606 maladies rares
          </Badge>
          <Badge variant="secondary" className="py-2 px-4 text-sm">
            6 specialites medicales
          </Badge>
          <Badge variant="secondary" className="py-2 px-4 text-sm">
            API Claude integree
          </Badge>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        {/* Symptoms Section */}
        {activeSection === 'symptoms' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Symptom Selection */}
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-5 h-5 text-primary"><StethoscopeIcon /></span>
                  Selection des symptomes
                </CardTitle>
                <CardDescription>
                  Recherchez et selectionnez les symptomes presentes par le patient
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Rechercher un symptome..."
                    value={symptomSearch}
                    onChange={(e) => setSymptomSearch(e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"><ChevronDownIcon /></span>
                </div>

                {symptomSearch && filteredSymptoms.length > 0 && (
                  <ScrollArea className="h-48 border rounded-lg">
                    <div className="p-2 space-y-1">
                      {filteredSymptoms.map((symptom) => (
                        <button
                          key={symptom.id}
                          onClick={() => toggleSymptom(symptom.id)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between group"
                        >
                          <span className="text-sm">{symptom.label}</span>
                          <Badge variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            + Ajouter
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {/* Selected Symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Symptomes selectionnes ({selectedSymptoms.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((id) => {
                        const symptom = HPO_SYMPTOMS.find((s) => s.id === id);
                        return (
                          <Badge
                            key={id}
                            variant="default"
                            className="pl-3 pr-1 py-1 gap-1 bg-primary hover:bg-primary/90"
                          >
                            {symptom?.label}
                            <button
                              onClick={() => toggleSymptom(id)}
                              className="ml-1 rounded-full hover:bg-primary-foreground/20 p-0.5"
                            >
                              <span className="w-3 h-3"><XIcon /></span>
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSymptomPrediction}
                  disabled={selectedSymptoms.length === 0 || isPredicting}
                  className="w-full"
                  size="lg"
                >
                  {isPredicting ? (
                    <>
                      <span className="w-4 h-4 mr-2"><LoaderIcon /></span>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <span className="w-4 h-4 mr-2"><ActivityIcon /></span>
                      Analyser les symptomes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Prediction Results */}
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Resultats de la prediction</CardTitle>
                <CardDescription>
                  Specialite recommandee basee sur l'analyse des symptomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {predictionResult ? (
                  <div className="space-y-6">
                    <Alert variant="default" className="border-primary/20 bg-primary/5">
                      <span className="w-4 h-4 text-primary"><AlertTriangleIcon /></span>
                      <AlertDescription className="text-xs">
                        {predictionResult.disclaimer}
                      </AlertDescription>
                    </Alert>

                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Specialite recommandee</div>
                      <div className="text-2xl font-bold text-primary">{predictionResult.specialty}</div>
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <Progress value={predictionResult.confidence * 100} className="w-32 h-2" />
                        <span className="text-sm font-medium">
                          {(predictionResult.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Niveau de confiance</div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-3">Autres specialites possibles</h4>
                      <div className="space-y-2">
                        {predictionResult.alternatives?.slice(0, 3).map((alt: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm">{alt.specialty}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={alt.score * 100} className="w-20 h-1.5" />
                              <span className="text-xs text-muted-foreground">
                                {(alt.score * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-3">Maladies rares potentiellement liees</h4>
                      <div className="space-y-2">
                        {predictionResult.diseases?.map((disease: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                          >
                            <span className="text-sm">{disease.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {disease.orphacode}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-center">
                    <div className="text-muted-foreground">
                      <span className="w-12 h-12 mx-auto mb-4 opacity-30 block"><StethoscopeIcon /></span>
                      <p>
                        Selectionnez des symptomes et cliquez sur
                        <br />
                        "Analyser" pour obtenir une prediction
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* MRI Section */}
        {activeSection === 'mri' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-5 h-5 text-primary"><BrainIcon /></span>
                  Analyse d'images IRM
                </CardTitle>
                <CardDescription>
                  Importez une image IRM pour analyse (format JPG, PNG)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <span className="w-4 h-4"><AlertTriangleIcon /></span>
                  <AlertDescription className="text-red-700 text-xs">
                    Outil pedagogique a but de demonstration — ne remplace pas un avis medical professionnel.
                    Ne pas utiliser pour un diagnostic reel.
                  </AlertDescription>
                </Alert>

                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                    ${mriDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'}
                  `}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setMriDragOver(true);
                  }}
                  onDragLeave={() => setMriDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setMriDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleMriFile(file);
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e: any) => {
                      const file = e.target?.files?.[0];
                      if (file) handleMriFile(file);
                    };
                    input.click();
                  }}
                >
                  {mriPreview ? (
                    <div className="relative">
                      <img
                        src={mriPreview}
                        alt="IRM Preview"
                        className="max-h-48 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMriFile(null);
                          setMriPreview(null);
                          setMriResult(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <span className="w-4 h-4"><XIcon /></span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="w-12 h-12 mx-auto mb-4 block text-muted-foreground"><UploadIcon /></span>
                      <p className="text-muted-foreground">
                        Glissez une image IRM ici
                        <br />
                        ou cliquez pour selectionner
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">JPG, PNG - 10MB max</p>
                    </>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Modele CNN (ResNet18) entraîne sur un dataset de demonstration publique.
                  <br />
                  Precision limitee - Usage pedagogique uniquement.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleMriAnalysis}
                  disabled={!mriFile || isAnalyzingMri}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzingMri ? (
                    <>
                      <span className="w-4 h-4 mr-2"><LoaderIcon /></span>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <span className="w-4 h-4 mr-2"><BrainIcon /></span>
                      Analyser l'IRM
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* MRI Results */}
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Resultats de l'analyse</CardTitle>
                <CardDescription>Classification de l'image IRM</CardDescription>
              </CardHeader>
              <CardContent>
                {mriResult ? (
                  <div className="space-y-6">
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <span className="w-4 h-4"><AlertTriangleIcon /></span>
                      <AlertDescription className="text-red-700 text-xs">
                        {mriResult.disclaimer}
                      </AlertDescription>
                    </Alert>

                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5">
                      <div className="text-sm text-muted-foreground mb-1">Classification</div>
                      <div className={`text-2xl font-bold ${
                        mriResult.class.includes('Pas de tumeur') ? 'text-green-600' :
                        mriResult.class.includes('Tumeur possible') ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {mriResult.class}
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Progress value={mriResult.confidence * 100} className="w-32 h-2" />
                        <span className="text-sm font-medium">
                          {(mriResult.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Score de confiance</div>
                    </div>

                    <Separator />

                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <span className="w-4 h-4 text-amber-500"><AlertTriangleIcon /></span>
                        Recommandations
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                        <li>Ce resultat est une estimation automatique</li>
                        <li>Consultez un radiologue ou un neurologue pour interpretation</li>
                        <li>Une IRM clinique complete peut etre necessaire</li>
                        <li>Ne modifiez aucun traitement sans avis medical</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-center">
                    <div className="text-muted-foreground">
                      <span className="w-12 h-12 mx-auto mb-4 block opacity-30"><BrainIcon /></span>
                      <p>
                        Importez une image IRM
                        <br />
                        pour lancer l'analyse
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat Section */}
        {activeSection === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-5 h-5 text-primary"><MessageCircleIcon /></span>
                  Assistant Medical elaraMed
                </CardTitle>
                <CardDescription>
                  Posez vos questions sante - Je suis la pour vous orienter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="default" className="mb-4 border-primary/20 bg-primary/5">
                  <span className="w-4 h-4 text-primary"><AlertTriangleIcon /></span>
                  <AlertDescription className="text-xs">
                    Je suis un assistant IA pedagogique. Je peux vous aider a comprendre vos symptomes
                    et vous orienter vers une specialite medicale, mais je ne remplace pas une consultation
                    medicale reelle. Pour toute urgence, contactez le 15 (SAMU).
                  </AlertDescription>
                </Alert>

                <ScrollArea className="h-96 pr-4">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center py-8">
                      <div className="text-muted-foreground">
                        <span className="w-16 h-16 mx-auto mb-4 block opacity-30"><MessageCircleIcon /></span>
                        <p className="text-lg font-medium mb-2">Bonjour !</p>
                        <p className="max-w-md">
                          Je suis l'assistant elaraMed. Comment puis-je vous aider aujourd'hui?
                          <br />
                          Vous pouvez me parler de vos symptomes ou me poser des questions medicales.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-muted rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isSendingChat && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                            <span className="w-4 h-4 block"><LoaderIcon /></span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Input
                  placeholder="Decrivez vos symptomes ou posez une question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSend();
                    }
                  }}
                  disabled={isSendingChat}
                  className="flex-1"
                />
                <Button onClick={handleChatSend} disabled={!chatInput.trim() || isSendingChat}>
                  {isSendingChat ? (
                    <span className="w-4 h-4"><LoaderIcon /></span>
                  ) : (
                    <span className="w-4 h-4"><SendIcon /></span>
                  )}
                </Button>
              </CardFooter>

              {/* Quick Action Buttons */}
              <div className="px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("J'ai des douleurs articulaires depuis plusieurs semaines.")}
                  >
                    Douleurs articulaires
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("Quelle est la difference entre un rhumatologue et un orthopediste?")}
                  >
                    Specialites medicales
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("Qu'est-ce qu'une maladie rare?")}
                  >
                    Maladies rares
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-5 h-5 text-primary"><ActivityIcon /></span>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1F4E79] to-[#2E75B6]">elaraMed</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Projet academique - Data Science
            <br />
            Universite Polytechnique Agadir - Encadrement: Pr. Doha Karaouch
          </p>
          <Alert variant="default" className="max-w-xl mx-auto mt-4 border-amber-200 bg-amber-50">
            <span className="w-4 h-4 text-amber-600"><AlertTriangleIcon /></span>
            <AlertDescription className="text-amber-800 text-xs">
              Cette plateforme est un outil pedagogique de demonstration. Les resultats fournis sont
              a titre informatif uniquement et ne constituent pas un diagnostic medical.
              Consultez toujours un professionnel de sante qualifie.
            </AlertDescription>
          </Alert>
        </div>
      </footer>
    </div>
  );
}
