import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Vuprosut e zaduljitelen' },
        { status: 400 }
      );
    }

    // Suzdavame embedding na vuprosa
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: question,
    });
    
    const embedding = embeddingResponse.data[0].embedding;

    // Tursim v Supabase
    const { data: accounts, error } = await supabase.rpc('search_accounts', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 5,
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Greshka pri tursene v bazata danni' },
        { status: 500 }
      );
    }

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({
        answer: "Ne namerih informaciya za tova v smetkoplana. Opitayte s drugi dumi.",
        sources: [],
        confidence: 0,
      });
    }

    // Podgotvyame kontekst
    const context = accounts.map((acc: any) => 
      "Smetka " + acc.code + ": " + acc.short_name + "\nPriroda: " + acc.nature + "\nOpisanie: " + acc.what_it_represents
    ).join("\n---\n");

    const systemPrompt = "Ti si schetovoden asistent na balgarski ezik. Imash dostup SAMO do slednite smetki:\n\n" + context + "\n\nSTROGI PRAVILA:\n1. Otgovaryay SAMO bazirayki se na gornite smetki.\n2. Ako ne znaesh, kazhi: Ne razpolagam s tazi informaciya.\n3. NE izpolzvay obshti znaniya izvan predostavenite danni.\n4. Obysnyavay logikata.\n5. Otgovaryay na balgarski ezik.";

    // Vazhen moment: izpolzvame gpt-3.5-turbo vmesto gpt-4 (po evtino, po dostupno)
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // TUK E PROMYANATA!
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      temperature: 0,
      max_tokens: 800,
    });

    return NextResponse.json({
      answer: completion.choices[0].message.content,
      sources: accounts.map((a: any) => ({ code: a.code, name: a.short_name })),
      confidence: 'high',
    });

  } catch (error: any) {
    console.error('API Error:', error);
    
    // Proverka dali e problem s kvotata
    if (error?.error?.code === 'insufficient_quota') {
      return NextResponse.json({
        answer: "Izvinete, no API kvotata e izcherpana. Molya svurjete se s administratora za dobavqne na krediti.",
        sources: [],
        confidence: 0,
      });
    }
    
    return NextResponse.json(
      { error: 'Vutreshna greshka na survara' },
      { status: 500 }
    );
  }
}