import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// System prompt for the medical chatbot - French language, cautious tone
const SYSTEM_PROMPT = `Tu es l'assistant medical elaraMed, un chatbot pedagogique developpe pour aider les patients a comprendre leurs symptomes et a s'orienter vers la bonne specialite medicale.

REGLES IMPORTANTES - A NE JAMAIS VIOLER:

1. NE JAMAIS formuler de diagnostic definitif. Tu peux proposer des hypotheses ou orienter, mais toujours avec des reserves.

2. NE JAMAIS donner de posologies, dosages ou recommandations de traitements specifiques. Redirige toujours vers un professionnel de sante pour les traitements.

3. NE JAMAIS pretendre avoir une precision de 100%. Si tu n'es pas sur, dis-le honnetement.

4. Toujours rappeler que tu es un outil pedagogique et que les resultats doivent etre valides par un professionnel de sante.

5. En cas d'urgence (symptomes graves comme difficultes respiratoires, douleurs thoraciques, perte de conscience), conseiller d'appeler le 15 (SAMU) ou de se rendre aux urgences.

6. Parler UNIQUEMENT en francais correct, avec un ton medical rassurant mais prudent.

7. Si une prediction de specialite est fournie dans le contexte, l'utiliser comme base de discussion mais pas comme certitude absolue.

8. Etre empathique et comprehensif, mais rester professionnel et factuel.

9. Ne pas utiliser de jargon medical excessif - expliquer simplement.

10. Toujours encourager la consultation medicale reel avant toute decision de sante.

FORMAT DES REPONSES:
- Utilise un langage clair et accessible
- Structure tes reponses avec des paragraphes courts
- Termine par une recommandation de consultation si pertinent
- Inclus des rappels de securite quand necessaire

Tu es la pour aider, orienter et rassurer, jamais pour remplacer un avis medical professionnel.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function callClaudeAPI(messages: ChatMessage[]): Promise<string> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');

  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not configured, using fallback response');
    return "Je suis desole, le service d'assistance n'est pas disponible actuellement. Veuillez consulter un professionnel de sante ou appeler le 15 en cas d'urgence.";
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || "Je n'ai pas pu generer de reponse. Veuillez reformuler votre question.";
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return "Je rencontre des difficultes techniques. Pour toute question medicale urgente, veuillez contacter votre medecin ou appeler le 15.";
  }
}

function getFallbackResponse(messages: ChatMessage[]): string {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

  if (lastMessage.includes('bonjour') || lastMessage.includes('salut')) {
    return "Bonjour ! Je suis l'assistant elaraMed. Comment puis-je vous aider aujourd'hui ? N'hesitez pas a me decrire vos symptomes ou a me poser des questions sur les specialites medicales.";
  }

  if (lastMessage.includes('douleur') && lastMessage.includes('articul')) {
    return "Les douleurs articulaires peuvent avoir de nombreuses causes : arthrite, arthrose, traumatisme, ou maladies auto-immunes. Un rhumatologue est le specialiste le plus approprie pour evaluer ces symptomes.\n\nJe vous recommande de consulter un professionnel de sante pour un examen clinique complet. En attendant, le repos et l'application de froid/chaud selon la cause peut soulager temporairement.";
  }

  if (lastMessage.includes('tumeur') || lastMessage.includes('cancer')) {
    return "Je comprends votre inquietude concernant cette possibilite. Il est important de ne pas tirer de conclusions precipites.\n\nSeuls des examens medicaux approfondis (IRM, biopsie, analyses sanguines) permettent d'etablir un diagnostic precis. Si vous avez des preoccupations, je vous encourage vivement a consulter votre medecin traitant qui pourra vous orienter vers un specialiste si necessaire.\n\nEn cas de symptomes inquietants (perte de poids inexpliquee, fatigue intense, douleurs persistantes), consultez rapidement.";
  }

  if (lastMessage.includes('urgence') || lastMessage.includes('grave') || lastMessage.includes('15')) {
    return "Si vous etes dans une situation d'urgence medicale (douleurs thoraciques, difficultes respiratoires, perte de conscience, saignement abondant), appelez IMMEDIATEMENT le 15 (SAMU) ou rendez-vous aux urgences les plus proches.\n\nNe perdez pas de temps a chercher des informations en ligne dans ces situations. Votre sante est prioritaire.";
  }

  if (lastMessage.includes('specialite') || lastMessage.includes('rh') || lastMessage.includes('neuro')) {
    return "Voici les principales specialites medicales pertinentes pour elaraMed :\n\n- **Rhumatologie** : maladies des os, articulations, muscles\n- **Neurologie** : systeme nerveux, maladies neurologiques\n- **Orthopedie** : chirurgie osseuse et articulaire\n- **Genetique medicale** : maladies hereditaires, maladies rares\n- **Medecine physique** : readaptation, reeducation\n- **Pediatrie** : sante des enfants\n\nJe peux vous aider a determiner quelle specialite est la plus adaptee a vos symptomes. Consultez toujours un medecin pour une orientation precise.";
  }

  if (lastMessage.includes('maladie rare') || lastMessage.includes('orph')) {
    return "Une maladie rare est une maladie qui affecte moins d'une personne sur 2000. Il existe plus de 7000 maladies rares connues, touchant environ 3 millions de personnes en France.\n\nelaraMed se concentre sur les maladies musculo-squelettiques rares, dont 1606 sont recensees dans notre base de donnees Orphadata.\n\nLe diagnostic des maladies rares peut etre long et complexe. Les centres de reference des maladies rares et les consultations de genetique sont des ressources importantes pour les patients et leurs familles.";
  }

  return "Merci pour votre question. En tant qu'assistant elaraMed, je peux vous aider a comprendre vos symptomes et vous orienter vers la specialite medicale appropriee.\n\nCependant, je ne remplace pas une consultation medicale. Pour tout probleme de sante, consultez un professionnel de sante qualifie. En cas d'urgence, appelez le 15 (SAMU).\n\nPouvez-vous me decrire plus precisement vos symptomes ou me poser une question specifique ?";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { messages, prediction } = body as { messages: ChatMessage[]; prediction?: any };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add prediction context if available
    let contextMessages = [...messages];
    if (prediction && messages.length <= 2) {
      const contextMessage: ChatMessage = {
        role: 'user',
        content: `Contexte: Le modele de prediction a suggere la specialite "${prediction.specialty}" avec un score de confiance de ${(prediction.confidence * 100).toFixed(1)}%. Les symptomes selectionnes sont: ${prediction.symptoms?.join(', ') || 'non specifies'}. Question: ${messages[messages.length - 1]?.content || 'Quelle orientation meconseillez-vous?'}`,
      };
      contextMessages = [contextMessage];
    }

    // Try Claude API first, fallback to predefined responses
    let response: string;

    try {
      response = await callClaudeAPI(contextMessages);
    } catch (apiError) {
      console.warn('Claude API unavailable, using fallback:', apiError);
      response = getFallbackResponse(messages);
    }

    return new Response(
      JSON.stringify({ response }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
