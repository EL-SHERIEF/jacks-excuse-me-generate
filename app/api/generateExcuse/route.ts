import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { saveExcuse } from '@/lib/supabase';

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const TONE_DESCRIPTIONS = {
  funny: 'ضحك مصري خفيف بشكل طبيعي، هزار باين كأنه طالع تلقائي من شخص فعلاً مش من AI',
  believable: 'كلام مصري بسيط واقعي فيه إحساس بالصدق والإلتزام من غير ما يبقى رسمي',
  dramatic: 'كلام عاطفي بس طبيعي كأنه شكوى أو فضفضة بسيطة للعميل فيها احساس حقيقي مش تمثيل'
};

// توليد العذر الرئيسي
async function generateExcuseText(tone: string, excuseType: string): Promise<string> {
  const toneDesc =
    TONE_DESCRIPTIONS[tone as keyof typeof TONE_DESCRIPTIONS] || 'طبيعي ومقنع';
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  try {
    const prompt = `
اكتبلي رسالة واتساب مصرية عادية بين فريلانسر وعميله تكون كأنها من بني آدم طبيعي مش AI خالص
اوعى تستخدم أي فواصل أو نقط أو علامات ترقيم
مافيش تنسيق ولا جمل مرتبة ولا أسلوب أدبي
كأن واحد فعلاً بيكتب بسرعة على واتساب وهو مضغوط أو محرج أو بيحاول يشرح موقفه للعميل بشكل طبيعي

انت خبير في كتابة أعذار للفريلانسرز المصريين
اكتب عذر واحد فقط يكون باللهجة المصرية اليومية وبأسلوب طبيعي جدًا من غير مقدمات رسمية
العذر يكون ${toneDesc}
اربط العذر بنوعه: ${excuseType}، سواء كان بسبب ضغط شغل، مشكلة تقنية، ظروف مفاجئة، تعب، أو موقف يومي حقيقي

خلي العذر باين واقعي وصادق ومقنع نفسيًا باستخدام:
- علامات السلوك الصادق (تردد خفيف – توضيح تفاصيل صغيرة – ألفاظ طبيعية زي "بص" "يعني" "بجد" "والله العظيم" "حقيقي")
- خليك دايمًا طبيعي مش مترتب
- خليك بشري ١٠٠٪ كأنك بتكلم صاحبك العميل

متكتبش ولا كلمة زيادة غير الرسالة نفسها، ولا أي شرح، ولا تنسيق JSON، ولا ترتيب
رجّع الرسالة زي ما هي كأنها واتساب عادي
`;

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

    if (
      !process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_API_KEY === 'your_gemini_api_key_here'
    ) {
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
    });
  } catch (error: any) {
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
