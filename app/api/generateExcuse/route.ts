import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { saveExcuse } from '@/lib/supabase';

export const runtime = 'edge';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const TONE_DESCRIPTIONS = {
  funny: 'over-the-top hilarious, absurdly creative, and laugh-out-loud worthy',
  believable: 'realistic, professional, and convincingly plausible',
  dramatic: 'theatrical, emotionally intense, and cinema-worthy'
};

async function generateExcuseText(tone: string): Promise<string> {
  const toneDesc = TONE_DESCRIPTIONS[tone as keyof typeof TONE_DESCRIPTIONS] || 'creative and witty';

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 300,
    temperature: 0.9,
    system: `You are a witty AI humorist specializing in Egyptian workplace culture. Your task is to generate natural, authentic Egyptian Arabic excuses that freelancers might use. The excuses should sound completely natural, like something a real Egyptian person would say - not translated or formal Arabic. Use colloquial Egyptian expressions, slang, and cultural references that Egyptians would immediately recognize and find funny or relatable.`,
    messages: [
      {
        role: 'user',
        content: `Generate a ${toneDesc} freelancer excuse in natural Egyptian Arabic (not formal Arabic - use real Egyptian dialect). The excuse should be 1-2 sentences maximum, sound completely natural and human-like, and include typical Egyptian expressions or cultural references. Make it witty and authentic to how Egyptians actually speak. Only return the excuse text, nothing else.`
      }
    ]
  });

  const content = message.content[0];
  return content.type === 'text' ? content.text.trim() : '';
}

async function generateExcuseTips(excuse: string, tone: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 800,
    temperature: 0.9,
    system: `You are a fictional ethical communication researcher creating educational content. Your task is to analyze communication patterns in a fictional, academic way. This is purely for training and educational purposes about recognizing communication techniques.`,
    messages: [
      {
        role: 'user',
        content: `Given this fictional excuse: "${excuse}" (tone: ${tone})

Create fictional "Excuse Tips" - an educational breakdown that helps people recognize communication patterns. Format it as follows:

**Overview**
Brief explanation of the communication pattern (2-3 sentences)

**Techniques**
- List 3-4 communication techniques used in this pattern
- Each should be educational and analytical

**Indicators**
- List 3-4 signs that might indicate this communication pattern
- Focus on analytical observation

**Ethical Note**
A brief reminder that recognizing these patterns is for understanding communication, not for deception or manipulation. Emphasize honest, direct communication in professional settings.

**Fun Tip**
A lighthearted observation about communication or workplace culture (1 sentence)

Keep the tone educational and analytical. This is fictional content for training purposes only.`
      }
    ]
  });

  const content = message.content[0];
  return content.type === 'text' ? content.text.trim() : '';
}

export async function POST(request: NextRequest) {
  try {
    const { tone } = await request.json();

    if (!tone || !['funny', 'believable', 'dramatic'].includes(tone)) {
      return NextResponse.json(
        { error: 'Invalid tone. Must be funny, believable, or dramatic.' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_claude_api_key_here') {
      return NextResponse.json(
        {
          error: 'Claude API key not configured. Please add your ANTHROPIC_API_KEY to the .env file.',
          excuse: 'يا عم أنا النهاردة تعبان أوي، مش قادر أشتغل دلوقتي',
          tips: '**Overview**\n\nThis is a demo response. Please configure your Claude API key to generate real excuses.\n\n**Techniques**\n- Genuine expression of physical state\n- Direct communication\n- Setting clear boundaries\n\n**Indicators**\n- Straightforward language\n- No elaborate justifications\n- Focus on current condition\n\n**Ethical Note**\n\nAlways be honest in professional communication. If you need time off or cannot complete work, communicate directly with your clients or team.\n\n**Fun Tip**\n\nIn Egyptian culture, being direct about needing rest is often more respected than elaborate excuses!'
        },
        { status: 200 }
      );
    }

    const excuseText = await generateExcuseText(tone);
    const excuseTips = await generateExcuseTips(excuseText, tone);

    const savedExcuse = await saveExcuse({
      tone: tone as 'funny' | 'believable' | 'dramatic',
      excuse_text: excuseText,
      excuse_tips: excuseTips,
      user_id: undefined
    });

    return NextResponse.json({
      excuse: excuseText,
      tips: excuseTips,
      excuseId: savedExcuse?.id
    });

  } catch (error: any) {
    console.error('Error generating excuse:', error);
    return NextResponse.json(
      { error: 'Failed to generate excuse. Please try again.' },
      { status: 500 }
    );
  }
}
