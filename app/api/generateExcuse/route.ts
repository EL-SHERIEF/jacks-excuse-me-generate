import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { saveExcuse } from '@/lib/supabase';

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const TONE_DESCRIPTIONS = {
  funny: 'ضحك مصري خفيف, كوميديا سوداء حقيقية لا تظهر انها كوميديا لاكنها بتضحك, ضحك بسيط',
  believable: 'واقعي، فني، مهني، ومقنع بشكل كبير',
  dramatic: 'مرضي يؤثر على عاطفة العميل، ومؤثر بشكل كبير'
};

// توليد العذر الرئيسي
async function generateExcuseText(tone: string, excuseType: string): Promise<string> {
  const toneDesc = TONE_DESCRIPTIONS[tone as keyof typeof TONE_DESCRIPTIONS] || 'creative and witty';
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
 const prompt = `علميا يكون فيه طرق اقناع كويسة بدون مقدمات كأني هبعته واتساب ،انت خبير في كتابة أعذار للفريلانسرز باللهجة المصرية اليومية،انت بني أدم مصري إتكلم بطريقة بشري بيتكلم شات واتساب مصري بين الفريلانسر وعميله، هدفك توليد عذر واحد من جملة واحدة ومقنع جدًا.
العذر يكون ${toneDesc}، واقعي، طبيعي، ومهني، ممكن يكون طويل (2-5 جمل أو أكثر) ويشمل تفاصيل يومية دقيقة.
يراعي نوع العذر: ${excuseType}، سواء كان مشكلة تقنية، ضغط شغل، ظروف شخصية مرتبطة بالعمل، مواعيد، مراجعات، أو أي موقف يومي حقيقي يؤثر على القدرة على تسليم المشروع.
العذر لازم يكون صادق ومقنع للعميل ويظهر أنك ملتزم بجودة الشغل، ويخليه متفهم للسبب ويحافظ على ثقته فيك.
استخدم أسلوب سرد طبيعي باللهجة المصرية، استخدم تعابير يومية ومواقف مألوفة للفريلانسرز المصريين.
ركز على الواقعية: وضّح السبب، الموقف، وكيف أثر على جدولك أو على الشغل، مع الحفاظ على المهنية.
ارجع النص كامل، جاهز للاستخدام مباشرة، بدون أي إضافات، بدون شرح، بدون قائمة أو تنسيق JSON.`;

    const result = await model.generateContent(prompt);
    if (!result.response) throw new Error('No response from Gemini API');

    const text = result.response.text().trim();
    if (!text) throw new Error('Empty response from Gemini API');

    return text;
  } catch (error: any) {
    console.error('Error in generateExcuseText:', error);
    throw new Error(`Failed to generate excuse text: ${error.message}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tone, excuseType } = await request.json();

    if (!tone || !['funny', 'believable', 'dramatic'].includes(tone)) {
      return NextResponse.json(
        { error: 'Invalid tone. Must be funny, believable, or dramatic.' },
        { status: 400 }
      );
    }

      if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json(
        {
          error: 'Google API key not configured.',
          excuse: 'يا عم أنا النهاردة تعبان أوي ومحتاج أأجل شوية شغل'
        },
        { status: 200 }
      );
    }

    // توليد العذر
    const excuseText = await generateExcuseText(tone, excuseType);

    // حفظ العذر في Supabase
    const savedExcuse = await saveExcuse({
      tone: tone as 'funny' | 'believable' | 'dramatic',
      excuse_text: excuseText,
      user_id: undefined
    });

    return NextResponse.json({
      excuse: excuseText,
      excuseId: savedExcuse?.id
    });  } catch (error: any) {
    console.error('Error generating excuse:', error);
    return NextResponse.json(
      { 
        error: `Failed to generate excuse: ${error.message}`,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
